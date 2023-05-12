const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const tf = require('@tensorflow/tfjs')
const session = require("cookie-session");
const path = require("path");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const passport = require('passport');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;

const Chart = require("chart.js/auto")

const flash = require('connect-flash');

const User = require("./models/User");

const {ensureAuthenticated} = require("./config/auth");
require('./config/passport')(passport);

mongoose.connect(db).then(()=>console.log('mongodb connected')).catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'adil',
    resave: true,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session(), (req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());

app.use(flash(), (req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.success = req.flash('error');
    next();
});

app.use('/main', require('./routes/index'));
app.use('/login', require('./routes/login'));

app.get('/',ensureAuthenticated,async (req,res)=>{
    res.render('index',{
        user:req.user
    })
})


app.listen(5000)
console.log('Listening on port ' + 5000)