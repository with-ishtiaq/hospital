require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  test: {
    url: process.env.DATABASE_URL_TEST || 'postgresql://postgres:postgres@localhost:5432/centralized_db_test',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
};
