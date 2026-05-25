require('dotenv').config();
const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');

async function migrateData() {
  let mysqlConnection;
  let mongoClient;

  try {
    // 1. Connect to MySQL
    console.log('Connecting to MySQL...');
    mysqlConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'pass@123',
      database: process.env.DB_NAME || 'it_asset_db'
    });
    console.log('Connected to MySQL successfully.');

    // 2. Connect to MongoDB
    console.log('Connecting to MongoDB...');
    let mongoUrl = process.env.MONGO_URL;
    // Replace if user mistakenly put MONGODB_URI= in the middle
    mongoUrl = mongoUrl.replace('MONGODB_URI=', '');
    
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    console.log('Connected to MongoDB successfully.');
    
    const db = mongoClient.db(); // Uses the database from the connection string (TASAL)

    // 3. Get all tables from MySQL
    const [tablesRow] = await mysqlConnection.query('SHOW TABLES');
    const dbName = process.env.DB_NAME || 'it_asset_db';
    const key = `Tables_in_${dbName}`;
    const tables = tablesRow.map(row => row[key] || row[Object.keys(row)[0]]);
    
    console.log(`Found ${tables.length} tables in MySQL:`, tables);

    // 4. Migrate data table by table
    for (const table of tables) {
      console.log(`\nMigrating table: ${table}`);
      const [rows] = await mysqlConnection.query(`SELECT * FROM \`${table}\``);
      
      if (rows.length === 0) {
        console.log(`Table ${table} is empty. Skipping.`);
        continue;
      }
      
      // Select the target collection
      const collection = db.collection(table);
      
      // Optionally drop existing data in the collection
      // await collection.deleteMany({});
      
      // Insert to MongoDB
      const result = await collection.insertMany(rows);
      console.log(`Successfully migrated ${result.insertedCount} records from ${table} to MongoDB.`);
    }

    console.log('\nMigration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (mysqlConnection) await mysqlConnection.end();
    if (mongoClient) await mongoClient.close();
  }
}

migrateData();
