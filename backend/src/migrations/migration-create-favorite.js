'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Users', 
        //   key: 'id',
        // },
        // onDelete: 'CASCADE', 
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Products', 
        //   key: 'id',
        // },
        // onDelete: 'CASCADE', // Nếu Product bị xóa, tất cả các Favorite liên quan cũng sẽ bị xóa
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorites');
  }
};
