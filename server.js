const express = require('express')
const app = express()
const mongoose = require('mongoose') // talk to db
const passport = require('passport') // handle authentication
const session = require('express-session')  //express uses a cookie to store a session id
const MongoStore = require('connect-mongo')(session) //so we can keep logged in users always go back to the same page
const connectDB = require('./config/database')

//Route files we're using
const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

  
app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    