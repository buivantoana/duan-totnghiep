'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderDetail.belongsTo(models.OrderProduct, {
                foreignKey: 'orderId',
                targetKey: 'id', // 'id' là khóa chính trong bảng Address
                as: 'orderDetail'
            });
            OrderDetail.belongsTo(models.Product, { foreignKey: 'productId', as: 'productOrder' });
        }
    };
    OrderDetail.init({
        orderId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        realPrice: DataTypes.BIGINT,
        color: DataTypes.STRING,
        image: DataTypes.STRING,
        size: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'OrderDetail',
    });
    return OrderDetail;
};