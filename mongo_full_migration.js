require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

async function migrateEverything() {
    let mongoUrl = process.env.MONGO_URL;
    if (mongoUrl.includes('MONGODB_URI=')) mongoUrl = mongoUrl.replace('MONGODB_URI=', '');

    await mongoose.connect(mongoUrl);

    const mysqlConn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'pass@123',
        database: process.env.DB_NAME || 'it_asset_db'
    });

    const tables = [
        'users', 'materials', 'assets', 'departments',
        'employees', 'issuance_logs', 'racks', 'storage_columns', 'storage_parts'
    ];

    for (let table of tables) {
        console.log(`Migrating ${table}...`);
        const [rows] = await mysqlConn.query(`SELECT * FROM ${table}`);

        // Use generic mongoose schema/model for the collection
        const Model = mongoose.models[table] || mongoose.model(table, new mongoose.Schema({}, { strict: false }), table);

        // Wipe existing
        await Model.deleteMany({});

        if (rows.length > 0) {
            await Model.insertMany(rows);
            console.log(`Inserted ${rows.length} records into ${table}`);
        }
    }

    console.log('Full Migration from MySQL to MongoDB Complete!');
    await mysqlConn.end();
    await mongoose.disconnect();
}

migrateEverything().catch(console.error);
