const express = require('express');
const router = express.Router();
const {
  getHospitals,
  getHospital
} = require('../controllers/hospitalController');

// Public routes
router.route('/')
  .get(getHospitals);

router.route('/:id')
  .get(getHospital);

module.exports = router;