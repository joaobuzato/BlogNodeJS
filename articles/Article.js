const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");
const { STRING } = require("sequelize");

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull:false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    creator: {
        type:STRING,
        allowNull:false
    }
});
Category.hasMany(Article);
Article.belongsTo(Category);

Article.sync({force: false});

module.exports = Article;