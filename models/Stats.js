const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
    user:{
        required: true,
        type: String
    },
    text:{
        type: String,
    },
    emotions:{
        type: Array,
    },
    date: {
        type: Date   ,
        default: Date.now,
        timezone: 'Europe/Amsterdam'
    }
});

const Stats = mongoose.model('Stats', StatsSchema);

module.exports = Stats;