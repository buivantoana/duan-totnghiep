'use strict';

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {

        static associate(models) {
            Product.belongsTo(models.Allcode, { foreignKey: 'categoryId', targetKey: 'code', as: 'categoryData' })
            Product.belongsTo(models.Allcode, { foreignKey: 'brandId', targetKey: 'code', as: 'brandData' })
            Product.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'code', as: 'statusData' })
            Product.hasMany(models.ProductVariant, { foreignKey: 'productId', as: 'variants' });
            Product.belongsTo(models.ShopCart, { foreignKey: 'id', as: 'product' });
            Product.hasMany(models.Favorite, { foreignKey: 'productId', as: 'favorites' });
            Product.hasMany(models.OrderDetail, { foreignKey: 'productId', as: 'productOrder' });
        }
    };
    Product.init({
        name: DataTypes.STRING,
        contentHTML: DataTypes.TEXT('long'),
        contentMarkdown: DataTypes.TEXT('long'),
        statusId: DataTypes.STRING,
        categoryId: DataTypes.STRING,
        image: DataTypes.INTEGER,
        originalPrice: DataTypes.BIGINT,
        discountPrice: DataTypes.BIGINT,
        description: DataTypes.TEXT('long'),
        brandId: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};