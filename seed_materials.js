require('dotenv').config();
const db = require('./src/config/db');

async function seedMaterials() {
    const materials = [
        ['Dell USB Keyboard', 50],
        ['Logitech Wireless Mouse', 40],
        ['HDMI Cable (1.5m)', 100],
        ['DDR4 8GB RAM (Crucial)', 30],
        ['Kingston 240GB SSD', 25],
        ['Power Cable (Desktop)', 60],
        ['DisplayPort to HDMI Adapter', 20],
        ['Cat6 LAN Cable (3m)', 80],
        ['USB-C Docking Station', 15],
        ['Laptop Charger (65W)', 20]
    ];

    try {
        console.log('Seed start: Adding 10 material entries...');
        for (const [name, qty] of materials) {
            await db.execute(
                'INSERT INTO materials (material_name, total_quantity, available_quantity) VALUES (?, ?, ?)',
                [name, qty, qty]
            );
            console.log(`✅ Added: ${name}`);
        }
        console.log('Seed completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding materials:', error.message);
    } finally {
        process.exit();
    }
}

seedMaterials();
