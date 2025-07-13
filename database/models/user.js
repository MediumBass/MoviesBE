const {Model, DataTypes} = require('@sequelize/core');
const sequelize = require('./index');
class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            validate: {
                isEmail: {
                    msg: 'Email must be a valid email address',
                },
            }

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 300],
                    msg: 'Password must be at least 1 character',
                },
            },
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [1, 25],
                    msg: 'Name must be at least 1 character',
                },
            },
        }
    },
    {
        sequelize,
        modelName: 'Users',
        timestamps: true
    },
);

module.exports = User;