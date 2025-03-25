-- Create the grocery inventory database (if not already created)
CREATE DATABASE grocery_inventory;

\c grocery_inventory;

-- Regions Table (Parent of Locations)
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Locations Table (Each location belongs to a region)
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    region_id INT REFERENCES regions(region_id) ON DELETE CASCADE,
    manager_id INT,
    manager_name VARCHAR(255) NULL
);

-- Categories Table (Product Categorization)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255)
);

-- Suppliers Table
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info TEXT
);

-- Products Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    supplier_id INT REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    shelf_life_days INT CHECK (shelf_life_days >= 0),
    reorder_point INT CHECK (reorder_point >= 0)
);

-- Customers Table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    loyalty_id VARCHAR(50) UNIQUE,
    contact_info TEXT
);

-- Inventory Table (Current Stock Levels)
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity >= 0),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Sales Table (Transaction Log)
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    customer_id INT REFERENCES customers(customer_id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Orders Table (Purchase Orders from Suppliers)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table (Products within each Order)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

-- Stock Transfers Table (Moving Inventory Between locations)
CREATE TABLE stock_transfers (
    transfer_id SERIAL PRIMARY KEY,
    from_location INT REFERENCES locations(location_id) ON DELETE CASCADE,
    to_location INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    timestamp TIMESTAMP DEFAULT NOW()
);
-- Inventory Logs Table (For Tracking Changes Over Time)
CREATE TABLE inventory_logs (
    log_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity_change INT NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Sales Aggregates Table (OLAP View for Reporting)
CREATE TABLE sales_aggregates (
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE NULL,
    daily_sales INT DEFAULT 0,
    weekly_sales INT DEFAULT 0,
    monthly_sales INT DEFAULT 0
);

ALTER TABLE sales_aggregates ALTER COLUMN product_id DROP NOT NULL;


-- Forecasting Results Table (AI-Powered Demand Prediction)
CREATE TABLE forecasting_results (
    forecast_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    predicted_demand INT NOT NULL CHECK (predicted_demand >= 0),
    confidence_level DECIMAL(5,2) CHECK (confidence_level BETWEEN 0 AND 1),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Wastage Records Table (Tracking Expired or Spoiled Products)
CREATE TABLE wastage_records (
    wastage_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    reason TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance Optimization
CREATE INDEX idx_inventory_location_product ON inventory (location_id, product_id);
CREATE INDEX idx_sales_timestamp ON sales (timestamp);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_forecasting_timestamp ON forecasting_results (timestamp);
CREATE INDEX idx_wastage_timestamp ON wastage_records (timestamp);
