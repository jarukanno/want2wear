const   mongoose = require('mongoose');
        

let sizeSchema = new mongoose.Schema({

    sizeName: {type: String, required: true}

});
   


let Size = mongoose.model("Size", sizeSchema,);
module.exports = Size;
