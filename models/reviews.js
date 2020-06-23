const   mongoose = require('mongoose');
        

let reviewSchema = new mongoose.Schema({

    reviewsDetail: {type: String},
    username:{type: String} 

    

}, { usePushEach: true });
   


let Review = mongoose.model("Review", reviewSchema,);
module.exports = Review;
