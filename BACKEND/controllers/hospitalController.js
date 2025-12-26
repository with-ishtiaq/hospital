const { Hospital } = require('../models');

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
exports.getHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.findAll({
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (err) {
    console.error('Error fetching hospitals:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByPk(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        error: 'Hospital not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hospital
    });
  } catch (err) {
    console.error('Error fetching hospital:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add other controller methods as needed (create, update, delete, etc.)