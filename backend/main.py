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