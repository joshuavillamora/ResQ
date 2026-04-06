from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

try:
    from .database import Base
except ImportError:
    from database import Base

# -------------------- User --------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="civilian", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    reports = relationship("Report", back_populates="user")
    verifications = relationship("Verification", back_populates="user")

# -------------------- Report --------------------
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    sms_sender_code = Column(String, nullable=True, index=True)
    client_report_id = Column(String, nullable=True, index=True)
    disaster_type = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    barangay = Column(String, nullable=False, index=True)
    status = Column(String, default="unverified", nullable=False, index=True)
    source = Column(String, default="api", nullable=False, index=True)
    confidence = Column(Integer, default=20, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String, nullable=True)
    image_url = Column(Text, nullable=True)
    edit_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="reports")
    images = relationship("ReportImage", back_populates="report", cascade="all, delete-orphan")
    verifications = relationship("Verification", back_populates="report", cascade="all, delete-orphan")

# -------------------- ReportImage --------------------
class ReportImage(Base):
    __tablename__ = "report_images"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    image_url = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("Report", back_populates="images")

# -------------------- Verification --------------------
class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("Report", back_populates="verifications")
    user = relationship("User", back_populates="verifications")

# -------------------- Hotline --------------------
class Hotline(Base):
    __tablename__ = "hotlines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
