const express = require('express')
const bcrypt = require('bcrypt')
const {expressjwt : expjwt} = require ('express-jwt')
const jwt = require ('jsonwebtoken')
const Users = require('../models/user.model')

const validateJwt = expjwt({secret: process.env.SECRETSTRING, algorithms: ['HS256']})
const signToken = _id => jwt.sign({_id}, process.env.SECRETSTRING)

const findAndAssignUser = async (req, res, next) => {
    try{
        const user = await Users.findById(req.auth._id)
        if(!user){
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser)

const Auth = {
    //Devuelvo el token y el usuario, para poder usarlos en otras partes
    login: async (req, res) => {
        const {body} = req
        try{
            const user = await Users.findOne({email: body.email})
            if(!user){
                res.status(401).send('El usuario o contraseña no son válidos')
            } else {
                const passwordMatch = await bcrypt.compare(body.password, user.password)
                if(passwordMatch){
                    const signed = signToken(user._id)
                    res.status(200).json({signed, user: user})
                } else {
                    res.status(401).send('El usuario o la contraseña no son válidos')
                }
            }

        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    register: async (req, res) => {
        const {body} = req
        try{
            const isUser = await Users.findOne({email: body.email})
            if(isUser){
                res.status(409).send('El usuario ya existe, no se puede dar de alta')
            } else{
                console.log('Creo usuario nuevo');
                const salt = await bcrypt.genSalt()
                const hashed = await bcrypt.hash(body.password, salt)
                const user = await Users.create({email: body.email, password: hashed, games: [], successRate: 0, salt})
                const signed = signToken(user._id)
                res.send(signed)
            }
        } catch (error) {
                res.status(500).send(error.message)
        }
    },
}

module.exports = {Auth, isAuthenticated}