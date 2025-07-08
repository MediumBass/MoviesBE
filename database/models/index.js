const { Sequelize } = require('@sequelize/core');
const { SqliteDialect } = require('@sequelize/sqlite3');

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: 'sequelize.sqlite',
});


sequelize
    .sync()
    .then(() => console.log('Database connected.'))
    .catch((err) => console.error('Cant connect to database:', err));


module.exports = sequelize