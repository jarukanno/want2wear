const express = require('express'),
      router =  express.Router(),
      passport = require('passport'),
      User = require('../models/user'),
      Stock = require('../models/stock'), 
      Color = require('../models/color'),
      Size = require('../models/size'),
      Product = require('../models/product'),
      Cart = require('../models/cart'),
      Purchase = require('../models/purchase'),
      Order = require('../models/order'),
      Review = require('../models/reviews'),
      middleware = require('../middleware'),
      Promise = require('bluebird');

router.get("/", function(req,res){
    
        res.render("landing");
});

router.get("/index", function(req,res){
        res.render("landing");
});
    
router.get("/login-register", function(req,res, next){
    const errors = req.flash.error || [];
    res.render("login-register",{errors:errors});
});
    
router.post("/login", passport.authenticate('local', { 
    failureRedirect: '/login-register', 
    successRedirect: '/index',
    failureFlash: true }), (req, res) => {
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

router.post("/register", (req,res) => {

        User.register(new User({username : req.body.username}), req.body.password, (errors, user) => {
            if (errors) {
                console.log(errors);
                return res.render('login-register', {errors: errors.message} );
            }
            else{
                if(req.body.adminCode === 'adminnaja'){
                User.findOneAndUpdate({username: req.body.username}, {isAdmin: true},  (err,update) => {
                   console.log(err);
                });
                }
                passport.authenticate('local')(req, res, () => {
                    req.session.save((err) => {
                        if (err) {
                            return next(err);
                        }
                        else{
                            return res.render('login-register', {errors: "Please login"} );                       
                        } 
                    });
                });
            }
            
        });
});
    
router.get('/want2wear/profile' ,middleware.isLoggedIn,  function(req,res){

    var currentUser = req.user.username;
    User.findOne({username: currentUser})
    .populate({
        path: 'Order',
        model: 'Order', 
        populate: [{
            path: 'Purchase',
            model: 'Purchase',
            populate: [{
                path: 'PurchaseItem',
                model: 'Stock',
                populate:[{
                    path: 'productID',
                    model: 'Product'
                },{
                    path: 'size',
                    model: 'Size'
                },{
                    path: 'colors',
                    model: 'Color'
                }]
            }]
        }]
    })
    .exec(function (err,show){
        
               if(err){
                   console.log(err);
               }
               else{
                res.render("profile" ,{order:show});
               }
           });
});
    

router.get("/want2wear/shoppingcart", middleware .isLoggedIn, function(req,res,next){
    var user = req.user;
    if(req.session.cart == null) {
        var product = null ;
        return res.render("cart", {products: product, totalPrice:0});    
        
    }
    else{
        async function main(){
            var newProduct = [];
            var cart = new Cart(req.session.cart ? req.session.cart : {items: {}}); 
            var data = cart.generateArray();
            let promises = await (data.map( function(stock){
                   return Stock.findById(stock.item.options).populate('productID size colors').exec().then(function(details){
                    
                                            newProduct.push({details:details,qty:stock.qty, price:stock.price });   
                                            return newProduct;
                            });   
            }));
            Promise.all(promises).then(function(results){
            
                res.render("cart", {products: results[0], totalPrice: cart.totalPrice, totalQty: cart.totalQty , totalProduct: cart.totalProduct, user: user}); 
            })  
        }
        main();
    }
});

router.put("/want2wear/shoppingcart/update/:id" , function(req,res,next){
    
    var stockID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    Stock.findById(stockID, function(err,available){
        if(err){
            console.log(err);
        }
        else{
            cart.addOne(stockID,available.quantity);
            req.session.cart = cart;
            res.redirect('/want2wear/shoppingcart');
        }
    });  
});

router.delete("/want2wear/shoppingcart/update/:id" , function(req,res,next){
    
    var stockID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    cart.decrese(stockID);
    req.session.cart = cart;
    res.redirect('/want2wear/shoppingcart');

});

router.delete("/want2wear/shoppingcart/delete/:id" , function(req,res,next){
    
    var stockID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
    cart.delete(stockID);
    req.session.cart = cart;
    res.redirect('/want2wear/shoppingcart');

});

router.delete("/want2wear/shoppingcart/clear" , function(req,res,next){
    
    delete req.session.cart;
    res.redirect('/want2wear/shoppingcart');

});


router.post("/want2wear/shoppingcart/payment" ,middleware .isLoggedIn,  function(req,res,next){
    var user = req.query.user;
    var currentUser = req.user;
    
    var shipment = req.body.shipment;
    if(shipment == null) {
        shipment = "Unselected";
        res.redirect('/want2wear/shoppingcart'); 
    }

    if(user != currentUser._id){
        res.redirect('/index') ; 
    }
    else{
        if(req.session.cart == null) {
        
         res.redirect('/want2wear/shoppingcart') ; 
        }
        else{
            
            var cart = new Cart(req.session.cart ? req.session.cart : {items: {}}); 
            res.render("payment", {totalProduct: cart.totalProduct,totalPrice: cart.totalPrice,shipment:shipment,user: currentUser});
        }
    }
    
    
});

router.post("/want2wear/shoppingcart/complete" ,middleware .isLoggedIn,  function(req,res,next){

    var user = req.query.user;
    var currentUser = req.user;
    var shipment = req.query.shipment;
    
    if( user != currentUser._id){
        res.redirect('/index');
    }
    else{
        if(req.session.cart == null){
            res.redirect('/want2wear/shoppingcart') ;
        }
        else{
          var promise1 =  User.findById(currentUser)
          .exec()
          .then(function(foundUser){

                        Order.create({User : foundUser,shipmentType : shipment}).then( addnewUser => {
                            async function main(addnewUser){
                                
                                var newProduct = [];
                                var cart = new Cart(req.session.cart ? req.session.cart : {items: {}}); 
                                var data = cart.generateArray();
                                let promises = await (data.map( function(stock){
                                       return Stock.findById(stock.item.options).populate('productID size colors').exec().then(function(details){
                                        
                                                                newProduct.push({details:details,qty:stock.qty, price:stock.price });   
                                                                 return newProduct;
                                        });   
                                }));
                                Promise.all(promises).then(function(results){
                                    var newOrder = [];
                                    async function Modify(){
                                        let Promises =  await (results[0].map(function(product){
                                            var qty = product.qty;
                                            var price = product.price;
                                            var stock = product.details._id;
                                            
                                                const purchase = new Purchase({
                                                    PurchaseItem: stock,
                                                    PurchaseQty: qty,
                                                    PurchasePrice: price,
                                                    
                                                });
                                               return purchase.save()
                                                .then(result => {
                                                            
                                                    newOrder.push(result._id);
                                                    Stock.findByIdAndUpdate(stock, {$inc : {'quantity' : -qty}}, {new: true})
                                                    .exec()
                                                    .then( Decrese => {})
                                                    .catch(err => {
                                                        console.log(err);
                                                    })
                                                    return newOrder;
                                                })
                                                .catch( err => {
                                                    console.log(err);
                                                });
                                        }));
                                        console.log(Promises);
                                        Promise.all(Promises).then( success => {
                                            // console.log(success[0]);
                                            success[0].map( addPurchase => {
                                                addnewUser.Purchase.push(addPurchase);
                                            })
                            
                                                addnewUser.save()
                                                .then( addPurchase =>{
                                                    console.log(addPurchase); 
                                                    delete req.session.cart;
                                                    res.render("ordercomplete");
                                                    
                                                })
                                            
                                            
                                            
                                           
                                        })
                                    }

                                    Modify();
                                    
                                });
                            }
                            
                
                            main(addnewUser);
                            User.findById(currentUser).exec().then( foundUser => {
                                foundUser.Order.push(addnewUser);
                                foundUser.save()
                                .then( UpdateUser => {})

                            });
                        });

           });
    
        }

    }


});

router.get("/want2wear/store-management", middleware .isLoggedIn, function(req,res,next){
    var user = req.user;
    if(!user.isAdmin){
        res.redirect('/index');
    }
    else{
        Category.find({})
        .populate('productID')
        .populate({
            path : 'productID',
            populate: [{
                        path: 'stock',
                        model: 'Stock',
                        populate: [{
                            path: 'size',
                            model: 'Size'
                        },{
                            path: 'colors',
                            model: 'Color'
                        }
                        ]
                    }
            ]
            }).exec().then( allProduct => {
                res.render("manage", {allProduct:allProduct});
            })
    }
    

});

router.get("/want2wear/store-management/edit/product/:id", middleware .isLoggedIn, function(req,res,next){
    var user = req.user;
    var id = req.params.id;
    if(!user.isAdmin){
        res.redirect('/index');
    }
    else{
        Product.findById(id)
        .populate('categories')
        .exec().then(product =>{
            console.log(product);
            res.render("editproduct" ,{product:product});
        })
        .catch(err => {
            console.log(err);
        })

    }

});

router.put("/want2wear/store-management/update/product/:id", middleware .isLoggedIn, function(req,res,next){

    var id = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    var status = req.body.continue;
    var img = req.body.image;

    if(img == ""){
        Product.findByIdAndUpdate(id,{ProductName: name,price: price,continue:status}).exec().then( updateProduct => {
            // console.log(updateProduct);
            res.redirect('/want2wear/store-management');
        })
        .catch(err =>{
            console.log(err);
        })
    
    }
    else{
        Product.findByIdAndUpdate(id,{ProductName: name,price: price,continue:status,image:img}).exec().then( updateProduct => {
            // console.log(updateProduct);
            res.redirect('/want2wear/store-management');
        })
        .catch(err =>{
            console.log(err);
        })
    }
    
});

router.get("/want2wear/store-management/edit/stock/:id", middleware .isLoggedIn, function(req,res,next){
    var user = req.user;
    var id = req.params.id;
    if(!user.isAdmin){
        res.redirect('/index');
    }
    else{
        
        Stock.findById(id)
        .populate('size colors productID')
        .exec()
        .then(stock =>{
            // console.log(stock);
            res.render("editstock",{stock:stock});
        })
        .catch(err=>{
            console.log(err);
        })
    }

});

router.put("/want2wear/store-management/update/stock/:id", middleware .isLoggedIn, function(req,res,next){
    var id = req.params.id;
    var qty = req.body.quantity;
    var available = req.body.available;

    if(qty == ""){
        Stock.findByIdAndUpdate(id,{available: available})
        .exec()
        .then( updateStock => {
            console.log(updateStock);
            res.redirect('/want2wear/store-management');
        })
        .catch(err =>{
            console.log(err);
        });
    }
    else{
        Stock.findByIdAndUpdate(id,{quantity: qty,available: available})
        .exec()
        .then( updateStock => {
            console.log(updateStock);
            res.redirect('/want2wear/store-management');
        })
        .catch(err =>{
            console.log(err);
        });
    }

});

router.put("/want2wear/update/details/:id" ,middleware.isLoggedIn, function(req,res,next){
    var id = req.params.id;
    var details = req.body.detailEdit;

    console.log(id);
    console.log(details);
    Product.findByIdAndUpdate(id,{details:details}).exec().then( product => {
        // console.log(product);
        res.redirect(req.get('referer'));

    })
    
});

router.get("/want2wear/add/review/:id", middleware.isLoggedIn, function(req,res,next){
    var username = req.query.user;
    var productID = req.params.id;
    var currentUser = req.user;
    if( username == currentUser.username){
        Product.findById(productID)
        .populate('categories')
        .exec()
        .then(product =>{
                // console.log(product);
                res.render("addreview" ,{product:product,user:username});
        })
        .catch(err => {
                console.log(err);
        })
    }
    else{
        res.redirect('/index');
    }
    
    
});

router.post("/want2wear/add/review/:id" , middleware.isLoggedIn, function(req,res,next){
    var productID =req.params.id;
    var user = req.query.user;
    var review = req.body.review;
    Product.findById(productID)
    .exec()
    .then( product => {
        // console.log(product);
        Review.create({username: user, reviewsDetail: review})
        .then( review =>{
            // console.log(review);
                product.review.push(review);
                product.save()
                .then( result => {
                    console.log(result);
                    res.redirect(req.get('referer'));
                })
            })
        })

});

router.get('/logout', function(req,res){
    req.session.cart = null;
    req.logout();
    req.flash('success', 'You log out successfully');
    res.redirect('/index');
    
    // console.log(req.session.cart);
    
});

module.exports = router;
