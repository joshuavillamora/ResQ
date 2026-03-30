from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String)
    disaster_type = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    municipality = Column(String)
    barangay = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    verification_status = Column(String, default="LOW")