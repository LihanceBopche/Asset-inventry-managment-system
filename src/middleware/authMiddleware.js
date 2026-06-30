const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const dbUser = await User.findById(decoded.id);
        if (!dbUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }
        req.user = dbUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        const allowedRoles = roles.map(r => r.toLowerCase());
        const userRole = (req.user.role || '').toLowerCase();
        if (!allowedRoles.includes(userRole)) {
            console.error(`403 FORBIDDEN: UserRole='${userRole}', Allowed='${allowedRoles}'`);
            return res.status(403).json({ message: `Role ${req.user.role} is not authorized` });
        }
        next();
    };
};
