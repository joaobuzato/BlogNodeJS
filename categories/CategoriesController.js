const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/categories/new", adminAuth, (req,res) =>{
    res.render("./admin/categories/new")
});

router.post("/categories/save", (req,res) => {
    var title = req.body.title;
    if(title == undefined ) {
        res.redirect("/admin/categories/new");
    }

    Category.create({
        title:title,
        slug: slugify(title)
    }).then(() => {
        res.redirect("/admin/categories");
    })

})

router.get("/admin/categories", adminAuth, (req,res) => {

    Category.findAll().then(categories => {
        res.render("admin/categories/index", {
            categories: categories
        });
    })
    
})

router.post("/categories/delete", adminAuth, (req,res) => {
    var id = req.body.id;
    if(id == undefined || isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.destroy({
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    })
});

router.get("/categories/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category => {
        if(category == undefined){
            console.log("categoria não encontrada")
            res.redirect("/admin/categories")
        }
        res.render("./admin/categories/edit", {
            category:category
        });

    }).catch((erro) => {
        console.log(erro)
        res.redirect("/admin/categories")
    })
});

router.post("/categories/update", adminAuth, (req,res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title:title, slug: slugify(title)}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    })
})

module.exports = router;