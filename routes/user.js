const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../model/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs");
})

router.post("/signup", WrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }
    catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}))


router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), // PASSPORT MIDDLEWARE

    WrapAsync(async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        console.log(redirectUrl);
        res.redirect(redirectUrl);
    }
))

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
})


module.exports = router;