require('dotenv').config();
const db = require('./src/config/db');

async function setupNewTables() {
    try {
        console.log('Creating departments table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                dept_name VARCHAR(100) NOT NULL UNIQUE
            )
        `);

        console.log('Creating employees table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                emp_name VARCHAR(100) NOT NULL,
                emp_id VARCHAR(50) NOT NULL UNIQUE,
                dept_id INT,
                FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL
            )
        `);

        // Seed some departments
        const depts = ['IT', 'HR', 'Finance', 'Engineering', 'Marketing', 'Sales', 'Quality', 'Admin'];
        for (const d of depts) {
            await db.execute('INSERT IGNORE INTO departments (dept_name) VALUES (?)', [d]);
        }

        // Seed some employees
        const emps = [
            ['Rahul Sharma', 'EMP101', 1], // IT
            ['Anjali Singh', 'EMP102', 2], // HR
            ['Amit Patel', 'EMP103', 3], // Finance
            ['Priya Verma', 'EMP104', 4], // Engineering
            ['Sandeep Gupta', 'EMP105', 5] // Marketing
        ];
        for (const [name, id, d_id] of emps) {
            await db.execute('INSERT IGNORE INTO employees (emp_name, emp_id, dept_id) VALUES (?, ?, ?)', [name, id, d_id]);
        }

        console.log('✅ Tables created and seeded successfully!');
    } catch (error) {
        console.error('❌ Error setting up tables:', error.message);
    } finally {
        process.exit();
    }
}

setupNewTables();
