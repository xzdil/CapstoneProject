    const express   = require('express');
    const router    = express.Router();
    const {ensureAuthenticated} = require("../config/auth");
    const Stats = require("../models/Stats")
router.get('/', ensureAuthenticated, (req,res)=>{
    res.render('main',{
        user:req.user
    })
    console.log('main');
});
router.get('/profile',ensureAuthenticated,  (req,res)=>{
    res.render('profile',{
        user:req.user
    })
    console.log('profile');
});
router.get('/stats',ensureAuthenticated,  (req,res)=>{
    const stats = Stats.find({user:req.user._id})
    res.render('stats',{
        user:req.user,
        stats:stats
    })
    console.log('stats');
});
router.post('/stats',ensureAuthenticated,  (req,res)=>{
    const user = req.user._id
    const {text,emotions} = req.body;
    const newStats = new Stats({
        user,text,emotions
    });
    newStats.save().then(stats => {
        req.flash('success_msg', 'Successfully registered!')
        res.redirect('/stats');
    }).catch(err => console.log(err))
});


module.exports = router;