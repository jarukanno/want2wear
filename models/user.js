const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');


let UserSchema = new mongoose.Schema({

    username : {type: String, required: true},
    password: String,
    isAdmin: {type: Boolean, default: false},
    Order : [{type: mongoose.Schema.Types.ObjectId, ref: "Order"}] 
    
});

UserSchema.plugin(passportLocalMongoose);
let User = mongoose.model("User", UserSchema);
module.exports = User;
