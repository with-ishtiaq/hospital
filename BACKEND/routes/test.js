const express = require('express');
const router = express.Router();
const { testDbConnection } = require('../controllers/testController');

// Test database connection
router.get('/db-test', testDbConnection);

module.exports = router;
