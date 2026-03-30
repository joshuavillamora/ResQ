from fastapi import FastAPI
from database import engine
import models

app = FastAPI()

@app.get("/")
def root():
    return {}

models.Base.metadata.create_all(bind=engine)