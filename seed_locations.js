require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedLocations() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'pass@123',
        database: process.env.DB_NAME || 'it_asset_db'
    });

    try {
        console.log('Creating location tables...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS racks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL
            );
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS storage_columns (
                id INT AUTO_INCREMENT PRIMARY KEY,
                rack_id INT NOT NULL,
                name VARCHAR(50) NOT NULL,
                FOREIGN KEY (rack_id) REFERENCES racks(id) ON DELETE CASCADE
            );
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS storage_parts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                column_id INT NOT NULL,
                name VARCHAR(50) NOT NULL,
                FOREIGN KEY (column_id) REFERENCES storage_columns(id) ON DELETE CASCADE
            );
        `);

        // Clear existing to avoid duplicates on re-run
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE storage_parts');
        await db.query('TRUNCATE TABLE storage_columns');
        await db.query('TRUNCATE TABLE racks');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Inserting Racks, Columns, and Parts...');

        for (let r = 1; r <= 10; r++) {
            const rackName = `Rack-${r}`;
            const [rackRes] = await db.query('INSERT INTO racks (name) VALUES (?)', [rackName]);
            const rackId = rackRes.insertId;

            for (let c = 1; c <= 10; c++) {
                const colName = `Col-${c}`;
                const [colRes] = await db.query('INSERT INTO storage_columns (rack_id, name) VALUES (?, ?)', [rackId, colName]);
                const colId = colRes.insertId;

                for (let p = 1; p <= 5; p++) {
                    const partName = `Bin-${p}`;
                    await db.query('INSERT INTO storage_parts (column_id, name) VALUES (?, ?)', [colId, partName]);
                }
            }
        }

        console.log('Successfully seeded 10 Racks, 100 Columns, and 500 Parts/Bins.');
    } catch (e) {
        console.error('Error seeding locations:', e);
    } finally {
        await db.end();
    }
}

seedLocations();
