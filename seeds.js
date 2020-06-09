const   mongoose = require('mongoose'),
        // Product = require('./models/product'),
        // User = require('./models/user'),
        // Stock = require('./models/stock');
        Category = require('./models/category'),
        Color = require('./models/color'),
        Size = require('./models/size');


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
        categoryName: "Shoes"
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
    // Color.remove({}, function(err){
    //     if(err){
    //         console.log("Remove color collection  error");
    //     }
    //     console.log("Remove color collection Successfully");
    //     product_color.forEach(function(seed){
    //         Color.create(seed, function(err, product){
    //             if(err){
    //                 console.log('Add Product error');
    //             }
    //             else{
                    
    //             }
    //         });
    //     });
    // });
    // Size.remove({}, function(err){
    //     if(err){
    //         console.log("Remove size collection  error");
    //     }
    //     console.log("Remove size collection Successfully");
    //     product_size.forEach(function(seed){
    //         Size.create(seed, function(err, product){
    //             if(err){
    //                 console.log('Add Product error');
    //             }
    //             else{
                    
    //             }
    //         });
    //     });
    // });
}

module.exports = seedDB;

// Product.create({
//     ProductName: 'Bikini',
//     image: "https://i0.codibook.net/files/1976121817423/32ce2ef804c51926/2035020589.jpg",
//     details: "Beautiful",
//     price: "30"
// });

// Category.create({
//     categoryName: "swimwear"
// }, function(err,category){
//     if(err){
//         console.log(err);
//     }
//     else{
//         Product.findOne({ProductName: 'Bikini'}, function(err,foundProduct){
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 foundProduct.categories.push(category);
//                 foundProduct.save(function(err,data){
//                     if(err){
//                         console.log(err);
//                     }
//                     else{
//                         console.log(data);
//                     }
//                 });
//             }
//         });
//     }


// });