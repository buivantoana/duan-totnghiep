'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ProductVariants', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            productId: {
                type: Sequelize.INTEGER,

            },
            colorId: {
                type: Sequelize.INTEGER,

            },
            sizeId: {
                type: Sequelize.INTEGER,

            },
            stock: {
                type: Sequelize.INTEGER
            },
            imageUrl: {
                type: Sequelize.TEXT('long')
            },
            price: {
                type: Sequelize.FLOAT
            },
            status: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ProductVariants');
    }
};
