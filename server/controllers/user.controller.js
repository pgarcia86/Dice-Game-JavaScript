const Users= require('../models/user.model')
const {Auth, isAuthenticated} = require('./auth.controller')

const User = {
    playGame: async (req, res) => {
        const userData = req.body
        try{
            const user = await Users.findOne({email: userData.email})
            if(!user){
                res.status(404).send('Usuario no encontrado')
            } else {
                let win = false
                const num1 = Math.floor(Math.random() * 6) + 1
                const num2 = Math.floor(Math.random() * 6) + 1
                if((num1 + num2) == 7){
                    win = true
                }      
                const data = {
                    first: num1,
                    second: num2,
                    win: win
                }
                user.games.push(data)
                const qttyWins = user.games.filter(game => game.win).length
                user.successRate = Number(((qttyWins / user.games.length)*100).toFixed(2))
                await user.save()
                res.status(200).send(user)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    getPlayer: async (req, res) => {
        const userId = req.params.userId
        try{
            const user = await Users.findOne({_id: userId})
            if(!user){
                res.status(404).send('Usuario no encontrado')
            } else {
                res.status(200).send(user)
            }
        } catch (error){
            res.status(500).send(error.message)
        }
    },
    getAllPlayersStats: async (req, res) => {
        try{
            const usersList = await Users.find()
            if(!usersList){
                res.status(404).send('Usuarios no encontrados')
            } else {
                res.status(200).send(usersList)
            }
        } catch(error){
            res.status(500).send(error.message)
        }
    }
}

module.exports = User