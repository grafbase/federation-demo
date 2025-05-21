-- =============================================================
-- Test Data for E-Commerce Order Management System
-- =============================================================

-- =============================================================
-- Customers
-- =============================================================
INSERT INTO customers (name, email, phone, address, city, postal_code, country) VALUES
('John Smith', 'john.smith@example.com', '555-123-4567', '123 Main St', 'New York', '10001', 'USA'),
('Emma Johnson', 'emma.j@example.com', '555-234-5678', '456 Oak Ave', 'Los Angeles', '90001', 'USA'),
('Michael Brown', 'michael.b@example.com', '555-345-6789', '789 Pine Rd', 'Chicago', '60007', 'USA'),
('Sophia Wilson', 'sophia.w@example.com', '555-456-7890', '321 Maple Ln', 'Houston', '77001', 'USA'),
('James Taylor', 'james.t@example.com', '555-567-8901', '654 Cedar Blvd', 'Phoenix', '85001', 'USA');

-- =============================================================
-- Payment Methods
-- =============================================================
INSERT INTO payment_methods (customer_id, payment_type, account_label, is_default) VALUES
(1, 'credit_card', 'Visa ending in 4242', true),
(1, 'paypal', 'john.smith@example.com', false),
(2, 'credit_card', 'Mastercard ending in 5678', true),
(3, 'credit_card', 'Amex ending in 9012', true),
(4, 'paypal', 'sophia.w@example.com', true),
(5, 'credit_card', 'Visa ending in 3456', false),
(5, 'bank_transfer', 'Chase Bank ****7890', true);

-- =============================================================
-- Orders
-- =============================================================
INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_address, payment_method_id) VALUES
(1, '2023-09-15 10:30:00', 'delivered', 129.98, '123 Main St, New York, 10001, USA', 1),
(2, '2023-09-20 14:45:00', 'shipped', 85.97, '456 Oak Ave, Los Angeles, 90001, USA', 3),
(3, '2023-09-25 09:15:00', 'paid', 199.95, '789 Pine Rd, Chicago, 60007, USA', 4),
(4, '2023-10-01 16:20:00', 'pending', 54.99, '321 Maple Ln, Houston, 77001, USA', 5),
(5, '2023-10-05 11:10:00', 'cancelled', 149.99, '654 Cedar Blvd, Phoenix, 85001, USA', 7),
(1, '2023-10-10 13:25:00', 'paid', 219.97, '123 Main St, New York, 10001, USA', 1);

-- =============================================================
-- Order Items
-- =============================================================
INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_name) VALUES
(1, 'converse-1', 1, 79.99, 'Converse Chuck Taylor All Star High Top'),
(1, 'adidas-1', 1, 49.99, 'Adidas Originals Superstar'),
(2, 'nike-1', 1, 69.99, 'Nike Air Force 1'),
(2, 'sock-1', 2, 7.99, 'Athletic Performance Socks'),
(3, 'vans-1', 2, 59.99, 'Vans Old Skool Classic'),
(3, 'new-balance-1', 1, 79.97, 'New Balance 574 Classic'),
(4, 'puma-1', 1, 54.99, 'Puma Suede Classic'),
(5, 'boots-1', 1, 149.99, 'Timberland Premium Waterproof Boots'),
(6, 'converse-1', 1, 79.99, 'Converse Chuck Taylor All Star High Top'),
(6, 'vans-1', 1, 59.99, 'Vans Old Skool Classic'),
(6, 'saucony-1', 1, 79.99, 'Saucony Jazz Original Vintage'),
(6, 'adidas-2', 4, 0.00, 'Adidas Stan Smith');

-- Update one order status to test filtering
UPDATE orders SET status = 'delivered' WHERE order_id = 3;
