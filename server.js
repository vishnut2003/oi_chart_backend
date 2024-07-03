const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const dbConnect = require('./database/dbConn');
const session = require('express-session');

require('dotenv').config();

// import Router
const authRouter = require('./routes/auth');
const userRoute = require('./routes/users');
const fyersRoute = require('./routes/fyers');


// Configure port
const PORT = process.env.PORT || 3500;

// middlewares
app.use(cors({
    credentials: true
}))
app.use(morgan('common'))
app.use(express.json())
app.use(session({
    secret: 'JKFIKLJSDG%^KJG^5JHkv',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 300000
    }
}))

// use Routes
app.use('/auth', authRouter);
app.use('/users', userRoute);
app.use('/fyers/', fyersRoute);

// Connect to database
dbConnect(() => {
    app.listen(PORT, '127.0.0.1',() => {
        console.log(`Server is running on ${PORT}`);
    })
})