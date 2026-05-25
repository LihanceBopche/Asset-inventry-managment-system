const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    id: Number,
    material_name: String,
    total_quantity: Number,
    available_quantity: Number,
    rack: String,
    col_name: String,
    part_name: String
}, { strict: false });

const issuanceLogSchema = new mongoose.Schema({
    id: Number,
    material_id: Number,
    user_id: Number,
    asset_id: Number,
    employee_id: Number,
    manual_receiver_name: String,
    quantity: Number,
    issue_date: String,
    issuer_id: Number,
    department: String,
    remarks: String
}, { strict: false });

const MaterialModel = mongoose.models['materials'] || mongoose.model('materials', materialSchema, 'materials');
const IssuanceLogModel = mongoose.models['issuance_logs'] || mongoose.model('issuance_logs', issuanceLogSchema, 'issuance_logs');

class Material {
    static async create({ material_name, total_quantity, rack, col_name, part_name }) {
        const last = await MaterialModel.findOne().sort({ id: -1 }).lean();
        const newId = last && last.id ? last.id + 1 : 1;
        await MaterialModel.create({
            id: newId, material_name, total_quantity, available_quantity: total_quantity,
            rack: rack || null, col_name: col_name || null, part_name: part_name || null
        });
        return newId;
    }

    static async getAll() {
        return await MaterialModel.find().sort({ material_name: 1 }).lean();
    }

    static async updateStock(id, quantity) {
        await MaterialModel.updateOne(
            { id: Number(id) },
            { $inc: { total_quantity: Number(quantity), available_quantity: Number(quantity) } }
        );
        return true;
    }

    static async update(id, { material_name, rack, col_name, part_name }) {
        await MaterialModel.updateOne({ id: Number(id) }, { material_name, rack, col_name, part_name });
        return true;
    }

    static async delete(id) {
        await MaterialModel.deleteOne({ id: Number(id) });
        return true;
    }

    static async issue({ material_id, user_id, asset_id, employee_id, manual_receiver_name, quantity, issue_date, issuer_id, department, remarks }) {
        const mat = await MaterialModel.findOne({ id: Number(material_id) });
        if (!mat || mat.available_quantity < quantity) {
            throw new Error('Insufficient stock');
        }

        const lastLog = await IssuanceLogModel.findOne().sort({ id: -1 }).lean();
        const newLogId = lastLog && lastLog.id ? lastLog.id + 1 : 1;

        await IssuanceLogModel.create({
            id: newLogId, material_id, user_id: user_id || null, asset_id: asset_id || null,
            employee_id: employee_id || null, manual_receiver_name: manual_receiver_name || null,
            quantity, issue_date, issuer_id, department, remarks
        });

        await MaterialModel.updateOne({ id: Number(material_id) }, { $inc: { available_quantity: -quantity } });
        return true;
    }

    static async getIssuanceLogs() {
        const logs = await IssuanceLogModel.find().sort({ issue_date: -1 }).lean();

        // Manual "populates"
        const UserModel = mongoose.models['users'] || mongoose.model('users');
        const AssetModel = mongoose.models['assets'] || mongoose.model('assets');
        const EmployeeModel = mongoose.models['employees'] || mongoose.model('employees');

        const mats = await MaterialModel.find().lean();
        const users = await UserModel.find().lean();
        const assets = await AssetModel.find().lean();
        const emps = await EmployeeModel.find().lean();

        return logs.map(l => {
            const m = mats.find(x => x.id === l.material_id);
            const u = users.find(x => x.id === l.user_id);
            const i = users.find(x => x.id === l.issuer_id);
            const a = assets.find(x => x.id === l.asset_id);
            const e = emps.find(x => x.id === l.employee_id);

            return {
                ...l,
                material_name: m ? m.material_name : null,
                receiver_name: u ? u.username : null,
                issuer_name: i ? i.username : null,
                pc_name: a ? a.pc_name : null,
                emp_name: e ? e.emp_name : null
            };
        });
    }
}

module.exports = Material;
