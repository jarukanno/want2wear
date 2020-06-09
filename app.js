const   express = require("express");
        mongoose = require("mongoose");
        deepPopulate = require('mongoose-deep-populate')(mongoose);
        bodyParser = require("body-parser");
        path = require('path'); 
        app = express();
        flash = require('connect-flash');
        passport = require('passport');
        cookieParser = require('cookie-parser');
        passportLocal = require('passport-local');
        LocalStrategy = require('passport-local').Strategy;
        passportLocalMongoose = require('passport-local-mongoose');
        // User = require('./models/user'); //เอา db ที่เก็บ user มาใช้
        // Product = require('./models/product');
        productRoute = require('./routes/product');
        indexRoute = require('./routes/index');
        seedDB = require("./seeds");
        
        

mongoose.connect("mongodb://localhost:27017/wanttowear", {useNewUrlParser: true,useUnifiedTopology: true},function(err, db) {
  if (err) throw err;
  else {console.log("Database created!");}

});
var db=mongoose.connection;


app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); //เชื่อมกับ css/js
app.use(bodyParser.urlencoded({extended :true}));
app.set("view engine", "ejs");
//seedDB();

app.use(require('express-session')({
    secret: 'Want2Wear',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');

    next();
});


passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', indexRoute);
app.use('/', productRoute);


app.listen(3000,function (req,res){
	console.log("Server has started");
});