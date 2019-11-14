// the following is copy of index.js minus the examples and the app.listen and port
// and we split it up for testing purposes, the test doesnt go all the way into index

const express = require('express')
require('./db/mongoose')

// Routes
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// dependencies
const path = require('path')
const app = express()



app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})
app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/log-in.html'))
})
app.get('/profile', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'))
})

app.use(express.static('public'));

app.use(userRouter)
app.use(taskRouter)



module.exports = app