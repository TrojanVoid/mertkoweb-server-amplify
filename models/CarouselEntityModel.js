const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ImageModel = require('./ImageModel');

const CarouselEntityModel = sequelize.define('CarouselEntity', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  tableName: 'carousel_entities',
  timestamps: true
});

CarouselEntityModel.hasOne(ImageModel, { foreignKey: 'carouselEntityId', as: 'image' });
ImageModel.belongsTo(CarouselEntityModel, { foreignKey: 'carouselEntityId', as: 'carouselEntity' });

module.exports = CarouselEntityModel;
