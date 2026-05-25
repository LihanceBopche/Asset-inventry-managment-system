const mongoose = require('mongoose');

const deptSchema = new mongoose.Schema({
    id: Number,
    dept_name: { type: String, required: true }
}, { strict: false });

const DepartmentModel = mongoose.models['departments'] || mongoose.model('departments', deptSchema, 'departments');

class Department {
    static async getAll() {
        return await DepartmentModel.find().lean();
    }
    static async create(name) {
        const last = await DepartmentModel.findOne().sort({ id: -1 }).lean();
        const newId = last && last.id ? last.id + 1 : 1;
        await DepartmentModel.create({ id: newId, dept_name: name });
        return newId;
    }
    static async update(id, name) {
        await DepartmentModel.updateOne({ id: Number(id) }, { dept_name: name });
        return true;
    }
    static async delete(id) {
        await DepartmentModel.deleteOne({ id: Number(id) });
        return true;
    }
}
module.exports = Department;
