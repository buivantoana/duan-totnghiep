'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Favorite extends Model {
        static associate(models) {
            Favorite.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }

    Favorite.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Favorite',
    });

    return Favorite;
};
