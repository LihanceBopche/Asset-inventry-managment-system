require('dotenv').config();
const mongoose = require('mongoose');

let uri = process.env.MONGO_URL;
if (uri && uri.includes('MONGODB_URI=')) uri = uri.replace('MONGODB_URI=', '');

async function seedData() {
    try {
        await mongoose.connect(uri);
        const db = mongoose.connection.db;

        console.log('Clearing old collections...');
        await db.collection('departments').deleteMany({});
        await db.collection('employees').deleteMany({});
        await db.collection('assets').deleteMany({});

        console.log('Seeding 5 Departments...');
        const departments = [
            { id: 1, dept_name: 'Engineering' },
            { id: 2, dept_name: 'Design' },
            { id: 3, dept_name: 'Sales' },
            { id: 4, dept_name: 'HR & Ops' },
            { id: 5, dept_name: 'Marketing' }
        ];
        await db.collection('departments').insertMany(departments);

        console.log('Seeding 25 Employees...');
        const empNames = ['Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Vikram Patel', 'Anjali Desai', 'Rohan Mehta', 'Sneha Reddy', 'Ajay Verma', 'Kavita Joshi', 'Suresh Rao', 'Pooja Iyer', 'Manoj Nair', 'Swati Menon', 'Rakesh Pillai', 'Ritu Das', 'Arjun Kapoor', 'Shruti Bajaj', 'Karan Ahuja', 'Nisha Tiwari', 'Varun Bhatia', 'Megha Chopra', 'Gaurav Khanna', 'Divya Saxena', 'Sanjay Malhotra'];
        const employees = empNames.map((name, i) => ({
            id: i + 1,
            emp_name: name,
            emp_id: `EMP${1000 + i}`,
            dept_id: (i % 5) + 1,
            dept_name: departments[i % 5].dept_name
        }));
        await db.collection('employees').insertMany(employees);

        console.log('Seeding 50 Assets...');
        const assetTypes = ['Laptop', 'Desktop', 'Server', 'Monitor'];
        const brands = ['Dell', 'HP', 'Lenovo', 'Apple'];
        const models = ['ThinkPad', 'Spectre', 'MacBook Pro', 'Latitude', 'PowerEdge', 'Inspiron', 'OptiPlex', 'iMac', 'UltraSharp'];
        const statuses = ['Active', 'Active', 'Active', 'In-Store', 'In-Store', 'In-Repair', 'Scrap'];

        const assets = [];
        for (let i = 1; i <= 50; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const aType = assetTypes[Math.floor(Math.random() * assetTypes.length)];

            // Generate purchase date between 2021 and 2024
            const pDate = new Date();
            pDate.setFullYear(2021 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));

            assets.push({
                id: i,
                pc_name: `IT-${brand.toUpperCase().substring(0, 3)}-${100 + i}`,
                serial_no: `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                model_name: models[Math.floor(Math.random() * models.length)],
                asset_type: aType,
                assetType: aType,
                brand: brand,
                department: status === 'Active' ? departments[i % 5].dept_name : null,
                status: status,
                condition: status === 'In-Repair' ? 'Degraded' : status === 'Scrap' ? 'Non-Functional' : 'Functional',
                purchasePrice: (Math.floor(Math.random() * 15) + 5) * 100, // 500 to 1900
                purchaseDate: pDate,
                warrantyPeriod: [12, 24, 36][Math.floor(Math.random() * 3)],
                ram: ['8GB', '16GB', '32GB', '64GB'][Math.floor(Math.random() * 4)],
                storage: ['256GB SSD', '512GB SSD', '1TB NVMe', '2TB HDD'][Math.floor(Math.random() * 4)],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await db.collection('assets').insertMany(assets);

        console.log('Database successfully seeded with realistic entries!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seedData();
