const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    games: [{
        first: { type: Number, default: 0 },
        second: { type: Number, default: 0 },
        win: { type: Number, default: 0 }
    }],
    successRate: { type: Number },
    salt: {type:String, required: true},
});

const Users = mongoose.model('DiceGameUser', userSchema);

module.exports = Users;
