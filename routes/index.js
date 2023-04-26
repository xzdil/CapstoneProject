const express   = require('express');
const router    = express.Router();

router.get('/',  (req,res)=>{
    res.render('main',{

    })
    console.log('main');
})
router.get('/profile',  (req,res)=>{
    res.render('profile',{

    })
    console.log('profile');
})

module.exports = router;