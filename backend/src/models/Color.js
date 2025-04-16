'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Color extends Model {
        static associate(models) {
            Color.hasMany(models.ProductVariant, { foreignKey: 'colorId', as: 'variants' });
        }
    };
    Color.init({
        name: DataTypes.STRING, // VD: "Red", "Blue", "Black"
        hexCode: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'S1', 
        } // VD: "#FF0000" (Mã màu)
    }, {
        sequelize,
        modelName: 'Color',
    });
    return Color;
};
