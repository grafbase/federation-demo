-- =============================================================
-- Simplified E-Commerce Order Management System Schema
-- =============================================================

-- Drop tables if they exist to allow clean recreations
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS customers;

-- =============================================================
-- Customers Table
-- Basic customer information needed for orders
-- =============================================================
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,         -- Customer's full name
    email VARCHAR(255) UNIQUE NOT NULL, -- Unique email for identification
    phone VARCHAR(20),                  -- Contact phone number
    address VARCHAR(255),               -- Primary shipping address
    city VARCHAR(100),                  -- City
    postal_code VARCHAR(20),            -- Postal code/ZIP
    country VARCHAR(100),               -- Country
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Account creation timestamp
);

COMMENT ON TABLE customers IS 'Simplified customer data for order processing';
COMMENT ON COLUMN customers.customer_id IS 'Unique identifier for the customer';
COMMENT ON COLUMN customers.email IS 'Primary contact email for order communications';
COMMENT ON COLUMN customers.address IS 'Primary shipping address for deliveries';

-- =============================================================
-- Payment Methods Table
-- Simplified payment methods used by customers
-- =============================================================
CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,       -- Customer who owns this payment method
    payment_type VARCHAR(50) NOT NULL,  -- Type: credit_card, paypal, etc.
    account_label VARCHAR(255),         -- Masked/display version of payment account
    is_default BOOLEAN DEFAULT FALSE,   -- Whether this is customer's default payment method
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

COMMENT ON TABLE payment_methods IS 'Payment methods saved by customers';
COMMENT ON COLUMN payment_methods.customer_id IS 'Customer who owns this payment method';
COMMENT ON COLUMN payment_methods.payment_type IS 'Type of payment method (credit card, PayPal, etc.)';
COMMENT ON COLUMN payment_methods.account_label IS 'Display label for the payment method (e.g. "Visa ending in 4242")';

-- =============================================================
-- Orders Table
-- Main orders table tracking customer purchases
-- =============================================================
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,       -- Customer who placed the order
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- When order was placed
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- Order status
    total_amount DECIMAL(10, 2) NOT NULL, -- Total order amount
    shipping_address VARCHAR(255),      -- Delivery address
    payment_method_id INTEGER,          -- Payment method used for this order
    
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    CONSTRAINT order_status_check CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    CONSTRAINT order_amount_check CHECK (total_amount >= 0)
);

COMMENT ON TABLE orders IS 'Main order records tracking customer purchases';
COMMENT ON COLUMN orders.order_id IS 'Unique identifier for the order';
COMMENT ON COLUMN orders.customer_id IS 'Reference to the customer who placed this order';
COMMENT ON COLUMN orders.status IS 'Current status of the order in the fulfillment process';
COMMENT ON COLUMN orders.total_amount IS 'Total order value including all items';

-- =============================================================
-- Order Items Table
-- Individual line items within an order, referencing external products
-- =============================================================
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,          -- Order this item belongs to
    product_id VARCHAR(100) NOT NULL,   -- External product ID from product service
    quantity INTEGER NOT NULL,          -- Quantity ordered
    unit_price DECIMAL(10, 2) NOT NULL, -- Price per unit at time of purchase
    product_name VARCHAR(255) NOT NULL, -- Product name at time of purchase
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT item_quantity_check CHECK (quantity > 0),
    CONSTRAINT item_price_check CHECK (unit_price >= 0)
);

COMMENT ON TABLE order_items IS 'Individual product line items within customer orders';
COMMENT ON COLUMN order_items.product_id IS 'Reference to the product in the external product service';
COMMENT ON COLUMN order_items.product_name IS 'Snapshot of product name at time of purchase';
COMMENT ON COLUMN order_items.quantity IS 'Number of units of the product ordered';

-- Create indexes for performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);