import psycopg2
from faker import Faker
import random
from datetime import datetime, timedelta

# Database connection settings
DB_NAME = "grocery_inventory"
DB_USER = "postgres"  # Change if needed
DB_PASSWORD = "password"  # Change if needed
DB_HOST = "localhost"
DB_PORT = "5432"

# Initialize Faker
fake = Faker()

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
)
cur = conn.cursor()

# Helper function to insert data
def insert_data(query, values):
    try:
        cur.execute(query, values)
    except Exception as e:
        print(f"Error inserting data: {e}")

# 🌎 Generate Regions
regions = ["North", "South", "East", "West"]
region_ids = []
for name in regions:
    cur.execute("INSERT INTO regions (name) VALUES (%s) RETURNING region_id;", (name,))
    region_ids.append(cur.fetchone()[0])

# 🏬 Generate Locations (Stores assigned to Regions)
location_ids = []
for _ in range(10):
    region_id = random.choice(region_ids)
    cur.execute(
        "INSERT INTO locations (location_name, region_id, manager_id, manager_name) VALUES (%s, %s, %s, %s) RETURNING location_id;",
        (fake.city() + " Supermarket", region_id, random.randint(1000, 9999), fake.name()),
    )
    location_ids.append(cur.fetchone()[0])

# 🍏 Generate Categories
categories = ["Produce", "Dairy", "Meat", "Bakery", "Beverages", "Frozen Foods"]
category_ids = []
for name in categories:
    cur.execute("INSERT INTO categories (name) VALUES (%s) RETURNING category_id;", (name,))
    category_ids.append(cur.fetchone()[0])

# 🚚 Generate Suppliers
supplier_ids = []
for _ in range(10):
    cur.execute(
        "INSERT INTO suppliers (name, contact_info) VALUES (%s, %s) RETURNING supplier_id;",
        (fake.company(), fake.phone_number()),
    )
    supplier_ids.append(cur.fetchone()[0])

# 🛒 Generate Products with Real Names

real_products = [
    "Organic Apples", "Fresh Bananas", "Red Grapes", "Green Apples", "Fresh Oranges",
    "Crisp Lettuce", "Juicy Tomatoes", "Ripe Avocados", "Sweet Potatoes", "Fresh Spinach",
    "Potato Salad", "Whole Milk", "Greek Yogurt", "Cheddar Cheese", "Mozzarella Cheese",
    "Organic Butter", "Low-Fat Milk", "Cottage Cheese", "Sour Cream", "Cream Cheese",
    "Skim Milk", "Chicken Breast", "Ground Beef", "Pork Chops", "Turkey", "Lamb Chops",
    "Bacon", "Sausages", "Ham", "Steak", "Fish Fillet", "Whole Wheat Bread", "Baguette",
    "Croissant", "Bagel", "Muffins", "Donuts", "Sourdough Bread", "Pita Bread",
    "English Muffins", "Rye Bread", "Orange Juice", "Apple Juice", "Sparkling Water",
    "Cola", "Green Tea", "Black Tea", "Coffee", "Lemonade", "Iced Tea", "Mineral Water",
    "Frozen Pizza", "Ice Cream", "Frozen Vegetables", "Frozen Fruit", "Frozen French Fries",
    "Frozen Burritos", "Frozen Peas", "Frozen Corn", "Frozen Seafood", "Frozen Lasagna",
    "Organic Apples - Premium", "Organic Apples - Regular", "Fresh Bananas - Local",
    "Red Grapes - Imported", "Green Apples - Granny Smith", "Fresh Oranges - Valencia",
    "Crisp Lettuce - Romaine", "Juicy Tomatoes - Heirloom", "Ripe Avocados - Hass",
    "Sweet Potatoes - Organic", "Whole Milk - Organic", "Greek Yogurt - Strained",
    "Cheddar Cheese - Sharp", "Mozzarella Cheese - Fresh", "Organic Butter - Grassfed",
    "Low-Fat Milk - Skim", "Cottage Cheese - Low Fat", "Sour Cream - Regular",
    "Cream Cheese - Neufchatel", "Skim Milk - Fat Free", "Chicken Breast - Boneless",
    "Ground Beef - Lean", "Pork Chops - Bone In", "Turkey - Sliced", "Lamb Chops - Grilled",
    "Bacon - Smoked", "Sausages - Italian", "Ham - Honey Glazed", "Steak - Ribeye",
    "Fish Fillet - Cod", "Whole Wheat Bread - Artisan", "Baguette - French",
    "Croissant - Butter", "Bagel - Sesame", "Muffins - Blueberry", "Donuts - Glazed",
    "Sourdough Bread - Rustic", "Pita Bread - Whole Wheat", "English Muffins - Toasted",
    "Rye Bread - Dense", "Orange Juice - Fresh Squeezed", "Apple Juice - Clear",
    "Sparkling Water - Natural", "Cola - Classic", "Green Tea - Matcha",
    "Black Tea - Earl Grey", "Coffee - Dark Roast", "Lemonade - Fresh", "Iced Tea - Peach",
    "Mineral Water - Sparkling", "Frozen Pizza - Pepperoni", "Ice Cream - Vanilla",
    "Frozen Vegetables - Mixed", "Frozen Fruit - Berry Blend", "Frozen French Fries - Crispy",
    "Frozen Burritos - Bean & Cheese", "Frozen Peas - Organic", "Frozen Corn - Sweet",
    "Frozen Seafood - Shrimp", "Frozen Lasagna - Meat",
    "Organic Bananas - Extra", "Red Grapes - Seedless", "Fresh Oranges - Navel",
    "Crisp Lettuce - Iceberg", "Juicy Tomatoes - Roma", "Ripe Avocados - Organic",
    "Sweet Potatoes - Yams", "Whole Milk - 2%", "Greek Yogurt - Plain", "Cheddar Cheese - Mild",
    "Mozzarella Cheese - Low Moisture", "Organic Butter - Unsalted", "Low-Fat Milk - 1%",
    "Cottage Cheese - Full Fat", "Sour Cream - Light", "Cream Cheese - Full Fat",
    "Skim Milk - Ultra", "Chicken Breast - Organic", "Ground Beef - Grassfed",
    "Pork Chops - Grilled", "Turkey - Oven Roasted", "Lamb Chops - Slow Cooked",
    "Bacon - Extra Crispy", "Sausages - Breakfast", "Ham - Smoked", "Steak - Filet Mignon",
    "Fish Fillet - Salmon", "Whole Wheat Bread - Sliced", "Baguette - Mini",
    "Croissant - Almond", "Bagel - Everything", "Muffins - Chocolate Chip", "Donuts - Powdered"
]

product_ids = []
for product_name in real_products:
    cur.execute(
        "INSERT INTO products (name, category_id, supplier_id, price, shelf_life_days, reorder_point) VALUES (%s, %s, %s, %s, %s, %s) RETURNING product_id;",
        (
            product_name,
            random.choice(category_ids),
            random.choice(supplier_ids),
            round(random.uniform(1, 100), 2),
            random.randint(3, 30),
            random.randint(5, 20),
        ),
    )
    product_ids.append(cur.fetchone()[0])

# 🏪 Generate Inventory (Assign to Locations)
for location_id in location_ids:
    for product_id in product_ids:
        cur.execute(
            "INSERT INTO inventory (location_id, product_id, quantity, last_updated) VALUES (%s, %s, %s, %s);",
            (location_id, product_id, random.randint(10, 500), fake.date_time_this_year()),
        )

# 👥 Generate Customers
customer_ids = []
for _ in range(20):
    cur.execute(
        "INSERT INTO customers (name, loyalty_id, contact_info) VALUES (%s, %s, %s) RETURNING customer_id;",
        (fake.name(), fake.uuid4(), fake.phone_number()),
    )
    customer_ids.append(cur.fetchone()[0])

# 💰 Generate Sales Transactions
for _ in range(100):
    location_id = random.choice(location_ids)
    product_id = random.choice(product_ids) if product_ids else None
    quantity = random.randint(1, 10)
    total_price = round(quantity * random.uniform(5, 200), 2)
    cur.execute(
        "INSERT INTO sales (location_id, product_id, customer_id, quantity, total_price, timestamp) VALUES (%s, %s, %s, %s, %s, %s);",
        (
            location_id,
            product_id,
            random.choice(customer_ids),
            quantity,
            total_price,
            fake.date_time_this_year(),
        ),
    )

# 📦 Generate Orders (Purchase Orders from Suppliers)
for _ in range(30):
    cur.execute(
        "INSERT INTO orders (supplier_id, location_id, status, created_at) VALUES (%s, %s, %s, %s) RETURNING order_id;",
        (
            random.choice(supplier_ids),
            random.choice(location_ids),
            random.choice(["Pending", "Shipped", "Delivered"]),
            fake.date_time_this_year(),
        ),
    )

# 📦 Generate Stock Transfers
for _ in range(20):
    cur.execute(
        "INSERT INTO stock_transfers (from_location, to_location, product_id, quantity, timestamp) VALUES (%s, %s, %s, %s, %s);",
        (
            random.choice(location_ids),
            random.choice(location_ids),
            random.choice(product_ids) if product_ids else None,
            random.randint(1, 50),
            fake.date_time_this_year(),
        ),
    )


# 🗑 Generate Wastage Records
for _ in range(15):
    cur.execute(
        "INSERT INTO wastage_records (location_id, product_id, quantity, reason, timestamp) VALUES (%s, %s, %s, %s, %s);",
        (
            random.choice(location_ids),
            random.choice(product_ids) if product_ids else None,
            random.randint(1, 50),
            random.choice(["Expired", "Damaged", "Spoiled"]),
            fake.date_time_this_year(),
        ),
    )

# 📊 Generate NOI and Revenue Metrics
for location_id in location_ids:
    revenue = round(random.uniform(100000, 500000), 2)  # Random revenue range
    noi = round(revenue * random.uniform(0.1, 0.3), 2)  # NOI is usually 10-30% of revenue
    cur.execute(
        "INSERT INTO sales_aggregates (location_id, product_id, daily_sales, weekly_sales, monthly_sales) VALUES (%s, %s, %s, %s, %s);",
        (
            location_id,
            random.choice(product_ids) if product_ids else None,  # Some entries without product_id
            int(revenue / 30),
            int(revenue / 4),
            int(revenue),
        ),
    )

# 🤖 Mock Forecasting: AI-Driven Demand Predictions
for _ in range(50):
    cur.execute(
        "INSERT INTO forecasting_results (location_id, product_id, predicted_demand, confidence_level, timestamp) VALUES (%s, %s, %s, %s, %s);",
        (
            random.choice(location_ids),
            random.choice(product_ids) if product_ids else None,
            random.randint(50, 300),
            round(random.uniform(0.7, 0.95), 2),
            fake.date_time_this_month(),
        ),
    )

# 📢 Generate Mock "Time for a Sale!" Alerts (Proactive Pricing Insights)
for _ in range(20):
    cur.execute(
        "INSERT INTO inventory_logs (location_id, product_id, quantity_change, reason, timestamp) VALUES (%s, %s, %s, %s, %s);",
        (
            random.choice(location_ids),
            random.choice(product_ids) if product_ids else None,
            random.randint(-30, -5),
            "Sales Drop Alert - Consider a Promotion!",
            fake.date_time_this_month(),
        ),
    )

# ✅ Commit and Close
conn.commit()
cur.close()
conn.close()

print("✅ High-Quality Synthetic Data Successfully Inserted!")
