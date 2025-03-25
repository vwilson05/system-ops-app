from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import locations, product, inventory, sales, orders, regions, suppliers

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Each router is now included with its dedicated prefix.
app.include_router(regions.router, prefix="/api/regions", tags=["Regions"])
app.include_router(locations.router, prefix="/api/locations", tags=["Locations"])
app.include_router(product.router, prefix="/api/products", tags=["Products"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(sales.router, prefix="/api/sales", tags=["Sales"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["Suppliers"])

@app.get("/")
def home():
    return {"message": "Grocery Inventory API is running!"}
