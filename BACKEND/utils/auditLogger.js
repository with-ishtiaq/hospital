const { pool } = require('../db');

const logAction = async (userId, action, status, ip, details = {}) => {
  // If userId is not a number, try to find the user by email
  const query = `
    INSERT INTO audit_logs (user_id, action, status, ip_address, details, created_at)
    VALUES (
      CASE 
        WHEN $1 ~ '^\d+$' THEN $1::integer
        ELSE (
          SELECT id FROM users WHERE email = $1
        )
      END,
      $2, $3, $4, $5, NOW()
    )
  `;
  
  try {
    await pool.query(query, [userId, action, status, ip, JSON.stringify(details)]);
  } catch (err) {
    console.error('Error logging audit action:', err);
  }
};

module.exports = { logAction };
