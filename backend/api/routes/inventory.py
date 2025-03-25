from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from api.database import get_db
from api.models import Inventory, Product, Location
from typing import Optional

router = APIRouter()

@router.api_route("/", methods=["GET", "HEAD"])
def get_inventory(
    db: Session = Depends(get_db),
    region_id: Optional[int] = Query(None),
    location_id: Optional[int] = Query(None),
):
    """Fetch inventory, optionally filtering by region or location."""
    query = db.query(Inventory).options(
        joinedload(Inventory.location),  # ✅ Fetch Location details
        joinedload(Inventory.product),  # ✅ Fetch Product details
    )

    if location_id:
        query = query.filter(Inventory.location_id == location_id)
    elif region_id:
        query = query.join(Location).filter(Location.region_id == region_id)

    inventory = query.all()

    # ✅ Convert to dictionaries for JSON serialization
    return [
        {
            "inventory_id": item.inventory_id,
            "location_id": item.location_id,
            "location_name": item.location.location_name if item.location else None,
            "product_id": item.product_id,
            "product_name": item.product.name if item.product else None,
            "quantity": item.quantity,
            "last_updated": item.last_updated,
        }
        for item in inventory
    ]
