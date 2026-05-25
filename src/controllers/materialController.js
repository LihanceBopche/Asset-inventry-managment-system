const Material = require('../models/Material');
const xlsx = require('xlsx');

exports.createMaterial = async (req, res) => {
    try {
        const materialId = await Material.create(req.body);
        const io = req.app.get('io');
        if (io) io.emit('material_updated');
        res.status(201).json({ message: 'Material added successfully', materialId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding material', error: error.message });
    }
};

exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.getAll();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching materials', error: error.message });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await Material.update(id, req.body);
        const io = req.app.get('io');
        if (io) io.emit('material_updated');
        res.json({ message: 'Material updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating material', error: error.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await Material.delete(id);
        const io = req.app.get('io');
        if (io) io.emit('material_updated');
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting material', error: error.message });
    }
};

exports.exportMaterialsToExcel = async (req, res) => {
    try {
        const materials = await Material.getAll();

        // Prepare data for Excel
        const data = materials.map(m => ({
            "Item Name": m.material_name,
            "Rack": m.rack || 'Unassigned',
            "Column": m.col_name || 'Unassigned',
            "Part/Bin": m.part_name || 'Unassigned',
            "Total Quantity": m.total_quantity,
            "Available": m.available_quantity,
            "Status": m.available_quantity < 5 ? 'LOW STOCK' : 'GOOD'
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Materials_Inventory");

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="Storage_Inventory.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting to Excel', error: error.message });
    }
};

exports.issueMaterial = async (req, res) => {
    try {
        const { material_id, user_id, asset_id, employee_id, manual_receiver_name, quantity, department, remarks } = req.body;
        const issuer_id = req.user.id; // From auth middleware
        const issue_date = new Date().toISOString().split('T')[0];

        await Material.issue({
            material_id, user_id, asset_id, employee_id, manual_receiver_name, quantity, issue_date, issuer_id, department, remarks
        });

        const io = req.app.get('io');
        if (io) io.emit('material_updated');

        res.json({ message: 'Material issued successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error issuing material', error: error.message });
    }
};

exports.refillMaterial = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { id } = req.params;
        await Material.updateStock(id, quantity);

        const io = req.app.get('io');
        if (io) io.emit('material_updated');

        res.json({ message: 'Stock refilled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error refilling stock', error: error.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await Material.getIssuanceLogs();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};
