const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// For development, use SQLite
const env = process.env.NODE_ENV || 'development';
let sequelize;

if (env === 'development') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true
    }
  });
} else {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE;

  if (databaseUrl) {
    sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
      },
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME || 'healthcare_central',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: true,
        },
      }
    );
  }
}

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  testConnection
};
