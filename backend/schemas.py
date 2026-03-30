from pydantic import BaseModel

class ReportCreate(BaseModel):
    user_id: str
    disaster_type: str
    latitude: float
    longitude: float
    municipality: str
    barangay: str