const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session")

const connection = require('./database/database');
const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController");

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

app.set('view engine', 'ejs');

app.use(session({
    secret: "Buz@t0S3cr3t",
    cookie: {
        maxAge: 300000
    }
}))


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

connection.authenticate()
    .then( () => {
        console.log("connection succeded");
    }). catch ( (error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req,res) => {
    Article.findAll({ limit: 2,
        order:[['id','DESC']]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles:articles, categories:categories});
        })
        
    })
});

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug:slug
        }
    }).then((article) => {
        if(article == undefined){
            res.redirect("/");
        }
        
        Category.findAll().then(categories => {
            res.render("article", {article:article, categories:categories});
        })



    }).catch((erro) => {
        res.redirect("/");
    })
} );

app.get("/categories/:slug", (req,res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category == undefined){
            res.redirect("/");
        }
        Category.findAll().then(categories => {
            res.render("index", {articles: category.articles, categories:categories});
        })
    }).catch(erro => {
        res.redirect("/");
    })
})

app.listen(8080, () => {
    console.log("API UP! ");
});