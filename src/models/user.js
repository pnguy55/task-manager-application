const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
     },
     password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the phrase "password".')
            }
        }
     },
     avatar: {
        type: Buffer
     },
     tokens: [{
         token: {
             type: String,
             required: true
         }
     }]
}, {
    // include this timestamp property as a seperate arguement from the main object argument above
    timestamps: true
})

// set up relationship to tasks without making a big array to store all tasks, and allows you to use 
// the populate function as if you had an object on user that referred to tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


// HIDE PRIVATE USER DATA HERE HIDE PRIVATE USER DATA HERE HIDE PRIVATE USER DATA HERE
// Not an arrow function because we are using this, this specific toJSON function needs to
// match up, it'll perform this function every time user is returned and delete what we want from the object
// while no having to ever call this function explicitely
userSchema.methods.toJSON = function () {
    const user = this
    // strips away mongoose stuff and gives us back raw object data
    const userObject = user.toObject()

    // No need for client to see this info
    delete userObject.password
    delete userObject.tokens

    return userObject
}

// function to make a auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    // this saves the signed web token, and also converts the user id to a string as that's what
    // jwt is expecting
    const token = jwt.sign({ _id: user.id.toString()}, process.env.JWT_SECRET, { expiresIn: '2 days' })
    // push token to special token array above and save to DB
    user.tokens.push({ token })
    await user.save()

    return token
}

// Make static function accessible by the router to search the database for a user
userSchema.statics.findByCredentials = async (email, password) => {
    //searches for user by the email
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to log in')
    }

    // Checks the password for a match
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to log in')
    }

    return user
}


// Pre does something before saving to the database, post does it after
// Important to not use arrow function because it needs to be bound by this
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Middleware to delete user tasks when user is removed with only the owner field, remember to load in Task model
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User