const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    id: Number,
    emp_name: String,
    emp_id: String,
    dept_id: Number
}, { strict: false });

const EmployeeModel = mongoose.models['employees'] || mongoose.model('employees', empSchema, 'employees');
const DepartmentModel = mongoose.models['departments'] || mongoose.model('departments', new mongoose.Schema({ id: Number, dept_name: String }, { strict: false }), 'departments');

class Employee {
    static async getAll() {
        const employees = await EmployeeModel.find().lean();
        const depts = await DepartmentModel.find().lean();

        return employees.map(e => {
            const d = depts.find(dept => dept.id === e.dept_id || String(dept.dept_name) === String(e.dept_name));
            return {
                ...e,
                dept_name: d ? d.dept_name : (e.dept_name || null)
            };
        }).sort((a, b) => (a.emp_name || '').localeCompare(b.emp_name || ''));
    }

    static async getByDept(deptId) {
        return await EmployeeModel.find({ dept_id: Number(deptId) }).lean();
    }

    static async create({ emp_name, emp_id, dept_id }) {
        const last = await EmployeeModel.findOne().sort({ id: -1 }).lean();
        const newId = last && last.id ? last.id + 1 : 1;
        await EmployeeModel.create({ id: newId, emp_name, emp_id, dept_id: Number(deptId) });
        return newId;
    }

    static async update(id, { emp_name, emp_id, dept_id }) {
        await EmployeeModel.updateOne({ id: Number(id) }, { emp_name, emp_id, dept_id: Number(deptId) });
        return true;
    }

    static async delete(id) {
        await EmployeeModel.deleteOne({ id: Number(id) });
        return true;
    }
}

module.exports = Employee;
