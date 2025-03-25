from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import Location

router = APIRouter()

# Using GET (which FastAPI will automatically support HEAD as well)
@router.api_route("/", methods=["GET", "HEAD"])
def get_locations(db: Session = Depends(get_db)):
    return db.query(Location).all()

# Change the POST route to a relative path so that the prefix from main.py is applied.
@router.post("/")
def create_location(location_name: str, region_id: int, db: Session = Depends(get_db)):
    location = Location(location_name=location_name, region_id=region_id)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location