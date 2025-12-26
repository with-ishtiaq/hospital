const { centralSequelize } = require('../config/database');

const testDbConnection = async (req, res) => {
  try {
    await centralSequelize.authenticate();
    
    // Get all tables in the database
    const [results] = await centralSequelize.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'
       ORDER BY table_name;`
    );
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      tables: results.map(row => row.table_name)
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to the database',
      error: error.message
    });
  }
};

module.exports = {
  testDbConnection
};
