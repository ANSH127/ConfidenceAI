const jwt= require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const requireAuth = async (req, res, next) => {
    const token = req.cookies?.jwt;
    
    if(!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }
    try {
        const mytoken=token.replace('Bearer ', ''); 
        const decoded = jwt.verify(mytoken, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded._id).select('_id');

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid authentication token' });
    }
}

module.exports = requireAuth;