'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderProduct.belongsTo(models.TypeShip, { foreignKey: 'typeShipId', targetKey: 'id', as: 'typeShipData' })
            OrderProduct.belongsTo(models.Voucher, { foreignKey: 'voucherId', targetKey: 'id', as: 'voucherData' })
            OrderProduct.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'code', as: 'statusOrderData' })
            OrderProduct.hasMany(models.OrderDetail, { foreignKey: 'orderId' });
            OrderProduct.belongsTo(models.AddressUser, {
                foreignKey: 'addressUserId',
                targetKey: 'id', // 'id' là khóa chính trong bảng Address
                as: 'addressData'
            });
            OrderProduct.belongsTo(models.User, { foreignKey: 'userId', as: 'orders' });
        }
    };
    OrderProduct.init({

        addressUserId: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        points: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        statusId: DataTypes.STRING,
        statusHistory:DataTypes.STRING,
        typeShipId: DataTypes.INTEGER,
        voucherId: DataTypes.INTEGER,
        note: DataTypes.STRING,
        isPaymentOnlien: DataTypes.INTEGER,
        shipperId: DataTypes.INTEGER,
        image: DataTypes.BLOB('long')
    }, {
        sequelize,
        modelName: 'OrderProduct',
    });
    return OrderProduct;
};