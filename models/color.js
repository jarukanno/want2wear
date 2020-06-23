const   mongoose = require('mongoose');
        

let colorSchema = new mongoose.Schema({

    colorName: {type: String, required: true}

}, { usePushEach: true });
   


let Color = mongoose.model("Color", colorSchema,);
module.exports = Color;
