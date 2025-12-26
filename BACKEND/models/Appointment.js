const { DataTypes } = require('sequelize');
const { centralSequelize: sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'scheduled',
    validate: {
      isIn: [['scheduled', 'completed', 'cancelled']]
    }
  },
  notes: DataTypes.TEXT,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true
});

// Export the model first
module.exports = Appointment;

// Then set up associations
module.exports.associate = (models) => {
  const { Patient, Doctor } = models;
  
  if (Patient && Doctor) {
    Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
    Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });
    Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });
    Doctor.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'appointments' });
  }
};
