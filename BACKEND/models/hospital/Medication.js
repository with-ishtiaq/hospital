const { DataTypes } = require('sequelize');

const Medication = (sequelize) => {
  const MedicationModel = sequelize.define('Medication', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dosage_form: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    strength: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'medications',
    schema: 'hospital_schema',
    timestamps: true,
    underscored: true,
  });

  return MedicationModel;
};

module.exports = Medication;
