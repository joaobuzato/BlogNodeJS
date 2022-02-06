const Sequelize = require("sequelize");
const connection = new Sequelize('guiapress', 'root', 'Buzato42', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;