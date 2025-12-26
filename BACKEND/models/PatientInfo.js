// PatientInfo.js - Stores patient medical information
const { DataTypes } = require('sequelize');
const { centralSequelize: sequelize } = require('../config/database');
const User = require('./User');

const PatientInfo = sequelize.define('PatientInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',  // This references the table name, not the model name
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  blood_type: DataTypes.STRING,
  allergies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  medications: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  medical_history: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  emergency_contact_name: DataTypes.STRING,
  emergency_contact_relationship: DataTypes.STRING,
  emergency_contact_phone: DataTypes.STRING,
  insurance_provider: DataTypes.STRING,
  policy_number: DataTypes.STRING,
  group_number: DataTypes.STRING
}, {
  tableName: 'patient_infos',
  timestamps: true,
  underscored: true
});

// Define associations
PatientInfo.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

User.hasOne(PatientInfo, {
  foreignKey: 'user_id',
  as: 'patientInfo'
});

module.exports = PatientInfo;
