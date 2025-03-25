from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from api.database import get_db
from api.models import Orders, Location, Supplier
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# ✅ Define Pydantic model for request body
class OrderCreate(BaseModel):
    supplier_id: int
    location_id: int
    status: str

# ✅ Update to allow both GET and HEAD requests on this endpoint
@router.api_route("/", methods=["GET", "HEAD"])
def get_orders(
    db: Session = Depends(get_db),
    region_id: Optional[int] = Query(None),
    location_id: Optional[int] = Query(None),
):
    """Fetch orders, optionally filtering by region or location."""
    
    query = db.query(Orders).options(
        joinedload(Orders.supplier),  # ✅ Fetch Supplier details
        joinedload(Orders.location)   # ✅ Fetch Location details
    )

    if location_id:
        query = query.filter(Orders.location_id == location_id)
    elif region_id:
        query = query.join(Location).filter(Location.region_id == region_id)

    orders = query.all()

    # ✅ Convert response to include Supplier & Location names
    return [
        {
            "order_id": order.order_id,
            "supplier_name": order.supplier.name if order.supplier else "Unknown",
            "location_name": order.location.location_name if order.location else "Unknown",
            "status": order.status,
            "created_at": order.created_at,
        }
        for order in orders
    ]

@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order and validate fields."""
    
    # Validate Supplier
    supplier = db.query(Supplier).filter(Supplier.supplier_id == order.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=400, detail="Invalid supplier ID")
    
    # Validate Location
    location = db.query(Location).filter(Location.location_id == order.location_id).first()
    if not location:
        raise HTTPException(status_code=400, detail="Invalid location ID")
    
    # Create Order
    new_order = Orders(
        supplier_id=order.supplier_id,
        location_id=order.location_id,
        status=order.status,
        created_at=datetime.utcnow()
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return {
        "order_id": new_order.order_id,
        "supplier_name": supplier.name,  
        "location_name": location.location_name,  
        "status": new_order.status,
        "created_at": new_order.created_at,
    }
