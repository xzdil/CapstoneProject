const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const tf = require('@tensorflow/tfjs')
const session = require("cookie-session");
const path = require("path");
const cors = require('cors');

app.use(session({
    secret: 'adil',
    resave: true,
    saveUninitialized: false,
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());

app.use('/main', require('./routes/index'));

app.get('/',async (req,res)=>{
    res.render('index',{
    })
})


app.listen(5000)
console.log('Listening on port ' + 5000)