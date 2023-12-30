const Users= require('../models/user.model')
const {Auth, isAuthenticated} = require('./auth.controller')

const User = {
    playGame: async (req, res) => {
        const {body} = req
        try{
            const user = await Users.findOne({email: body.email})
            if(!user){
                console.log("ESTA ACA user.controller LINEA 10");
                res.status(404).send('Usuario no encontrado')
            } else {
                const newGame = {
                    first: req.first,
                    second: req.second,
                    win: req.win
                }
                user.games.push(newGame)
                await user.save()
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}

module.exports = User