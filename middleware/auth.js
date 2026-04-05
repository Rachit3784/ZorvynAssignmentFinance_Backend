import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/EnvVariable.js';
import Users from '../model/UserSchema.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ _id: decoded.id, isDeleted: { $ne: true } });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found or deleted' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
             return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        res.status(401).json({ success: false, message: 'Invalid authentication token' });
    }
};
