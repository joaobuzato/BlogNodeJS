const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./User");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", (req,res) => {
    User.findAll().then((users) => {
        res.render("./admin/users/index", {users:users})
    })
});

router.get("/admin/users/create", (req,res) => {
    res.render("./admin/users/create")
});

router.post("/users/create", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({where:{email:email}}).then( user => {
        if(user != undefined) {
            res.redirect("/admin/users/create");
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email:email,
                password:hash
            }).then(() => {
                res.redirect("/")
            }).catch((erro) => {
                res.send(erro)
            })
        }

    })
});

router.get("/login", (req,res) => {
    res.render("./admin/users/login");
});

router.post("/authenticate", (req,res) =>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email:email}}).then(user => {
        if (user==undefined){
            res.redirect("/login");
        } else {
            var validPass = bcrypt.compareSync(password,user.password);
            if(!validPass) {
                res.redirect("/login");
            } else {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin");
            }
        }
        

    })
});

router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/");
})

router.get("/admin", adminAuth, (req,res)  => {
    email = req.session.user.email;
    res.render("./admin", { email:email });
})


module.exports = router;