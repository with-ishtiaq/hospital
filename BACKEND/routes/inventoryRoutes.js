const express = require('express');
const router = express.Router();

// Basic inventory health endpoint to ensure router is valid
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'inventory' });
});

module.exports = router;
