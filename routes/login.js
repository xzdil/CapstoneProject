const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const {forwardAuthenticated} = require('../config/auth')

const User = require("../models/User");

router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('log',{

    })
})

router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('reg',{

    })
})

router.get('/logout', function (req, res){
    req.logout();
    res.redirect('/login/login')

})

router.post('/login', passport.authenticate('local', {
        successRedirect: '/main',
        failureRedirect: '/login/login',
        failureFlash: true
    }
));

router.post('/register',(req,res)=>{
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg:'Fill the fields'});
    }

    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }

    if(password.length < 6){
        errors.push({msg:'Password should be more than 6 characters'});
    }

    function CheckPassword(input)
    {
        let pass =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        return !!input.match(pass);
    }

    if(CheckPassword(password) === false){
        errors.push({msg:'Password should contain at least one uppercase and lowercase letter, special symbol and number'})
    }

    if(errors.length>0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
        console.log(errors);
    } else{
        User.findOne({$or: [{name : name},{email:email}]})
            .then(user => {
                if(user){
                    errors.push({msg:'Username/Email is taken'});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });

                } else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt)=>
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err;

                            newUser.password = hash;

                            newUser.save()
                                .then(user =>{
                                    res.redirect('/login/login');
                                })
                                .catch(err=> console.log(err))
                        }))
                }
            });
    }
})

module.exports = router;