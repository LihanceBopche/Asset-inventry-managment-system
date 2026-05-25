const xlsx = require('xlsx');
const fs = require('fs');

function generateAssetSQL() {
    try {
        const workbook = xlsx.readFile('d:/AIT/IT Asset Inventory (Responses).xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let sql = '-- Asset Inventory Data\nUSE it_asset_db;\n';
        data.forEach(row => {
            // Mapping columns based on typical Excel structure provided earlier
            const pc_name = row['PC Name / ID'] || row['PC Name'] || 'Unknown';
            const serial_no = row['Serial Number'] || row['Serial No'] || 'N/A';
            const model = row['Model Name'] || '';
            const type = row['Asset Type'] || 'Workstation';
            const dept = row['Department'] || '';
            const ram = row['RAM'] || '';
            const storage = row['Storage'] || '';
            const os = row['OS'] || '';
            const status = 'Active';

            sql += `INSERT IGNORE INTO assets (pc_name, serial_no, model_name, asset_type, department, ram, storage, os, status) VALUES ('${pc_name}', '${serial_no}', '${model}', '${type}', '${dept}', '${ram}', '${storage}', '${os}', '${status}');\n`;
        });
        fs.writeFileSync('import_assets.sql', sql);
        console.log('✅ Generated import_assets.sql');
    } catch (e) { console.error('Error Asset Excel:', e.message); }
}

function generateMaterialSQL() {
    try {
        const workbook = xlsx.readFile('d:/AIT/Material Inventory.xlsx');
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        let sql = '-- Material Inventory Data\nUSE it_asset_db;\n';
        data.forEach(row => {
            const name = row['Item Name'] || row['Material Name'] || 'Unknown';
            const qty = row['Quantity'] || row['Total Quantity'] || 0;

            sql += `INSERT IGNORE INTO materials (material_name, total_quantity, available_quantity) VALUES ('${name}', ${qty}, ${qty});\n`;
        });
        fs.writeFileSync('import_materials.sql', sql);
        console.log('✅ Generated import_materials.sql');
    } catch (e) { console.error('Error Material Excel:', e.message); }
}

generateAssetSQL();
generateMaterialSQL();
