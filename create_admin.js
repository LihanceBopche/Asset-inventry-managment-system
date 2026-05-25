const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const username = 'admin';
        const email = 'admin@tasl.aero';
        const password = 'admin123';
        const role = 'Admin';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        // Insert admin
        await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );

        console.log('-----------------------------------');
        console.log('Admin User Created Successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
