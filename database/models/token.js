const {Model, DataTypes} = require("@sequelize/core");
const sequelize = require('./index')
const User = require("./user");
class Token extends Model {}

Token.init(
    {
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'email',
            },
            onDelete: 'CASCADE'
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Tokens',
        timestamps: true
    },
);

User.hasMany(Token, { foreignKey: 'user_email', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'user_email', as: 'user' });

module.exports = Token;