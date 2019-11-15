const express = require('express')
// Data model (ORM)
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const { sendWelcomeEmail, cancelAccountEmail } = require('../emails/account')

// middleware for multer properties
const avatar_upload = multer({
    // short for destination
    // remove dest to pass data through to the POST function
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // // error msg
        // cb(new Error('File must be a PDF'))
        // // accept
        // cb(undefined, true)
        // // silently reject
        // cb(undefined, false)
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)){
            return cb(new Error('Please upload a JPG, JPEG, or a PNG file'))
        }
        cb(undefined, true)
    }    
})


const router = new express.Router()


router.post('/users/create-user', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) { 
        res.status(400).send(e)
    }
})

// The log-in endpoint
router.post('/users/login', async (req, res) => {
    try {
        // runs functions that get user info and token info from the server
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // if an error isn't thrown by the findByCredentials static function it will run next
        // sends user info and token to the client from the server
        
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try{
        req.user.tokens = []

        req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// authenticated avatar upload
// html img tag that will use the image binary data
// <img src='data:iamge/jpg;base64,[insert image binary data]'/>
router.post('/users/me/avatar', auth, avatar_upload.single('avatar'), async (req, res) => {
        // change all images to png filetype
        // to make a image crop gui, do it on client side
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    
        req.user.avatar = buffer
        // remember to add async/await to wait for the file buffer to work
        await req.user.save()
        res.send()
}, (error, req, res, next) => {
    // this is how to display the error thrown by the multer middleware instead of the cryptic HTML
    res.status(400).send({ error: error.message})
})

router.get('/users/me', auth, async (req, res) => {
    // Return logged in user's info
    res.status(200).send(req.user)
})

// find user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById({ _id })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
    // Promise version

    // User.findById({_id}).then((user) => {
    //     if (!user) {
    //         // in the case that the find goes through but no user exists
    //         return res.status(404).send()
    //     }
    //     // automatically has status code of 200
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send()
    // }) 
})

router.patch('/users/update-profile', auth, async (req, res) => {
    
    // Need to to extract keys from the request body
    const updates = Object.keys(req.body)
    // Give user an error message if trying to update a nonexistent field
    const allowedUpdates = ['name', 'email','password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!'})
    }

    try {
        // saves the user from auth as a variable to easy use
        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        res.status(201).send(user)
    } catch (e) {
        res.status(400).send()
    }
})


// the colon followed by a variable is how you access url params with express
// router.get('/users/:name', (req, res) => {
//     // save that param like this
//     const name = req.params.name.replace(/^\w/, c => c.toUpperCase())

//     User.findOne({name: name}).then((user) => {
//         res.status(200).send(user)
//     }).catch((e) => {
//         // change status code to 500 for internal server error and no need to send back error msg
//         res.status(500).send()
//     }) 
// })

router.delete('/users/delete-user', auth, async (req,res) => {
    try {
        // because our auth middleware returns the user object, we have access to req.user
        // and because our auth checks for a user we no longer need to access that in the endpoint
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }

        // so instead of the above we just straight up remove the user document with mongoose
        cancelAccountEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)

        res.send()
    } catch (e) {
        return res.status(500).send()
    }
})

router.delete('/users/me/delete-avatar', auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.send()
})

// data getters
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        // Tells the client what to expect from the response it receives
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router