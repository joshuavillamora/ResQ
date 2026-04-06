import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import time
from datetime import datetime, timedelta
from math import asin, cos, radians, sin, sqrt
from typing import Optional
from urllib.parse import parse_qs

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

try:
    from . import models, schemas
    from .database import SessionLocal, engine, get_db
    from .sms_parser import parse_sms_message
except ImportError:
    import models
    import schemas
    from database import SessionLocal, engine, get_db
    from sms_parser import parse_sms_message


app = FastAPI(title="ResQ Backend")

models.Base.metadata.create_all(bind=engine)


def ensure_report_columns():
    inspector = inspect(engine)
    if "reports" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("reports")}

    with engine.begin() as connection:
        if "sms_sender_code" not in columns:
            connection.execute(text("ALTER TABLE reports ADD COLUMN sms_sender_code VARCHAR(255)"))
        if "client_report_id" not in columns:
            connection.execute(text("ALTER TABLE reports ADD COLUMN client_report_id VARCHAR(255)"))


ensure_report_columns()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY", "resq-secret-key")
STAFF_SETUP_KEY = os.getenv("STAFF_SETUP_KEY")
TOKEN_HOURS = int(os.getenv("TOKEN_HOURS", "24"))
ALLOWED_ROLES = {"civilian", "responder", "station_admin"}
ALLOWED_DISASTER_TYPES = {
    "flood",
    "fire",
    "landslide",
    "typhoon",
    "earthquake",
    "medical emergency",
    "volcano",
}
DISASTER_TYPE_ALIASES = {
    "typhoon damage": "typhoon",
    "medical": "medical emergency",
}
ALLOWED_SEVERITY = {"low", "medium", "high"}
STAFF_ROLES = {"responder", "station_admin"}
ALLOWED_REPORT_STATUSES = {"unverified", "verified", "responding", "resolved", "false_report"}
ALLOWED_SOURCES = {"api", "sms"}
SENDER_CODE_PATTERN = re.compile(r"^(user|guest)_[a-z0-9][a-z0-9_-]*$")


class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_json(self, message: dict):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)

        for connection in dead_connections:
            self.disconnect(connection)


manager = ConnectionManager()

# ------------------------ UTILITY FUNCTIONS ------------------------

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def base64_url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def base64_url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_token(user: models.User) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "exp": int(time.time()) + (TOKEN_HOURS * 3600),
    }

    header_part = base64_url_encode(json.dumps(header, separators=(",", ":")).encode())
    payload_part = base64_url_encode(json.dumps(payload, separators=(",", ":")).encode())
    signature_input = f"{header_part}.{payload_part}".encode()
    signature = hmac.new(SECRET_KEY.encode(), signature_input, hashlib.sha256).digest()
    signature_part = base64_url_encode(signature)

    return f"{header_part}.{payload_part}.{signature_part}"


def decode_token(token: str) -> dict:
    try:
        header_part, payload_part, signature_part = token.split(".")
    except ValueError as error:
        raise HTTPException(status_code=401, detail="Invalid token format") from error

    expected_signature = hmac.new(
        SECRET_KEY.encode(),
        f"{header_part}.{payload_part}".encode(),
        hashlib.sha256,
    ).digest()
    try:
        received_signature = base64_url_decode(signature_part)
    except Exception as error:
        raise HTTPException(status_code=401, detail="Invalid token signature") from error

    if not hmac.compare_digest(expected_signature, received_signature):
        raise HTTPException(status_code=401, detail="Invalid token signature")

    try:
        payload = json.loads(base64_url_decode(payload_part))
    except Exception as error:
        raise HTTPException(status_code=401, detail="Invalid token payload") from error

    if int(payload.get("exp", 0)) < int(time.time()):
        raise HTTPException(status_code=401, detail="Token expired")

    return payload


def normalize_disaster_type(disaster_type: str) -> str:
    clean_value = " ".join(disaster_type.strip().lower().replace("_", " ").split())
    clean_value = DISASTER_TYPE_ALIASES.get(clean_value, clean_value)
    if clean_value not in ALLOWED_DISASTER_TYPES:
        raise HTTPException(status_code=400, detail="Invalid disaster type")
    return clean_value


def normalize_role(role: str) -> str:
    clean_value = role.strip().lower()
    if clean_value not in ALLOWED_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")
    return clean_value


def clean_required_text(value: str, field_name: str) -> str:
    clean_value = value.strip()
    if not clean_value:
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    return clean_value


def clean_optional_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None

    clean_value = value.strip()
    return clean_value or None


def normalize_status(report_status: str) -> str:
    clean_value = report_status.strip().lower().replace(" ", "_")
    if clean_value not in ALLOWED_REPORT_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid report status")
    return clean_value


def normalize_source(source: str) -> str:
    clean_value = source.strip().lower()
    if clean_value not in ALLOWED_SOURCES:
        raise HTTPException(status_code=400, detail="Invalid source")
    return clean_value


def validate_coordinates(latitude: float, longitude: float):
    if latitude < -90 or latitude > 90:
        raise HTTPException(status_code=400, detail="Latitude must be between -90 and 90")
    if longitude < -180 or longitude > 180:
        raise HTTPException(status_code=400, detail="Longitude must be between -180 and 180")


def normalize_sender_code(sender_code: Optional[str]) -> Optional[str]:
    clean_value = clean_optional_text(sender_code)
    if not clean_value:
        return None

    clean_value = clean_value.lower()
    if not SENDER_CODE_PATTERN.match(clean_value):
        raise HTTPException(status_code=400, detail="Invalid sms sender code")

    return clean_value


def resolve_api_sender_code(current_user: Optional[models.User], sender_code: Optional[str]) -> Optional[str]:
    normalized_sender_code = normalize_sender_code(sender_code)

    if current_user:
        return f"user_{current_user.id}"

    if normalized_sender_code and normalized_sender_code.startswith("user_"):
        raise HTTPException(status_code=400, detail="Guest reports cannot claim a user sms sender code")

    return normalized_sender_code


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    delta_lon = lon2 - lon1
    delta_lat = lat2 - lat1
    value = sin(delta_lat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(delta_lon / 2) ** 2
    return 2 * 6371 * asin(sqrt(value))


def score_from_count(report_count: int) -> int:
    if report_count >= 5:
        return 100
    if report_count == 4:
        return 90
    if report_count == 3:
        return 75
    if report_count == 2:
        return 55
    return 20


def refresh_confidence_for_same_type(db: Session, disaster_type: str):
    cutoff = datetime.utcnow() - timedelta(hours=2)
    reports = (
        db.query(models.Report)
        .filter(models.Report.disaster_type == disaster_type)
        .filter(models.Report.created_at >= cutoff)
        .all()
    )

    for current_report in reports:
        nearby_count = 0
        for other_report in reports:
            distance = haversine_km(
                current_report.latitude,
                current_report.longitude,
                other_report.latitude,
                other_report.longitude,
            )
            if distance <= 2:
                nearby_count += 1
        current_report.confidence = score_from_count(nearby_count)

    db.commit()


def apply_report_filters(
    query,
    disaster_type: Optional[str] = None,
    report_status: Optional[str] = None,
    barangay: Optional[str] = None,
    source: Optional[str] = None,
):
    if disaster_type:
        query = query.filter(models.Report.disaster_type == normalize_disaster_type(disaster_type))
    if report_status:
        query = query.filter(models.Report.status == normalize_status(report_status))
    if barangay:
        query = query.filter(models.Report.barangay.ilike(f"%{barangay.strip()}%"))
    if source:
        query = query.filter(models.Report.source == normalize_source(source))
    return query

# ------------------------ DATA SERIALIZATION ------------------------

def user_to_dict(user: models.User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "phone_number": user.phone_number,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


def report_to_dict(
    report: models.Report,
    include_edit_token: bool = False,
    include_reporter: bool = True,
) -> dict:
    data = {
        "id": report.id,
        "user_id": report.user_id,
        "sms_sender_code": report.sms_sender_code,
        "client_report_id": report.client_report_id,
        "disaster_type": report.disaster_type,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "barangay": report.barangay,
        "status": report.status,
        "source": report.source,
        "confidence": report.confidence,
        "description": report.description,
        "severity": report.severity,
        "image_url": report.image_url,
        "images": [image.image_url for image in report.images],
        "created_at": report.created_at.isoformat() if report.created_at else None,
        "updated_at": report.updated_at.isoformat() if report.updated_at else None,
    }

    if include_reporter and report.user:
        data["reporter"] = {
            "id": report.user.id,
            "name": report.user.name,
            "phone_number": report.user.phone_number,
            "role": report.user.role,
        }

    if include_edit_token:
        data["edit_token"] = report.edit_token

    return data


def hotline_to_dict(hotline: models.Hotline) -> dict:
    return {
        "id": hotline.id,
        "name": hotline.name,
        "phone_number": hotline.phone_number,
        "category": hotline.category,
        "created_at": hotline.created_at.isoformat() if hotline.created_at else None,
    }

# ------------------------ AUTHENTICATION / USER FUNCTIONS ------------------------
def get_user_from_token(token: str, db: Session) -> models.User:
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user_id = int(user_id)
    except (TypeError, ValueError) as error:
        raise HTTPException(status_code=401, detail="Invalid token user") from error

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def get_optional_user(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ", 1)[1]
    return get_user_from_token(token, db)


def get_current_user(
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ", 1)[1]
    return get_user_from_token(token, db)


def require_staff(user: models.User):
    if user.role not in STAFF_ROLES:
        raise HTTPException(status_code=403, detail="Responder or station admin only")


def require_station_admin(user: models.User):
    if user.role != "station_admin":
        raise HTTPException(status_code=403, detail="Station admin only")


def create_report_image_if_needed(db: Session, report: models.Report, image_url: Optional[str]):
    if image_url:
        report.image_url = image_url
        db.add(models.ReportImage(report_id=report.id, image_url=image_url))


def can_edit_report(report: models.Report, current_user: Optional[models.User], edit_token: Optional[str]) -> bool:
    if current_user and current_user.role in STAFF_ROLES:
        return True
    if current_user and report.user_id == current_user.id:
        return True
    if not current_user and report.user_id is None and edit_token and report.edit_token == edit_token:
        return True
    return False


def get_existing_report_by_client_id(db: Session, client_report_id: Optional[str]) -> Optional[models.Report]:
    clean_value = clean_optional_text(client_report_id)
    if not clean_value:
        return None

    return db.query(models.Report).filter(models.Report.client_report_id == clean_value).first()


def can_return_duplicate_edit_token(
    report: models.Report,
    current_user: Optional[models.User],
    sms_sender_code: Optional[str],
) -> bool:
    if current_user and current_user.role in STAFF_ROLES:
        return True

    if current_user and report.user_id == current_user.id:
        return True

    if (
        not current_user
        and report.user_id is None
        and report.client_report_id
        and sms_sender_code
        and report.sms_sender_code == sms_sender_code
    ):
        return True

    return False


def resolve_sms_sender(sender_code: Optional[str], user_id: Optional[int], db: Session) -> tuple[Optional[int], Optional[str]]:
    normalized_sender_code = normalize_sender_code(sender_code)

    if normalized_sender_code and normalized_sender_code.startswith("user_"):
        try:
            parsed_user_id = int(normalized_sender_code.split("_", 1)[1])
        except ValueError:
            parsed_user_id = None

        if parsed_user_id is not None:
            existing_user = db.query(models.User).filter(models.User.id == parsed_user_id).first()
            if existing_user:
                return existing_user.id, normalized_sender_code
            return None, normalized_sender_code

    if normalized_sender_code:
        return None, normalized_sender_code

    if user_id is not None:
        existing_user = db.query(models.User).filter(models.User.id == user_id).first()
        if existing_user:
            return existing_user.id, f"user_{existing_user.id}"

    return None, None


@app.get("/")
def root():
    return {"message": "ResQ backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/register")
def register_user(
    request: schemas.RegisterRequest,
    db: Session = Depends(get_db),
    setup_key: Optional[str] = Header(default=None, alias="X-Setup-Key"),
):
    role = normalize_role(request.role)
    if role != "civilian" and (not STAFF_SETUP_KEY or setup_key != STAFF_SETUP_KEY):
        raise HTTPException(status_code=403, detail="Staff registration is not allowed")

    phone_number = clean_required_text(request.phone_number, "phone_number")
    password = clean_required_text(request.password, "password")
    existing_user = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    new_user = models.User(
        name=clean_required_text(request.name, "name"),
        phone_number=phone_number,
        password_hash=hash_password(password),
        role=role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "token": create_token(new_user),
        "user": user_to_dict(new_user),
    }


@app.post("/login")
def login_user(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    phone_number = clean_required_text(request.phone_number, "phone_number")
    password = clean_required_text(request.password, "password")
    user = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if not user or user.password_hash != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid phone number or password")

    return {
        "message": "Login successful",
        "token": create_token(user),
        "user": user_to_dict(user),
    }


@app.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return user_to_dict(current_user)


@app.post("/report")
async def create_report(
    report: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user),
):
    disaster_type = normalize_disaster_type(report.disaster_type)
    validate_coordinates(report.latitude, report.longitude)
    barangay = clean_required_text(report.barangay, "barangay")
    client_report_id = clean_optional_text(report.client_report_id)
    sms_sender_code = resolve_api_sender_code(current_user, report.sms_sender_code)

    existing_report = get_existing_report_by_client_id(db, client_report_id)
    if existing_report:
        return report_to_dict(
            existing_report,
            include_edit_token=can_return_duplicate_edit_token(existing_report, current_user, sms_sender_code),
        )

    new_report = models.Report(
        user_id=current_user.id if current_user else None,
        sms_sender_code=sms_sender_code,
        client_report_id=client_report_id,
        disaster_type=disaster_type,
        latitude=report.latitude,
        longitude=report.longitude,
        barangay=barangay,
        source="api",
        status="unverified",
        edit_token=secrets.token_hex(16),
    )

    db.add(new_report)
    db.commit()

    refresh_confidence_for_same_type(db, disaster_type)
    db.refresh(new_report)

    report_data = report_to_dict(new_report, include_edit_token=True)
    await manager.broadcast_json({"event": "report_created", "report": report_data})

    return report_data


@app.patch("/report/{report_id}")
async def update_report(
    report_id: int,
    request: schemas.ReportUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user),
):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if not can_edit_report(report, current_user, request.edit_token):
        raise HTTPException(status_code=403, detail="Not allowed to update this report")

    if request.severity:
        severity = request.severity.strip().lower()
        if severity not in ALLOWED_SEVERITY:
            raise HTTPException(status_code=400, detail="Invalid severity")
        report.severity = severity

    if request.description is not None:
        report.description = request.description.strip() if request.description else None

    image_url = request.image_url.strip() if request.image_url else None
    create_report_image_if_needed(db, report, image_url)

    db.add(report)
    db.commit()
    db.refresh(report)

    report_data = report_to_dict(report)
    await manager.broadcast_json({"event": "report_updated", "report": report_data})

    return report_data


@app.get("/reports/mine")
def get_my_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reports = (
        db.query(models.Report)
        .filter(models.Report.user_id == current_user.id)
        .order_by(models.Report.created_at.desc())
        .all()
    )
    return [report_to_dict(report) for report in reports]


@app.get("/reports")
def get_reports(
    disaster_type: Optional[str] = None,
    report_status: Optional[str] = Query(default=None, alias="status"),
    barangay: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    query = db.query(models.Report).order_by(models.Report.created_at.desc())
    query = apply_report_filters(query, disaster_type, report_status, barangay, source)

    reports = query.all()
    return [report_to_dict(report) for report in reports]


@app.get("/reports/feed")
def get_public_reports(
    limit: int = Query(default=50, ge=1, le=200),
    disaster_type: Optional[str] = None,
    report_status: Optional[str] = Query(default=None, alias="status"),
    barangay: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = (
        db.query(models.Report)
        .filter(models.Report.status != "false_report")
        .order_by(models.Report.created_at.desc())
    )
    query = apply_report_filters(query, disaster_type, report_status, barangay, source)
    reports = query.limit(limit).all()
    return [report_to_dict(report, include_reporter=False) for report in reports]


@app.get("/reports/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return report_to_dict(report)


@app.post("/sms")
async def create_sms_report(request: Request, db: Session = Depends(get_db)):
    sms_message = ""

    content_type = request.headers.get("content-type", "").lower()

    if "application/json" in content_type:
        payload = await request.json()
        sms_message = payload.get("sms", "") if isinstance(payload, dict) else ""
    elif "application/x-www-form-urlencoded" in content_type:
        parsed_form = parse_qs((await request.body()).decode())
        sms_message = (
            (parsed_form.get("sms") or [""])[0]
            or (parsed_form.get("Body") or [""])[0]
            or (parsed_form.get("body") or [""])[0]
            or (parsed_form.get("message") or [""])[0]
        )
    else:
        raw_body = await request.body()
        sms_message = raw_body.decode().strip()

    try:
        parsed_sms = parse_sms_message(clean_required_text(sms_message, "sms"))
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    disaster_type = normalize_disaster_type(parsed_sms["disaster_type"])
    validate_coordinates(parsed_sms["latitude"], parsed_sms["longitude"])
    client_report_id = clean_optional_text(parsed_sms.get("client_report_id"))

    existing_report = get_existing_report_by_client_id(db, client_report_id)
    if existing_report:
        return report_to_dict(existing_report)

    user_id, sender_code = resolve_sms_sender(parsed_sms.get("sender_code"), parsed_sms.get("user_id"), db)

    new_report = models.Report(
        user_id=user_id,
        sms_sender_code=sender_code,
        client_report_id=client_report_id,
        disaster_type=disaster_type,
        latitude=parsed_sms["latitude"],
        longitude=parsed_sms["longitude"],
        barangay=clean_required_text(parsed_sms["barangay"], "barangay"),
        source="sms",
        status="unverified",
        edit_token=secrets.token_hex(16),
    )

    db.add(new_report)
    db.commit()

    refresh_confidence_for_same_type(db, disaster_type)
    db.refresh(new_report)

    report_data = report_to_dict(new_report)
    await manager.broadcast_json({"event": "report_created", "report": report_data})

    return report_data


@app.post("/reports/{report_id}/verify")
async def verify_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "verified"
    db.add(models.Verification(report_id=report.id, user_id=current_user.id, action="confirm"))
    db.add(report)
    db.commit()
    db.refresh(report)

    report_data = report_to_dict(report)
    await manager.broadcast_json({"event": "report_status_changed", "report": report_data})

    return report_data


@app.post("/reports/{report_id}/flag")
async def flag_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "false_report"
    db.add(models.Verification(report_id=report.id, user_id=current_user.id, action="flag"))
    db.add(report)
    db.commit()
    db.refresh(report)

    report_data = report_to_dict(report)
    await manager.broadcast_json({"event": "report_status_changed", "report": report_data})

    return report_data


@app.post("/reports/{report_id}/respond")
async def respond_to_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "responding"
    db.add(report)
    db.commit()
    db.refresh(report)

    report_data = report_to_dict(report)
    await manager.broadcast_json({"event": "report_status_changed", "report": report_data})

    return report_data


@app.post("/reports/{report_id}/resolve")
async def resolve_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "resolved"
    db.add(report)
    db.commit()
    db.refresh(report)

    report_data = report_to_dict(report)
    await manager.broadcast_json({"event": "report_status_changed", "report": report_data})

    return report_data


@app.get("/hotlines")
def get_hotlines(db: Session = Depends(get_db)):
    hotlines = db.query(models.Hotline).order_by(models.Hotline.category, models.Hotline.name).all()
    return [hotline_to_dict(hotline) for hotline in hotlines]


@app.post("/hotlines")
def create_hotline(
    request: schemas.HotlineCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_station_admin(current_user)

    new_hotline = models.Hotline(
        name=clean_required_text(request.name, "name"),
        phone_number=clean_required_text(request.phone_number, "phone_number"),
        category=clean_required_text(request.category, "category").lower(),
    )
    db.add(new_hotline)
    db.commit()
    db.refresh(new_hotline)

    return hotline_to_dict(new_hotline)


@app.get("/responders")
def get_responders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_staff(current_user)

    responders = (
        db.query(models.User)
        .filter(models.User.role.in_(list(STAFF_ROLES)))
        .order_by(models.User.created_at.asc())
        .all()
    )
    return [
        {
            **user_to_dict(responder),
            "verification_count": len(responder.verifications),
            "report_count": len(responder.reports),
        }
        for responder in responders
    ]


@app.websocket("/ws/reports")
async def reports_websocket(websocket: WebSocket):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    db = SessionLocal()

    try:
        user = get_user_from_token(token, db)
        require_staff(user)
        await manager.connect(websocket)
        await websocket.send_json({"event": "connected", "message": "WebSocket connected"})

        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
    finally:
        db.close()
