const express = require('express');
const router = express.Router();

// Minimal placeholder routes to ensure valid middleware
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'beds' });
});

module.exports = router;
