var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pug = require('pug');
var expValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : false
}));

app.use(cookieParser());

// Set static Folder
app.use(express.static(path.join(__dirname,'public')));

//Express session
app.use(session({
    secret : 'secret',
    saveUninitialized : true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expValidator({
    errorFormatter: function (param,msg,value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Connect flash
app.use(flash());

//Global vars
app.use(function (err, req,res,next) {
    // set locals, only providing error in development
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.message = err.message;
    res.locals.user = req.user || null;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    next();

    // render the error page
    res.status(err.status || 500);
});

app.use('/',routes);
app.use('/users',users);

// Set port
app.set('port',(process.env.PORT || 8888));
app.listen(app.get('port'),function () {
    console.log('Server started on port '+app.get('port'));
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


