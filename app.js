const   express = require("express");
        mongoose = require("mongoose");
        asyncHandler = require('express-async-handler');
        Promise = require('bluebird');
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
        methodOverride = require('method-override');
        session = require('express-session');
         MongoStore = require('connect-mongo')(session);
         User = require('./models/user'); 
        Product = require('./models/product');
        productRoute = require('./routes/product');
        userRoute = require('./routes/user');
        seedDB = require("./seeds");
        ObjectId = require('mongoose').Types.ObjectId;
        port = process.env.PORT || 3000;
        
mongoose.connect("mongodb+srv://adminnaja:CvSv301rKqVcdjLm@want2wear-vvxqn.mongodb.net/want2wear?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology: true},function(err, db) {
    
  if (err) throw err;
  else {console.log("Database created!");}

});
var db=mongoose.connection;

ObjectId.prototype.valueOf = function () {
    return this.toString();
    };

mongoose.set('useFindAndModify', false);
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.urlencoded({extended :true}));
app.set("view engine", "ejs");
// seedDB();
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 180 * 60 * 1000},
    unset: 'destroy'  
}));
app.use(flash());
app.use(passport.initialize());

app.use(passport.session());

app.use(methodOverride('_method'));

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.session = req.session;

    next();
});


passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/', userRoute);
app.use('/', productRoute);



app.listen(port,function (req,res){
	console.log("Server has started");
});
