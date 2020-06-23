const   mongoose = require('mongoose'),
        // Product = require('./models/product'),
        // User = require('./models/user'),
        // Stock = require('./models/stock');
        Category = require('./models/category'),
        Color = require('./models/color'),
        Size = require('./models/size'),
        Order = require('./models/order');


const  product_category = [
    {
        categoryName: "Swimwear"
    },
    {
        categoryName: "Jacket"
    },
    {
        categoryName: "Shirt"
    },
    {
        categoryName: "Pants"
    },
    {
        categoryName: "Skirt"
    },
    
    {
        categoryName: "Bags"
    },
    {
        categoryName: "Jewelry"
    } 
]

const  product_color = [
    {
        colorName: "Black"
    },
    {
        colorName: "Beige"
    },
    {
        colorName: "White"
    },
    {
        colorName: "Blue"
    },
    {
        colorName: "Pink"
    },
    {
        colorName: "Red"
    },
    {
        colorName: "Brown"
    },
    {
        colorName: "Green"
    },
    {
        colorName: "Grey"
    } 
]

const  product_size = [
    {
        sizeName: "XL"
    },
    {
        sizeName: "L"
    },
    {
        sizeName: "M"
    },
    {
        sizeName: "S"
    },
    {
        sizeName: "XS"
    },
    {
        sizeName: "Freesize"
    }
]

const  product_order = [
    {
        shipmentType: "EMS"
    },
    {
        shipmentType: "Register"
    },
    {
        shipmentType: "Pickup"
    }
]

function seedDB(){

    
    Category.remove({}, function(err){
        if(err){
            console.log("Remove database  error");
        }
        console.log("Remove database Successfully");
        product_category.forEach(function(seed){
            Category.create(seed, function(err, product){
                if(err){
                    console.log('Add Product error');
                }
                else{
                    
                }
            });
        });
    });

    Color.remove({}, function(err){
        if(err){
            console.log("Remove color collection  error");
        }
        console.log("Remove color collection Successfully");
        product_color.forEach(function(seed){
            Color.create(seed, function(err, product){
                if(err){
                    console.log('Add Product error');
                }
                else{
                    
                }
            });
        });
    });
    Size.remove({}, function(err){
        if(err){
            console.log("Remove size collection  error");
        }
        console.log("Remove size collection Successfully");
        product_size.forEach(function(seed){
            Size.create(seed, function(err, product){
                if(err){
                    console.log('Add Product error');
                }
                else{
                    
                }
            });
        });
    });
}

module.exports = seedDB;

