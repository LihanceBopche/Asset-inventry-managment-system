require('dotenv').config();
const db = require('./src/config/db');

async function triggerAlert() {
    try {
        await db.execute(
            "UPDATE materials SET available_quantity = 3 WHERE material_name = 'Laptop Charger (65W)'"
        );
        console.log('✅ Triggered low stock alert for Laptop Charger');
    } catch (error) {
        console.error('❌ Error triggering alert:', error.message);
    } finally {
        process.exit();
    }
}

triggerAlert();
