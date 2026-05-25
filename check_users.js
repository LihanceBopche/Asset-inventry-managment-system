require('dotenv').config();
const db = require('./src/config/db');

async function checkTable() {
    try {
        const [columns] = await db.execute('SHOW COLUMNS FROM users');
        console.log("Columns in users table:");
        columns.forEach(c => console.log(c.Field));
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkTable();
