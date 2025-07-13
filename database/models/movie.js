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
            unique: 'title_year_unique',
            validate: {
                len: {
                    args: [1, 200],
                    msg: 'Title must be at least 1 character',
                },
            },
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'title_year_unique',
            validate: {
                isInt: {
                    msg: 'Year must be an integer',
                },
                min: {
                    args: [1888],
                    msg: 'Year must be no earlier than 1888',
                },
                max: {
                    args: [new Date().getFullYear()],
                    msg: 'Year must not be in the future',
                },
            },
        },
        format: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['DVD', 'VHS', 'Blu-Ray']],
                    msg: 'Format must be one of: DVD, VHS, Blu-Ray',
                },
            }
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