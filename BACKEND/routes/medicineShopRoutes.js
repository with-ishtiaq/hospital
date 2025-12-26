const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicineShopController');

// Public: list active medicine shops
router.get('/', controller.getShops);

// Public: build cross-shop search URLs
router.get('/search', controller.searchAcrossShops);

module.exports = router;
