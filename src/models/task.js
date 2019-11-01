const mongoose = require('mongoose')
const validator = require('validator')

// CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL
// CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL
// CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL CREATING A TASK OBJECT MODEL

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, 
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        // Special object id type from mongoose
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // this create a relationship to whichever model you named as 'User' with
        // this line
        // const User = mongoose.model('User', userSchema)
        ref: 'User'
    }
}, {
    // include this timestamp property as a seperate arguement from the main object argument above
    timestamps: true
})

const Task  = mongoose.model('Task', taskSchema)
module.exports = Task