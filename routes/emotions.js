const express   = require('express');
const router    = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const Stats = require("../models/Stats")


router.get('/edit',ensureAuthenticated, async (req,res)=>
{
    const day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    let today = await Stats.findOne({user:req.user._id, date:{
            $gte: day,
            $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1)
        }})
    if (!today){
        today = {text:"There is no easter egg!"}
    }
    console.log(day)
    res.render('editStats',{
        user:req.user,
        today:today
    })
})


module.exports = router;