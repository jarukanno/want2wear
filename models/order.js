const   mongoose = require('mongoose');
        

let orderSchema = new mongoose.Schema({

    
    User:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}] ,
    Purchase:[{type: mongoose.Schema.Types.ObjectId, ref: "Purchase"}] ,
    shipmentType: {type: String},
  
    createdAt: { type: Date, default: Date.now }
    

}, { usePushEach: true }, {timestamps: true});
   


let Order = mongoose.model("Order", orderSchema,);
module.exports = Order;
