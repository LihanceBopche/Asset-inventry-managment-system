const mongoose = require('mongoose');

const rackSchema = new mongoose.Schema({ id: Number, name: String }, { strict: false });
const colSchema = new mongoose.Schema({ id: Number, rack_id: Number, name: String }, { strict: false });
const partSchema = new mongoose.Schema({ id: Number, column_id: Number, name: String }, { strict: false });

const RackModel = mongoose.models['racks'] || mongoose.model('racks', rackSchema, 'racks');
const ColumnModel = mongoose.models['storage_columns'] || mongoose.model('storage_columns', colSchema, 'storage_columns');
const PartModel = mongoose.models['storage_parts'] || mongoose.model('storage_parts', partSchema, 'storage_parts');

exports.getRacks = async (req, res) => {
    try {
        const rows = await RackModel.find().sort({ id: 1 }).lean();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching racks' });
    }
};

exports.getColumnsByRack = async (req, res) => {
    try {
        const rows = await ColumnModel.find({ rack_id: Number(req.params.rackId) }).sort({ id: 1 }).lean();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching columns' });
    }
};

exports.getPartsByColumn = async (req, res) => {
    try {
        const rows = await PartModel.find({ column_id: Number(req.params.colId) }).sort({ id: 1 }).lean();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parts' });
    }
};
