const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    id: Number,
    pc_name: String,
    serial_no: String,
    model_name: String,
    asset_type: String,
    department: String,
    work_location: String,
    ram: String,
    storage: String,
    os: String,
    mac_address: String,
    status: String,
    remarks: String
}, { strict: false });

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
}

module.exports = Asset;
