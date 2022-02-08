const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req,res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        
        res.render("./admin/articles/index", {articles:articles});
    })
    
});

router.get("/admin/articles/new",adminAuth , (req,res) => {
    Category.findAll().then(categories => {
        res.render("./admin/articles/new", {categories, categories});
    })
    
})

router.post("/admin/articles/save", adminAuth, (req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title:title,
        slug: slugify(title),
        body:body,
        categoryId:category
    }).then(() => {
        res.redirect("/admin/articles");
    })
});


router.post("/admin/articles/delete", adminAuth, (req,res) => {
    var id = req.body.id;
    if(id == undefined || isNaN(id)){
        res.redirect("/admin/articles");
    }

    Article.destroy({
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    })
});

router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/articles")
        }
    Category.findAll().then(categories => {
        Article.findByPk(id).then(article => {
            if(article == undefined){
                console.log("artigo não encontrado")
                res.redirect("/admin/articles")
            }
            res.render("./admin/articles/edit", {
                article:article, categories:categories
            });

        }).catch((erro) => {
            console.log(erro)
            res.redirect("/admin/articles")
        })
    });
});

router.post("/admin/articles/update", adminAuth, (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    Article.update({title:title,
        slug: slugify(title),
        body:body,
        categoryId:category}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(erro => {
        console.log(erro)
    })
});

router.get("/articles/page/:num", (req,res) => {
    var page = req.params.num;
    offset = 0;
    limit = 2;
    var homepage = false;
    if(isNaN(page) || page == 1){
        offset=0;
    } else {
        offset = (parseInt(page)-1) * limit;
    }

    Article.findAndCountAll({ limit: limit, offset: offset, order:[['id','DESC']]}).then(articles => {
        var next;
        if(offset+limit >= articles.count){
            next = false;
        } else {
            next = true;
        }
        result = {
            next: next,
            page:parseInt(page),
            articles : articles,

        }
        Category.findAll().then(categories => {
            res.render("./admin/articles/page", {
                result:result,
                categories:categories
            })
        })
    })
})


module.exports = router;