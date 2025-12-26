const { getHospitalSequelize } = require('../config/database');

const setHospitalContext = (req, res, next) => {
    const preferred = req.headers['x-hospital-id'] || req.user?.hospitalId || req.subdomains?.[0];
    // Default to hospital 1 if not provided or not a valid number
    const hospitalId = Number(preferred) && [1,2,3,4,5].includes(Number(preferred)) ? Number(preferred) : 1;
    try {
        req.db = getHospitalSequelize(hospitalId);
        req.hospitalId = hospitalId;
        next();
    } catch (error) {
        console.error('Error setting hospital context:', error);
        res.status(400).json({ error: 'Invalid hospital context' });
    }
};

module.exports = setHospitalContext;
