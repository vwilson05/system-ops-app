# backend/api/schemas.py
from pydantic import BaseModel

class ProductSchema(BaseModel):
    product_id: int
    name: str

    class Config:
        orm_mode = True
       
