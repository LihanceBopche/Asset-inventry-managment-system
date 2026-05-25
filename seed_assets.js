require('dotenv').config();
const db = require('./src/config/db');

async function seedAssets() {
    const assets = [
        ['LPT-FIN-001', 'SN-DELL-9901', 'Dell Latitude 5420', 'Laptop', 'Finance', '16GB', '512GB SSD', 'Windows 11', 'Active'],
        ['LPT-HR-002', 'SN-HP-8822', 'HP EliteBook 840 G8', 'Laptop', 'HR', '16GB', '256GB SSD', 'Windows 10', 'Active'],
        ['WS-ENG-001', 'SN-LENO-1102', 'ThinkStation P340', 'Workstation', 'Engineering', '32GB', '1TB SSD', 'Windows 11 Pro', 'Active'],
        ['LPT-IT-005', 'SN-AAPL-2233', 'MacBook Pro M1', 'Laptop', 'IT', '16GB', '512GB SSD', 'macOS Sonoma', 'Active'],
        ['DT-OPS-009', 'SN-DELL-4455', 'OptiPlex 7090', 'Desktop', 'Operations', '8GB', '256GB SSD', 'Windows 10', 'Active'],
        ['LPT-MKT-003', 'SN-ASUS-7788', 'Asus ZenBook 14', 'Laptop', 'Marketing', '16GB', '512GB SSD', 'Windows 11', 'Active'],
        ['WS-ENG-002', 'SN-HP-3344', 'Z2 Tower G5', 'Workstation', 'Engineering', '64GB', '2TB SSD', 'Windows 11 Pro', 'Active'],
        ['LPT-SAL-011', 'SN-LENO-6677', 'ThinkPad X1 Carbon', 'Laptop', 'Sales', '16GB', '512GB SSD', 'Windows 11', 'Active'],
        ['DT-SEC-001', 'SN-DELL-8899', 'OptiPlex 3080', 'Desktop', 'Security', '8GB', '1TB HDD', 'Windows 10', 'Active'],
        ['LPT-IT-006', 'SN-MSFT-1122', 'Surface Laptop 4', 'Laptop', 'IT', '16GB', '256GB SSD', 'Windows 11', 'Active'],
        ['WS-RD-001', 'SN-PREC-5566', 'Dell Precision 3650', 'Workstation', 'R&D', '128GB', '2TB SSD', 'Windows 11 Pro', 'Active'],
        ['LPT-ACC-004', 'SN-HP-9900', 'HP ProBook 450', 'Laptop', 'Accounts', '8GB', '256GB SSD', 'Windows 10', 'Active'],
        ['LPT-IT-007', 'SN-LENO-4433', 'Legion 5 Pro', 'Laptop', 'IT', '32GB', '1TB SSD', 'Windows 11', 'Active'],
        ['DT-LOG-001', 'SN-ACER-5544', 'Acer Veriton', 'Desktop', 'Logistics', '8GB', '512GB SSD', 'Windows 10', 'Active'],
        ['LPT-QA-001', 'SN-DELL-2211', 'Dell Vostro 3510', 'Laptop', 'Quality', '16GB', '512GB SSD', 'Windows 11', 'Active'],
        ['WS-DES-001', 'SN-AAPL-9988', 'Mac Studio', 'Workstation', 'Design', '64GB', '1TB SSD', 'macOS Sonoma', 'Active'],
        ['LPT-FIN-002', 'SN-HP-7766', 'HP Pavilion 15', 'Laptop', 'Finance', '12GB', '512GB SSD', 'Windows 11', 'Active'],
        ['DT-ADM-005', 'SN-LENO-1199', 'IdeaCentre 5', 'Desktop', 'Admin', '8GB', '1TB HDD', 'Windows 10', 'Active'],
        ['LPT-MKT-004', 'SN-DELL-6655', 'XPS 15', 'Laptop', 'Marketing', '32GB', '1TB SSD', 'Windows 11', 'Active'],
        ['LPT-SAL-012', 'SN-AAPL-3322', 'MacBook Air M2', 'Laptop', 'Sales', '8GB', '256GB SSD', 'macOS Sonoma', 'Active']
    ];

    try {
        console.log('Seed start: Adding 20 Asset entries...');
        for (const a of assets) {
            await db.execute(
                'INSERT INTO assets (pc_name, serial_no, model_name, asset_type, department, ram, storage, os, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                a
            );
            console.log(`✅ Added Asset: ${a[0]} (${a[2]})`);
        }
        console.log('Seed completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding assets:', error.message);
    } finally {
        process.exit();
    }
}

seedAssets();
