const express = require('express'),
      router =  express.Router();
      passport = require('passport'),
      User = require('../models/user');

router.get("/", function(req,res){
        res.render("landing");
    
});

router.get("/index", function(req,res){
        res.render("landing");
    
});
    
router.get("/hidden", function(req,res){
    res.render("hidden");
    
});

router.get("/login-register", function(req,res){
    const errors = req.flash.error || [];
    res.render("login-register", {errors});
    
});
    
router.post("/login", passport.authenticate('local', { 
    failureRedirect: '/login-register', 
    successRedirect: '/index',
    failureFlash: true }), (req, res) => {
    req.session.save((err) => {
        if (err) {
        return next(err);
        }
        res.redirect('/index');
    });
});

router.post("/register", (req,res) => {
        console.log(req.body.username);
        console.log(req.body.password);
        
        User.register(new User({username : req.body.username}), req.body.password, function(err, user)  {
            if (err) {
            return res.status(500).json({err: err});
            return res.render('login-register');
            }
            passport.authenticate('local')(req, res, () => {
                req.session.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    else{
                        req.flash('success', 'Hi!, ' +user.username);
                        res.redirect('/index');
                    }
                    
                });
            });
        });
});
    

    
router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'You log out successfully');
    res.redirect('/index');
});



module.exports = router;