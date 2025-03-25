from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import Region
from typing import List

router = APIRouter()

@router.api_route("/", methods=["GET", "HEAD"])
def get_regions(db: Session = Depends(get_db)):
    """Fetch all regions from the database and return as dictionaries."""
    regions = db.query(Region).all()
    
    return [{"region_id": region.region_id, "name": region.name} for region in regions]  # ✅ Convert to dict

@router.post("/")
def create_region(name: str, db: Session = Depends(get_db)):
    """Create a new region"""
    region = Region(name=name)
    db.add(region)
    db.commit()
    db.refresh(region)
    return region
