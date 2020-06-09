const   mongoose = require('mongoose'),
        Category = require('../models/category');
var db=mongoose.connection;


let Productschema = new mongoose.Schema({

    ProductName: {type: String, required: true},
    categories:[{type: mongoose.Schema.Types.ObjectId, ref: "Category"}] ,
    size:[{type: mongoose.Schema.Types.ObjectId, ref: "Size"}] ,
    color:[{type: mongoose.Schema.Types.ObjectId, ref: "Color"}] ,
    image: {type: String, required: true},
    details: {type: String},
    price: {type: Number, required: true},
    likes: {type: Number, required: true, default: "0"},
    stock:[{type: mongoose.Schema.Types.ObjectId, ref: "Stock"}] 
    
});

Productschema.plugin(deepPopulate);
let Product = mongoose.model("Product", Productschema);
module.exports = Product;