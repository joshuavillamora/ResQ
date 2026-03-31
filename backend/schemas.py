from typing import Optional

from pydantic import BaseModel

# -------------------- User Registration --------------------
class RegisterRequest(BaseModel):
    name: str
    phone_number: str
    password: str
    role: str = "civilian"

# -------------------- User Login --------------------
class LoginRequest(BaseModel):
    phone_number: str
    password: str

# -------------------- Create Report --------------------
class ReportCreate(BaseModel):
    disaster_type: str
    latitude: float
    longitude: float
    barangay: str

# -------------------- Update Report --------------------
class ReportUpdate(BaseModel):
    description: Optional[str] = None
    severity: Optional[str] = None
    image_url: Optional[str] = None
    edit_token: Optional[str] = None

# -------------------- SMS Report Submission --------------------
class SMSRequest(BaseModel):
    sms: str

# -------------------- Create Hotline --------------------
class HotlineCreate(BaseModel):
    name: str
    phone_number: str
    category: str
