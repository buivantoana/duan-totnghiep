'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ShopCart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ShopCart.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    };
    ShopCart.init({
        userId: DataTypes.INTEGER,
        productdetailsizeId: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        statusId: DataTypes.STRING,
        productdetailcolor:DataTypes.STRING,
        productId:DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'ShopCart',
    });
    return ShopCart;
};