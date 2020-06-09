const   mongoose = require('mongoose');


let stockSchema = new mongoose.Schema({

    productID : [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    size: [{type: mongoose.Schema.Types.ObjectId, ref: "Size"}],
    colors: [{type: mongoose.Schema.Types.ObjectId, ref: "Color"}],
    quantity: {type: Number, required: true}
   
});

stockSchema.plugin(deepPopulate);
let Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
