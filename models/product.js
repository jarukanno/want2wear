const   mongoose = require('mongoose'),
        Category = require('../models/category');
var db=mongoose.connection;


let Productschema = new mongoose.Schema({

    ProductName: {type: String, required: true},
    categories:[{type: mongoose.Schema.Types.ObjectId, ref: "Category"}] ,
    image: {type: String, required: true},
    details: {type: String},
    price: {type: Number, required: true},
    review:[{type: mongoose.Schema.Types.ObjectId, ref: "Review"}],
    stock:[{type: mongoose.Schema.Types.ObjectId, ref: "Stock"}],
    continue :{type: Boolean, default: true},

    
}, { usePushEach: true });

Productschema.plugin(deepPopulate);
let Product = mongoose.model("Product", Productschema);
module.exports = Product;