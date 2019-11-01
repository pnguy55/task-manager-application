#How to Start

**********************************************
API KEYS
--------------
SENDGRID
JWT Secret Key
DB URL

DON'T PUSH TO GIT WITHOUT IGNORING CONFIG FOLDER AND NODE_MODULE FOLDER
--------------
**********************************************

download mongoDB server

download mongoDB driver
download mongoDB npm module
download mongoose npm module
make mongoose.js
<!-- const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}) -->

download/start robo3T GUI
download/start postman

make mongodb-data folder near mongodb folder in user directory

start database
open terminal
/Users/PhiNguyen/mongodb/bin/mongod.exe --dbpath=/Users/PhiNguyen/mongodb-data      

start hotreload
open new terminal
npm run dev


basics of full stack web app
1) set up a DB to test on
2) set up a postman to test endpoints
3) make data models with mongoose and using a schema to perform operations before and after saving data to DB, export the data models into index for use
4) Import data models into routers and create router using express, import them all into index, then edit endpoints on the routers (mongoose, express, validator)
5) remember to check out package.json for dev scripts
5) Create login with the following: simply put - (jsonwebtoken, bcrypt)
    [sign-in/find account by email, compare password hash, generate+sign web token, save to user object, create authentication file, add auth middleware to routes ]
    a) Make sure emails are unique
    b) Use schema static function to provide router with a lookup function that searches DB for the account, also runs the password through a compare function that returns the user's information
    c) run that static function in the router and make it send back the user info 
    d) download and implement jsonwebtoken npm module by creating and saving tokens to the user model
       upon sign-up and log-in
    e) create authentication middleware, auth.js, and import into user.js
    f) that middleware will authenticate before running the routes specified (continue after setting up post man)
    g) interact with user model that passed through auth

6) At this point it is important to have postman set up
    a) Set up environments for dev and prod
    b) Set up environment variables to replace localhost:// and domain
    c) set login & sign up authorization properties to no auth
    d) make sure all others inherit auth
    e) edit the API to add an authorization type Bearer token that takes {{authKey}}
    f) add the following code to testing sections of log-in and signup
EXAMPLE TESTING CODE EXAMPLE TESTING CODE EXAMPLE TESTING CODE EXAMPLE TESTING CODE EXAMPLE TESTING
    <!-- // only difference from sign up is that create user error is 201
    // this is important for ease of API testing
    if (pm.response.code === 200) {
        pm.environment.set('authToken', pm.response.json().token)
    } -->
EXAMPLE TESTING CODE EXAMPLE TESTING CODE EXAMPLE TESTING CODE EXAMPLE TESTING CODE EXAMPLE TESTING

g) add logout and logoutall functions, then add authentification to other endpoints, which
   are all functions within auth
h) make sure to use auth middleware for all endpoints so that no data is passing throught the urls

7) add authentification to all endpoints of objects associated with users
8) remember to add a function that deletes things connected to users when that user deletes their account
9) check out how to use url query params in the /tasks endpoint
10) add profile pic addition (use multer + sharp)
11) Set up email
12) set up config folder with dev.env file, install npm env-cmd locally with (no need to go on server)
npm i env-cmd --save-dev

at this point the scripts section of the package.json should look like this
*********************
  "scripts": {
    "start": "node src/index.js",
    "dev": "env-cmd -f ./config/dev.env nodemon src/index.js"
  },
*********************
Then put all API keys into the dev.env file
remember that you need to use, process.env.insert_variable_name
restart server for it to pick up your new dev.env variables

Go to mongoDB atlas
sign in and connect to the cluster
add another ip of:
0.0.0.0/0
add username/password
user: codephony
pass: WGkDfbDpTTJpPo9v

Use mongo compass with this in clipboard
mongodb+srv://codephony:<password>@cluster0-shz1a.mongodb.net/test
