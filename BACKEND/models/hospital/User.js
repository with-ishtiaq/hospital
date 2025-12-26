const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { getHospitalSequelize } = require('../../config/database');

const User = (sequelize) => {
  const UserModel = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'doctor', 'nurse', 'staff'),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'users',  // Explicit table name
    schema: 'hospital_schema',
    timestamps: true,    // Adds createdAt and updatedAt timestamps
    underscored: true,   // Uses snake_case for column names
  });

  // Instance method to check password
  UserModel.prototype.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  // Hash password before saving
  UserModel.beforeCreate(async (user) => {
    if (user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }
  });

  // Hash password before updating if it was changed
  UserModel.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }
  });

  return UserModel;
};

module.exports = User;
