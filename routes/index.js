    const express   = require('express');
    const router    = express.Router();
    const {ensureAuthenticated} = require("../config/auth");
    const Stats = require("../models/Stats")

    function argMax(array) {
        return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }

router.get('/', ensureAuthenticated, async (req,res)=>{


    const last = await Stats.find({user:req.user._id}).sort({date:-1}).limit(3)
    if(last.length > 2){
        const first = argMax(last[0].emotions)
        const second = argMax(last[1].emotions)
        const third = argMax(last[2].emotions)
        res.render('main',{
            user:req.user,
            last:last,
            array:[first,second,third],
            classes:["Sadness", "Joy", "Love", "Anger", "Fear", "Surprise"]
        })
    } else {
        res.render('main',{
            user:req.user,
            last:0,
            array:[[0],[0],[0]],
            classes:["Sadness", "Joy", "Love", "Anger", "Fear", "Surprise"]
        })
    }

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
        const statistic = await Stats.find({user:req.user._id,date:
                {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
        })
        const emotionsArrays = statistic.map((item) => item.emotions);
        console.log(emotionsArrays)
        const average = averageColumns(emotionsArrays)
        res.render('profile',{
            user:req.user,
            emotions:average
         })
        console.log('profile');
});
router.get('/stats',ensureAuthenticated, async (req,res)=>{

    const stats = await Stats.find({user:req.user._id})
    const year = await Stats.find({user:req.user._id, date:
            {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear()+1, new Date().getMonth(), 1)
            }
            },{_id:0,emotions:1})
    let yearDate = await Stats.find({user:req.user._id, date:
            {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear()+1, new Date().getMonth(), 1)
            }
            },{_id:0,date:1})
    const month = await Stats.find({user:req.user._id, date:
    {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    }},{_id:0,emotions:1})
    let monthDate = await Stats.find({user:req.user._id, date:
            {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }},{_id:0,date:1})
    let week = await Stats.find({user:req.user._id, date:
            {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-6),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1)
            }},{_id:0,emotions:1}).sort({date:-1})
    let weekDate = await Stats.find({user:req.user._id, date:
            {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-6),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1)
            }},{_id:0,date:1}).sort({date:-1})
    weekDate = weekDate.map((item) => item.date.getDate());
    yearDate = yearDate.map((item) => item.date.getDate());
    monthDate = monthDate.map((item) => item.date.getDate());
    console.log(week)

    res.render('stats',{
        user:req.user,
        stats:stats,
        year:year,
        yearDate:yearDate,
        month:month,
        monthDate:monthDate,
        week:week.reverse(),
        weekDate:weekDate.reverse()
    })
    console.log('stats');
});
router.post('/stats',ensureAuthenticated, async (req,res)=>{
    const user = req.user._id
    const {text,emotions} = req.body;
    const day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const isPresent = await Stats.find({user:req.user._id, date:{
            $gte: day,
            $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1)
        }})
    if (isPresent.length===0){
        if (text!=="") {
            const newStats = new Stats({
                user, text, emotions
            });
            newStats.save().then(stats => {
                console.log(newStats + ' Added to stats!')
                req.flash('success_msg', 'Successfully registered!')
                res.redirect('/emotions/edit');
            }).catch(err => console.log(err))
        } else {
            res.redirect('/');
            console.log('Empty')
        }
    } else {
        res.redirect('/emotions/edit')
        console.log("Already submited today!")
    }
});


module.exports = router;