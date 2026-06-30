const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    email: String,
    password: { type: String, required: true },
    role: String
}, { strict: false, timestamps: { createdAt: 'created_at', updatedAt: false } });

const UserModel = mongoose.models['users'] || mongoose.model('users', userSchema, 'users');

class User {
    static async create({ username, email, password, role }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const last = await UserModel.findOne().sort({ id: -1 }).lean();
        const newId = last && last.id ? last.id + 1 : 1;
        await UserModel.create({ id: newId, username, email, password: hashedPassword, role: role || 'User' });
        return newId;
    }
    static async findByEmail(email) {
        return await UserModel.findOne({ $or: [{ email: email }, { username: email }] }).lean();
    }
    static async findById(id) {
        let user;
        if (!isNaN(id)) {
            user = await UserModel.findOne({ id: Number(id) }).lean();
        }
        if (!user && mongoose.isValidObjectId(id)) {
            user = await UserModel.findById(id).lean();
        }
        return user;
    }
    static async getAll() {
        return await UserModel.find().sort({ created_at: -1 }).lean();
    }
    static async updateRole(id, role) {
        await UserModel.updateOne({ id: Number(id) }, { role });
        return true;
    }
    static async delete(id) {
        await UserModel.deleteOne({ id: Number(id) });
        return true;
    }
}
module.exports = User;
