const mongoose = require('mongoose')

const Users = mongoose.model('DiceGameUser', {
    email: {type: String, required: true},
    password: {type: String, required: true},
    games: {
        first: {type: Number},
        second: {type: Number},
        win: {type: Number}
    },
    successRate: {type: Number},
    salt: {type: String, required: true},
})

module.exports = Users

