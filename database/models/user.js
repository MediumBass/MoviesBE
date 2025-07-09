const {Model, DataTypes} = require('@sequelize/core');
const sequelize = require('./index');
class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: 'Users',
        timestamps: true
    },
);

module.exports = User;