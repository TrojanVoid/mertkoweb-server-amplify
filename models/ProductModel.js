const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ImageModel = require('./ImageModel');

const ProductModel = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isConcept: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
    tableName: "products",
    timestamps: true,
});

ProductModel.hasOne(ImageModel, { foreignKey: 'productId', as: 'image' });
ImageModel.belongsTo(ProductModel, { foreignKey: 'productId', as: 'product' });

module.exports = ProductModel;