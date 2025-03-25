from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship
from api.database import Base
from sqlalchemy.sql import func

class Region(Base):
    __tablename__ = "regions"

    region_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    locations = relationship("Location", back_populates="region")

class Location(Base):
    __tablename__ = "locations"

    location_id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String, nullable=False)
    region_id = Column(Integer, ForeignKey("regions.region_id"))
    
    region = relationship("Region", back_populates="locations")
    inventory = relationship("Inventory", back_populates="location")
    sales = relationship("Sales", back_populates="location")
    orders = relationship("Orders", back_populates="location")

class Supplier(Base):  # ✅ Fix: Ensure this model exists
    __tablename__ = "suppliers"

    supplier_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_info = Column(String)
    orders = relationship("Orders", back_populates="supplier")  # ✅ Link orders to supplier

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category_id = Column(Integer)
    supplier_id = Column(Integer, ForeignKey("supplier.supplier_id"))
    price = Column(DECIMAL(10,2))
    shelf_life_days = Column(Integer) 
    reorder_point = Column(Integer)
    
    inventory = relationship("Inventory", back_populates="product")
    sales = relationship("Sales", back_populates="product")

class Inventory(Base):
    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.location_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer, nullable=False)
    last_updated = Column(TIMESTAMP)

    location = relationship("Location", back_populates="inventory")
    product = relationship("Product", back_populates="inventory")

class Sales(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.location_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer, nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    timestamp = Column(TIMESTAMP)

    location = relationship("Location", back_populates="sales")
    product = relationship("Product", back_populates="sales")

class Orders(Base): 
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.supplier_id"))
    location_id = Column(Integer, ForeignKey("locations.location_id"))
    status = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())  

    location = relationship("Location", back_populates="orders")
    supplier = relationship("Supplier", back_populates="orders") 
