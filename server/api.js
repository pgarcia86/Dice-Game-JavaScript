const mongoose = require('mongoose')
const express = require('express')
//Para que las variables de entorno funcionen, tengo que hacer esto antes de que se intenten usar las variables de entorno en cualquier parte del codigo
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')
const user = require('./controllers/user.controller')

const port = 3000
const {Auth, isAuthenticated} = require('./controllers/auth.controller')

const app = express()

app.use(express.json())
mongoose.connect('mongodb+srv://pgarciabarros86:PGB44pgb@cluster0.f61odbv.mongodb.net/miapp?retryWrites=true&w=majority')
app.use(express.static('../client'))

app.get('/', (req, res) => {
    res.sendFile(`${path.resolve()}/index.html`)
})
app.post('/login', Auth.login)
app.post('/register', Auth.register)
app.post('/play', user.playGame)

app.get('*', (req, res) =>{
    res.status(404).send('Esta pagina no existe')
})

app.listen(port, () => {
    console.log('Iniciando la aplicacion');
})
