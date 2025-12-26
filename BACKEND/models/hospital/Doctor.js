const { DataTypes } = require('sequelize');

const Doctor = (sequelize) => {
  const DoctorModel = sequelize.define('Doctor', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    license_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // user_id will be added as a foreign key in the associations
  }, {
    tableName: 'doctors',
    schema: 'hospital_schema',
    timestamps: true,
    underscored: true,
  });

  return DoctorModel;
};

module.exports = Doctor;
