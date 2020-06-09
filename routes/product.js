const express = require('express'),
      router =  express.Router();
      
     
      
      Category = require('../models/category'),
      Stock = require('../models/stock'), 
      Color = require('../models/color'),
      Size = require('../models/size'),
      Product = require('../models/product'),
      middleware = require('../middleware');

router.get("/want2wear/new", function(req,res,next){
    res.render("add");

});

router.post("/want2wear/new", function(req,res,next){
    let n_name = req.body.name;
    let n_category = req.body.category;
    let n_image = req.body.image;
    let n_details = req.body.details;
    let n_size = req.body.size;
    let n_color = req.body.color;
    let n_quantity = req.body.quantity;
    let n_price = req.body.price;
    let n_product = {ProductName:n_name,image:n_image,details:n_details,price:n_price};            
    
    Product.findOne({ProductName: n_name}, function(err,found){
        if(err){
            console.log(err);
        }else{
            // console.log(found);
            if(found == null){

                Product.create(n_product , function(err,product){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //console.log(product);
                        Category.findOne({categoryName: n_category}, function(err,foundCategory){
                            if(err){
                                console.log(err);
                            }
                            else{
                                foundCategory.productID.push(product);
                                foundCategory.save((err,Savecate) =>{
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log(Savecate);
                                    }
                                });
                                Product.findOne({ProductName: n_name}, function(err,foundProduct){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        
                                        foundProduct.categories.push(foundCategory);
                                        foundProduct.save(function(err,data){
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                                
                                                console.log(data);
                                                Color.findOne({colorName: n_color}, function(err,foundColor){
                                                    if(err){
                                                        console.log(err);
                                                    }
                                                    else{
                                                        // console.log(foundColor);
                                                        Size.findOne({sizeName: n_size}, (err,foundSize) => {
                                                            if(err){
                                                                console.log(err);
                                
                                                            }
                                                            else{
                                                                 
                                                                // console.log(foundSize);
                                                                Stock.create({quantity: n_quantity} , function(err,CreateStock){
                                                                    if(err){
                                                                        console.log(err);
                                
                                                                    }
                                                                    else{
                                                                        // console.log(CreateStock);
                                                                        CreateStock.productID.push(data);
                                                                        CreateStock.colors.push(foundColor);
                                                                        CreateStock.size.push(foundSize);
                                                                        CreateStock.save(function(err,Addstock){
                                                                            if(err){
                                                                                console.log(err);
                                                                            }
                                                                            else{
                                                                                // console.log(stock);
                                                                                Product.findOne({ProductName: n_name}, function(err,pushProduct){
                                                                                        if(err){
                                                                                            console.log(err);
                                                                                        }else{
                                                                                            pushProduct.stock.push(Addstock);
                                                                                            pushProduct.save((err,addStock)=>{
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                }
                                                                                                else{
                                                                                                    console.log(addStock);
                                                                                                    res.redirect('/want2wear/new');
                                                                                                }
                                                                                            });
                                                                                        
                                                                                        }
                                                                                });

                                                                                
                                                                            }
                                                                        });                                                                       
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });                                                                               
                                            }
                                        });
                                    }       
                                });
                            }
                        });
                        Color.findOne({colorName: n_color}, function(err,foundColor){
                            if(err){
                                console.log(err);
                            }
                            else{
                               
                                Product.findOne({ ProductName : n_name}, (err,nullColor) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        //console.log(nullColor);
                                        nullColor.color.push(foundColor);
                                        nullColor.save((err,saveColor) =>{
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                                //console.log(saveColor);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                        Size.findOne({sizeName: n_size}, function(err,foundSize){
                            if(err){
                                console.log(err);
                            }
                            else{
                                
                                Product.findOne({ ProductName : n_name}, (err,nullSize) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        //console.log(nullSize);
                                        nullSize.size.push(foundSize);
                                        nullSize.save((err,saveSize) =>{
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                                //console.log(saveSize);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }                  
                });

                

                
            }
            else {
              
                Color.findOne({colorName: n_color}, function(err,foundColor){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //console.log(foundColor);
                        Product.findOne({ProductName : n_name , color : foundColor}, (err,nullColor) =>{
                            
                           // console.log(nullColor);
                            if(nullColor == null ){
                                //console.log(nullColor);
                                Product.findOne({ProductName: n_name}, (err,addProductColor) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        addProductColor.color.push(foundColor);
                                        addProductColor.save((err,saveColor) =>{
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                                //console.log(saveColor);
                                            }
                                        });
                                    }
                                });
                                
                            }
                           
                            else{
                                console.log("Color Already exist");
                                
                                
                            }
                        });
                    }
                });

                Size.findOne({sizeName: n_size}, function(err,foundSize){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //console.log(foundSize);
                        Product.findOne({ProductName : n_name , size : foundSize}, (err,nullSize) =>{
                            
                            
                            if(nullSize == null ){
                               // console.log(nullSize);
                                Product.findOne({ProductName: n_name}, (err,addProductSize) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        addProductSize.size.push(foundSize);
                                        addProductSize.save((err,saveSize) =>{
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                               // console.log(saveSize);
                                            }
                                        });
                                    }
                                });
                            }
                           
                            else{
                                console.log("Size Already Exist");
                                
                                
                            }
                        });
                    }
                });

                Color.findOne({colorName: n_color}, function(err,foundColor){
                    if(err){
                        console.log(err);
                    }
                    else{
                        // console.log(foundColor);
                        Size.findOne({sizeName: n_size}, (err,foundSize) => {
                            if(err){
                                console.log(err);

                            }
                            else{
                                 
                                // console.log(foundSize);
                                Stock.create({quantity: n_quantity} , function(err,CreateStock){
                                    if(err){
                                        console.log(err);

                                    }
                                    else{
                                        Stock.findOne({productID : found, colors : foundColor , size: foundSize}, (err,nullStock) =>{
                                            
                                            if(nullStock == null){
                                                CreateStock.productID.push(found);
                                                CreateStock.colors.push(foundColor);
                                                CreateStock.size.push(foundSize);
                                                CreateStock.save(function(err,Addstock){
                                                    if(err){
                                                        console.log(err);
                                                    }
                                                    else{
                                                        // console.log(stock);
                                                        Product.findOne({ProductName: n_name}, function(err,pushProduct){
                                                                if(err){
                                                                    console.log(err);
                                                                }else{
                                                                    pushProduct.stock.push(Addstock);
                                                                    pushProduct.save((err,addStock)=>{
                                                                        if(err){
                                                                            console.log(err);
                                                                        }
                                                                        else{
                                                                            console.log(addStock);
                                                                            res.redirect('/want2wear/new');
                                                                        }
                                                                    });
                                                                
                                                                }
                                                        });

                                                        
                                                    }
                                                 });                          
                                                }
                                            else{
                                                console.log("Already has in Stock");
                                            }
                                        });
                                        
                                                                                     
                                    }
                                });
                            }
                        });
                    }
                });                                                         
            }
        }
    });  
});


router.get("/want2wear/swimwear",function(req,res,next){

    Category.findOne({categoryName: "Swimwear"}).populate('productID').exec(function (err, allProduct) {
            if (err) {
                return handleError(err);
            }
            else{
                //console.log(allProduct);
                res.render("swimwear", {Product:allProduct});
            }
    
    
         });

});

router.get("/want2wear/:id", function(req,res,next){

   Product.findById(req.params.id)
    .populate('size color stock')
    // .populate({
    //     path: 'stock', 
    //     populate: [{
    //         path: 'size',
    //         model: 'Size'
    //     },{
    //         path: 'colors',
    //         model: 'Color'
    //     }
    // ]
    // })
    .exec(function (err,show){
//    .deepPopulate('stock.size')
       if(err){
           console.log(err);
       }else{
           console.log(show);
         res.render("showdetails", {Product:show});
       }
   });

    // Product.findById(req.params.id).populate('size').exec(function (err,show){
    //     if(error){
    //         console.log("Error to Show items");
    //     }
    //     else{
    //         res.render("showdetails", {Product:show});
    //     }
    // });
 

});

module.exports = router;
