const { DataTypes } = require('sequelize');

const Ward = (sequelize) => {
  const WardModel = sequelize.define('Ward', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    tableName: 'wards',
    schema: 'hospital_schema',
    timestamps: false,
    underscored: true
  });

  return WardModel;
};

module.exports = Ward;
