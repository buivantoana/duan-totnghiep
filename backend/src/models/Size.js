'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        static associate(models) {
            Size.hasMany(models.ProductVariant, { foreignKey: 'sizeId', as: 'variants' });
        }
    };
    Size.init({
        name: DataTypes.STRING // VD: "S", "M", "L", "XL", "42", "43", "44"
    }, {
        sequelize,
        modelName: 'Size',
    });
    return Size;
};
