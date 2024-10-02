const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImageModel = sequelize.define('Image', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  driveId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  carouselEntityId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'carousel_entities',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id'
    }
  }
}, {
  tableName: 'images',
  timestamps: false 
});



module.exports = ImageModel;
