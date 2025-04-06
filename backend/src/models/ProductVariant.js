'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductVariant extends Model {
        static associate(models) {
            ProductVariant.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
            ProductVariant.belongsTo(models.Color, { foreignKey: 'colorId', as: 'color' });
            ProductVariant.belongsTo(models.Size, { foreignKey: 'sizeId', as: 'size' });
        }
    };
    ProductVariant.init({
        productId: DataTypes.INTEGER,
        colorId: DataTypes.INTEGER,
        sizeId: DataTypes.INTEGER,
        stock: DataTypes.INTEGER,
        imageUrl: DataTypes.TEXT('long'), 
        price: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'ProductVariant',
    });
    return ProductVariant;
};
