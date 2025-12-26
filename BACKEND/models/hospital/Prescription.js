const { DataTypes } = require('sequelize');

const Prescription = (sequelize) => {
  const PrescriptionModel = sequelize.define('Prescription', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'expired', 'fulfilled', 'cancelled']],
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // patient_id and doctor_id will be added as foreign keys in the associations
  }, {
    tableName: 'prescriptions',
    schema: 'hospital_schema',
    timestamps: true,
    underscored: true,
  });

  return PrescriptionModel;
};

module.exports = Prescription;
