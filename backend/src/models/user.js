'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Allcode, { foreignKey: 'genderId', targetKey: 'code', as: 'genderData' })
            User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'code', as: 'roleData' })
            User.hasMany(models.OrderProduct, { foreignKey: 'userId', as: 'orders' });
        }
    };
    User.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        address: DataTypes.STRING,
        genderId: DataTypes.STRING,
        phonenumber: DataTypes.STRING,
        image: DataTypes.BLOB('long'),
        dob: DataTypes.STRING,
        isActiveEmail: DataTypes.BOOLEAN,
        roleId: DataTypes.STRING,
        statusId: DataTypes.STRING,
        usertoken: DataTypes.STRING,
        points: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};