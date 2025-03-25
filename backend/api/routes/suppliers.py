from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import Supplier

router = APIRouter()

@router.api_route("/", methods=["GET", "HEAD"])
def get_suppliers(db: Session = Depends(get_db)):
    """Fetch all suppliers."""
    return db.query(Supplier).all()
