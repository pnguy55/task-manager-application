const express = require('express')
const jwt = require('jsonwebtoken')
require('./db/mongoose')

// Routes
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// typically this import is at the top, just put here for ease of example
const multer = require('multer')
const upload = multer({
    // short for destination
    dest: 'images'
})
//multer utilizes middleware to upload a file with the key of upload
app.post('/upload', upload.single('upload'), (req,res) => {
    res.send()
})


// app.use((req, res, next) => {
//     // Prints HTTP method used, and path gets the path
//     console.log(req.method, req.path)

//     // Only runs on a Get request
//     if (req.method === 'GET') {
//         // Disables get requests
//         res.send('Get Requests are disabled')
//     } else {
//         next()
//     }
// })

// Another middleware example
// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })
//auto parse JSON


app.use(express.json())

// Must register the router for use
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

const test_relationships_between_task_and_user = async () => {
    // find task by its id
    const task = await Task.findById('5db74122550a6323d4327b67')
    // wait for the database to respond then populate the task owner object with properties from owner
    // which is really just the user object that the owner which upon creation mongoose automatically
    // gives it a relationship to a specific owner already
    await task.populate('owner')
    console.log(task.owner)

    // an example doing the opposite of the above section
    const user = await User.findById('5db740f7550a6323d4327b64')
    // utilizes the virtual function from userSchema to find the user's tasks
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

// test_relationships_between_task_and_user()