-- IT Asset Management System Schema

CREATE DATABASE IF NOT EXISTS it_asset_db;
USE it_asset_db;

-- Users Table (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'User') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table (Hardware/Software)
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pc_name VARCHAR(100) NOT NULL,
    serial_no VARCHAR(100) UNIQUE,
    model_name VARCHAR(100),
    asset_type VARCHAR(50), -- e.g., Workstation, Laptop
    department VARCHAR(100),
    work_location VARCHAR(100),
    ram VARCHAR(50),
    storage VARCHAR(50),
    os VARCHAR(50),
    mac_address VARCHAR(50),
    antivirus VARCHAR(50),
    office_version VARCHAR(50),
    other_software TEXT, -- JSON or comma separated
    status ENUM('Active', 'Repair', 'Scrapped', 'In-Store') DEFAULT 'In-Store',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Materials Table (Inventory)
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_name VARCHAR(100) NOT NULL,
    total_quantity INT DEFAULT 0,
    available_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issuance Logs Table
CREATE TABLE IF NOT EXISTS issuance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT,
    user_id INT, -- Receiver
    asset_id INT, -- If linked to a specific asset
    quantity INT DEFAULT 1,
    issue_date DATE,
    issuer_id INT, -- Manager/Admin who issued it
    department VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (issuer_id) REFERENCES users(id)
);

-- Initial Admin (Password will be 'admin123' hashed later)
-- INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@tasl.aero', '$2a$10$hashed_password_here', 'Admin');
