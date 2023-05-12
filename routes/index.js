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

    function averageColumns(arr) {
        const result = [];

        // Проверяем, что входной массив не пустой
        if (arr.length === 0 || arr[0].length === 0) {
            return result;
        }

        // Проходимся по столбцам массива
        for (let j = 0; j < arr[0].length; j++) {
            let sum = 0;
            // Суммируем все элементы в столбце
            for (let i = 0; i < arr.length; i++) {
                sum += arr[i][j];
            }
            // Вычисляем среднее значение и добавляем его в результат
            result.push(sum / arr.length);
        }

        return result;
    }


    router.get('/profile',ensureAuthenticated, async (req,res)=>{
        const statistic = await Stats.find({user:req.user._id});
        const emotionsArrays = statistic.map((item) => item.emotions);
        console.log(emotionsArrays)
        const average = averageColumns(emotionsArrays)
        res.render('profile',{
            user:req.user,
            emotions:average
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
        console.log(newStats + ' Added to stats!')
        req.flash('success_msg', 'Successfully registered!')
        res.redirect('/');
    }).catch(err => console.log(err))
});


module.exports = router;