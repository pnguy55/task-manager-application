// just convention to be named request
const request = require('supertest')
const app = require('../src/app')
// import this to use the database functions that affect User
const User = require('../src/models/user')
// import jwt and mongoose for auth tests
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userTestId = new mongoose.Types.ObjectId()
const userTest = {
    _id: userTestId,
    name: 'Mike',
    email: 'mike@example.com',
    age: 8,
    password: '56what!!!!',
    tokens: [{
        token: jwt.sign({ _id: userTestId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    // makes sure you have a fresh db every time
    await User.deleteMany()
    await new User(userTest).save()
})

// afterEach(() => {
//     console.log('afterEach')
// })

test('Should signup a new user', async () => {
    // this will send a body and test the sign up function
    // MAKE SURE ROUTES MATCH
    await request(app).post('/users/create-user').send({
        name: 'Andrew',
        email: 'codephony2@gmail.com',
        age: 27,
        password: 'MyYouu777!'
    }).expect(201)
});

test('Should log-in existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'mike@example.com',
        password: '56what!!!!'
    }).expect(200)
})

test('Should NOT log-in nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'mike0@example.com',
        password: '56what!!!!'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should NOT get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/delete-user')
        .set('Authorization', `Bearer ${userTest.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should NOT delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/delete-user')
        .send()
        .expect(401)
})