require('dotenv').config();
const db = require('./src/config/db');

async function updateLogsTable() {
    try {
        console.log('Adding manual_receiver_name to issuance_logs...');
        await db.execute('ALTER TABLE issuance_logs ADD COLUMN manual_receiver_name VARCHAR(100)');
        console.log('✅ issuance_logs table updated!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

updateLogsTable();
