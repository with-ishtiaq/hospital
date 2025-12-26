const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Hospital name is required' },
        len: {
          args: [2, 255],
          msg: 'Hospital name must be between 2 and 255 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Hospital address is required' }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Hospital phone number is required' },
        is: {
          args: /^[\d\s+()-]+$/,
          msg: 'Invalid phone number format',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Hospital email is required' },
        isEmail: { msg: 'Please enter a valid email address' }
      }
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Please enter a valid URL' }
      }
    },
    doctorsUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Please enter a valid URL' }
      }
    },
    appointmentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Please enter a valid URL' }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: '/download.jpg'
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    locationAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    tableName: 'hospitals',
    hooks: {
      beforeCreate: (hospital) => {
        hospital.slug = slugify(hospital.name, { lower: true, strict: true });
      },
      beforeUpdate: (hospital) => {
        if (hospital.changed('name')) {
          hospital.slug = slugify(hospital.name, { lower: true, strict: true });
        }
      }
    }
  });

  // Add any associations here
  Hospital.associate = (models) => {
    // Example association:
    // Hospital.hasMany(models.Doctor, { foreignKey: 'hospitalId' });
  };

  return Hospital;
};
