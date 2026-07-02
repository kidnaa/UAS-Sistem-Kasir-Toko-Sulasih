CREATE DATABASE IF NOT EXISTS kasir_toko_sulasih;
USE kasir_toko_sulasih;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('owner', 'admin', 'kasir') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  minimum_stock INT NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(40) NOT NULL UNIQUE,
  cashier_id INT NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) NOT NULL,
  change_amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_cashier FOREIGN KEY (cashier_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transaction_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  CONSTRAINT fk_items_transaction FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (name, username, password, role) VALUES
('Pemilik Toko Sulasih', 'owner', 'owner123', 'owner'),
('Admin Produk', 'admin', 'admin123', 'admin'),
('Kasir Toko', 'kasir', 'kasir123', 'kasir')
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO products (sku, name, category, price, stock, minimum_stock) VALUES
('BRG-001', 'Beras 5 Kg', 'Sembako', 68000, 24, 5),
('BRG-002', 'Minyak Goreng 1 L', 'Sembako', 18000, 30, 8),
('BRG-003', 'Gula Pasir 1 Kg', 'Sembako', 17000, 18, 6),
('BRG-004', 'Teh Celup', 'Minuman', 9500, 10, 5),
('BRG-005', 'Sabun Mandi', 'Kebutuhan Rumah', 4500, 4, 5)
ON DUPLICATE KEY UPDATE
name = VALUES(name),
category = VALUES(category),
price = VALUES(price),
stock = VALUES(stock),
minimum_stock = VALUES(minimum_stock);
