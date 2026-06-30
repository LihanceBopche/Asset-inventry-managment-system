const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    id: Number,
    pc_name: String,
    serial_no: String,
    model_name: String,
    asset_type: String, // Legacy fallback
    work_location: String,
    ram: String,
    storage: String,
    os: String,
    mac_address: String,
    remarks: String,

    // New Data-Driven Fields
    assetTag: { type: String, unique: true, sparse: true },
    assetType: { type: String, enum: ['Laptop', 'Server', 'Monitor', 'Desktop', 'Accessory', 'Other', 'Workstation'] },
    brand: String,
    purchasePrice: { type: Number, default: 0 },
    purchaseDate: { type: Date },
    warrantyPeriod: { type: Number, default: 12 },
    department: { type: String },
    status: { type: String, enum: ['Active', 'In-Store', 'In-Repair', 'Repair', 'Scrap', 'Allocated', 'Idle'] },
    condition: { type: String, enum: ['Functional', 'Degraded', 'Non-Functional'] }
}, { strict: false, timestamps: true });

const AssetModel = mongoose.models['assets'] || mongoose.model('assets', assetSchema, 'assets');

class Asset {
    static async create(data) {
        const last = await AssetModel.findOne().sort({ id: -1 }).lean();
        const newId = last && last.id ? last.id + 1 : 1;
        await AssetModel.create({ id: newId, ...data });
        return newId;
    }

    static async getAll() {
        return await AssetModel.find().sort({ id: -1 }).lean();
    }

    static async getById(id) {
        return await AssetModel.findOne({ id: Number(id) }).lean();
    }

    static async update(id, data) {
        await AssetModel.updateOne({ id: Number(id) }, data);
        return true;
    }

    static async delete(id) {
        await AssetModel.deleteOne({ id: Number(id) });
        return true;
    }

    // New method for analytics
    static getModel() {
        return AssetModel;
    }
}

module.exports = Asset;
