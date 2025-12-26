const { DataTypes } = require('sequelize');

const MedicalRecord = (sequelize) => {
  const MedicalRecordModel = sequelize.define('MedicalRecord', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    visit_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // patient_id and doctor_id will be added as foreign keys in the associations
  }, {
    tableName: 'medical_records',
    schema: 'hospital_schema',
    timestamps: true,
    underscored: true,
  });

  return MedicalRecordModel;
};

module.exports = MedicalRecord;
