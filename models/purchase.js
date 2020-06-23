const   mongoose = require('mongoose');
        

let PurchaseSchema = new mongoose.Schema({

    
    
    PurchaseItem:[{type: mongoose.Schema.Types.ObjectId, ref: "Stock" , required:true}] ,
    PurchaseQty:{type:Number, required: true},
    PurchasePrice:{type:Number, required: true}
    
    

}, { usePushEach: true },{timestamps: true});
   


let Purchase = mongoose.model("Purchase", PurchaseSchema,);
module.exports = Purchase;