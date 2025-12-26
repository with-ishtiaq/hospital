const { DataTypes } = require('sequelize');

const PrescriptionItem = (sequelize) => {
  const PrescriptionItemModel = sequelize.define('PrescriptionItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dosage_instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    refills: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    // prescription_id and medication_id will be added as foreign keys in the associations
  }, {
    tableName: 'prescription_items',
    schema: 'hospital_schema',
    timestamps: true,
    underscored: true,
  });

  return PrescriptionItemModel;
};

module.exports = PrescriptionItem;
