from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from api.database import get_db
from api.models import Product
from api.schemas import ProductSchema

router = APIRouter()

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    result = []
    for product in products:
        result.append({
            "product_id": product.product_id,
            "name": product.name,
            "category_id": product.category_id,
            "supplier_id": product.supplier_id,
            "price": float(product.price) if product.price is not None else None,
            "shelf_life_days": product.shelf_life_days,
            "reorder_point": product.reorder_point
        })
    return result


@router.post("/")
def create_product(
    name: str, 
    category_id: int, 
    supplier_id: int, 
    price: float, 
    shelf_life_days: int, 
    reorder_point: int, 
    db: Session = Depends(get_db)
):
    product = Product(
        name=name,
        category_id=category_id,
        supplier_id=supplier_id,
        price=price,
        shelf_life_days=shelf_life_days,
        reorder_point=reorder_point
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
