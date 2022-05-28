var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var app = express();

app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true
}));

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/youtube');

//passport
var passport = require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
    name: 'myname.sid',
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    cookie: {
        maxAge: 36000000,
        httpOnly: false,
        secure: false
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;



const express = require('express');
require('./db/conn');
const userRouter = require('./routes/user-router');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


const port = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(cors());

app.use(express.json());  // we are not using this method then data will not saved in db only id will be save
app.use(bodyParser.json());  // we are not using this method then data will not saved in db only id will be save

app.use('/userapi', userRouter);


app.listen(port, () => {
    console.log(`Server is listening the Port No: ${port}`);
})

// var arrays = [2000, 500, 200, 100, 50, 20, 10, 5, 1];
// const count = {};

// for (let i = 0; i < arrays.length; i++) {
//     count[num] = arrays[i];
//     count[num] = count[num] ? count[num] + 1 : 1;
// }
// console.log(count[num]);