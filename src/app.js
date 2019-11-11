// the following is copy of index.js minus the examples and the app.listen and port
// FOR TESTING PURPOSES

const express = require('express')
require('./db/mongoose')

// Routes
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()



app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

module.exports = app