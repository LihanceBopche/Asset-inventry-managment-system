const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const userId = await User.create({ username, email, password, role });

        // Real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('user_updated');
        }

        res.status(201).json({ message: 'Registration successful', userId });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userId = user.id || user._id;
        const token = jwt.sign(
            { id: userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: { id: userId, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        await User.updateRole(req.params.id, role);

        const io = req.app.get('io');
        if (io) io.emit('user_updated');

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Prevent deleting oneself
        if (req.params.id == req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        await User.delete(req.params.id);

        const io = req.app.get('io');
        if (io) io.emit('user_updated');

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
