const xlsx = require('xlsx');
const db = require('./src/config/db');

async function importData() {
    console.log('🚀 Starting Full Data Import...');

    try {
        // 1. Import Assets
        const assetWB = xlsx.readFile('d:/AIT/IT Asset Inventory (Responses).xlsx');
        const assetData = xlsx.utils.sheet_to_json(assetWB.Sheets[assetWB.SheetNames[0]]);
        
        console.log(`📦 Found ${assetData.length} assets. Importing...`);
        for (const row of assetData) {
            const pc_name = row['PC Name / ID'] || row['PC Name'] || 'Unknown';
            const serial_no = row['Serial Number'] || row['Serial No'] || 'N/A';
            const model = row['Model Name'] || '';
            const type = row['Asset Type'] || 'Workstation';
            const dept = row['Department'] || '';
            const ram = row['RAM'] || '';
            const storage = row['Storage'] || '';
            const os = row['OS'] || '';

            await db.execute(
                `INSERT IGNORE INTO assets (pc_name, serial_no, model_name, asset_type, department, ram, storage, os, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [pc_name, serial_no, model, type, dept, ram, storage, os, 'Active']
            );
        }
        console.log('✅ Assets Imported Successfully!');

        // 2. Import Materials
        const materialWB = xlsx.readFile('d:/AIT/Material Inventory.xlsx');
        const materialData = xlsx.utils.sheet_to_json(materialWB.Sheets[materialWB.SheetNames[0]]);
        
        console.log(`📦 Found ${materialData.length} materials. Importing...`);
        for (const row of materialData) {
            const name = row['Item Name'] || row['Material Name'] || 'Unknown';
            const qty = row['Quantity'] || row['Total Quantity'] || 0;

            await db.execute(
                'INSERT IGNORE INTO materials (material_name, total_quantity, available_quantity) VALUES (?, ?, ?)',
                [name, qty, qty]
            );
        }
        console.log('✅ Materials Imported Successfully!');

        console.log('\n✨ ALL DATA IMPORTED SUCCESSFULLY!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Import Failed:', error.message);
        process.exit(1);
    }
}

importData();
