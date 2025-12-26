const { DataTypes } = require('sequelize');

const Patient = (sequelize) => {
  const PatientModel = sequelize.define('Patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blood_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergency_contact_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergency_contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    medical_history: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'patients',
    schema: 'hospital_schema',
    timestamps: true,
    underscored: true,
  });

  return PatientModel;
};

module.exports = Patient;
