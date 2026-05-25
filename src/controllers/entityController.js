const Department = require('../models/Department');
const Employee = require('../models/Employee');

// Department Methods
exports.getDepartments = async (req, res) => {
    try {
        const depts = await Department.getAll();
        res.json(depts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const { dept_name } = req.body;
        await Department.create(dept_name);
        const io = req.app.get('io');
        if (io) io.emit('entity_updated');
        res.status(201).json({ message: 'Department created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { dept_name } = req.body;
        await Department.update(req.params.id, dept_name);
        const io = req.app.get('io');
        if (io) io.emit('entity_updated');
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        await Department.delete(req.params.id);
        const io = req.app.get('io');
        if (io) io.emit('entity_updated');
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department', error: error.message });
    }
};

// Employee Methods
exports.getEmployees = async (req, res) => {
    try {
        const { deptId } = req.query;
        let emps = deptId ? await Employee.getByDept(deptId) : await Employee.getAll();
        res.json(emps);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        await Employee.create(req.body);
        const io = req.app.get('io');
        if (io) io.emit('entity_updated');
        res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        await Employee.update(req.params.id, req.body);
        const io = req.app.get('io');
        if (io) io.emit('entity_updated');
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.delete(req.params.id);
        const io = req.app.get('io');
        if (io) io.emit('entity_updated');
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};
