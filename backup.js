app.get("/index", function(req,res){
    res.render("landing");

});

app.get("/hidden", function(req,res){
    res.render("hidden");

});

app.get("/login-register", function(req,res){
    const errors = req.flash.error || [];
    res.render("login-register", {errors});

});


app.post("/register", (req,res,next) => {
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

app.post("/login", passport.authenticate('local', { 
    failureRedirect: '/login-register', 
    successRedirect: '/index',
    failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
        return next(err);
        }
        res.redirect('/index');
    });
});

app.get("/logout", function(req,res){
    res.render("/");

});


app.get("/want2wear/new", function(req,res){
    res.render("add");

});

app.post("/want2wear/new", function(req,res){
    let n_name = req.body.name;
    let n_category = req.body.category;
    let n_image = req.body.image;
    let n_details = req.body.details;
    let n_size = req.body.size;
    let n_price = req.body.price;
    let n_color = req.body.color;
    let n_quantity = req.body.quantity;
    let n_likes = "0";
    let n_product = {ProductName:n_name,image:n_image,category:n_category,details:n_details,quantity:n_quantity,
                    color:n_color,size:n_size,price:n_price,likes:n_likes};    
    
     db.collection('products').insertOne(n_product, function(error, collection){
         if(error){
             console.log("Error");
         }else{
             console.log("Added Successfully");
             res.redirect("/index");
         }
     })
  
    
})


app.get("/want2wear/swimwear", function(req,res){

    Product.find({category : "swimwear"}, function(error, allProduct){
        if(error){
            console.log("Error");
        }else{
            res.render("swimwear", {Product:allProduct}); //allproduct คือตัวที่ส่งไป ตัวที่อยู่ใน db
        }
    })

});

app.get("/want2wear/:id", function(req,res){
    Product.findById(req.params.id, function(error,show){
        if(error){
            console.log("Error to Show items");
        }
        else{
            res.render("showdetails", {product:show});
        }
    })
 

});
