const {Model, DataTypes} = require("@sequelize/core");
const sequelize = require('./index')
class Actor extends Model {}

Actor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Actors',
        timestamps: true
    },
);

module.exports = Actor;