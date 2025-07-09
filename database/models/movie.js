const {Model, DataTypes} = require('@sequelize/core');
const sequelize = require('./index');
const Actor = require('./actor');
class Movie extends Model {}

Movie.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'title_year_unique'
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'title_year_unique'
        },
        format: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Movies',
        timestamps: false
    },
);

Movie.belongsToMany(Actor, {
    through: 'Actors_In_Movies',
    as: 'actors',
    inverse: { as: 'movies' },
});
module.exports = Movie;