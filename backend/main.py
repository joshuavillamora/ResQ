from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import schemas

app = FastAPI()

@app.get("/")
def root():
    return {}

models.Base.metadata.create_all(bind=engine)

@app.post("/report")
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    new_report = models.Report(
        user_id=report.user_id,
        disaster_type=report.disaster_type,
        latitude=report.latitude,
        longitude=report.longitude,
        municipality=report.municipality,
        barangay=report.barangay
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report

@app.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()

@app.post("/sms")
def parse_sms(sms: str, db: Session = Depends(get_db)):
    parts = sms.split("|")
    if len(parts) != 6:
        return {"error": "Invalid SMS"}
    disaster_type, user_id, lat, lng, municipality, barangay = parts
    new_report = models.Report(
        user_id=user_id,
        disaster_type=disaster_type,
        latitude=float(lat),
        longitude=float(lng),
        municipality=municipality,
        barangay=barangay
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report