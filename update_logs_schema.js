require('dotenv').config();
const db = require('./src/config/db');

async function updateLogsTable() {
    try {
        console.log('Adding employee_id to issuance_logs...');
        await db.execute('ALTER TABLE issuance_logs ADD COLUMN employee_id INT, ADD FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL');
        console.log('✅ issuance_logs table updated!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

updateLogsTable();
