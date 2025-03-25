from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from api.database import get_db
from api.models import Sales, Product, Location, Region
from typing import Optional

router = APIRouter()

@router.api_route("/", methods=["GET", "HEAD"])
def get_sales(
    db: Session = Depends(get_db),
    region_id: Optional[int] = Query(None),
    location_id: Optional[int] = Query(None),
):
    """Fetch sales, optionally filtering by region or location."""
    query = db.query(Sales).options(
        joinedload(Sales.location),  # ✅ Fetch Location details
        joinedload(Sales.product),  # ✅ Fetch Product details
    )

    if location_id:
        query = query.filter(Sales.location_id == location_id)
    elif region_id:
        query = query.join(Location).filter(Location.region_id == region_id)

    sales = query.all()

    # ✅ Convert to dictionaries for JSON serialization
    return [
        {
            "sale_id": sale.sale_id,
            "location_id": sale.location_id,
            "location_name": sale.location.location_name if sale.location else None,
            "product_id": sale.product_id,
            "product_name": sale.product.name if sale.product else None,
            "quantity": sale.quantity,
            "total_price": sale.total_price,
            "timestamp": sale.timestamp,
        }
        for sale in sales
    ]

@router.post("/")
def create_sale(
    location_id: int,
    product_id: int,
    quantity: int,
    total_price: float,
    db: Session = Depends(get_db),
):
    """Create a new sale transaction."""
    sale = Sales(
        location_id=location_id,
        product_id=product_id,
        quantity=quantity,
        total_price=total_price
    )
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale
