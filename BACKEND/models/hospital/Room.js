const { DataTypes } = require('sequelize');

const Room = (sequelize) => {
  const RoomModel = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ward_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'wards',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    room_number: {
      type: DataTypes.STRING(16),
      allowNull: false
    }
  }, {
    tableName: 'rooms',
    schema: 'hospital_schema',
    timestamps: false,
    underscored: true
  });

  return RoomModel;
};

module.exports = Room;
