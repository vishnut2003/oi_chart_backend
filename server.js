const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const dbConnect = require('./database/dbConn');
const session = require('express-session');
const { WebSocketServer } = require('ws')

require('dotenv').config();

// import Router
const authRouter = require('./routes/auth');
const userRoute = require('./routes/users');
const fyersRoute = require('./routes/fyers');
const breezeRouter = require('./routes/breeze');
const settingsRouter = require('./routes/settings');
const runWebSocket = require('./helpers/breezeWebSocket');


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
app.use('/breeze', breezeRouter);
app.use('/settings', settingsRouter);


// Connect to database
dbConnect(() => {
    const server = app.listen(PORT, '127.0.0.1', () => {
        console.log(`Server is running on ${PORT}`);
    })
    const wss = new WebSocketServer({ server: server })
    wss.on('listening', () => {
        console.log("WebSocket Connected")
    })

    wss.on('connection', (ws) => {
        console.log('Client side connected')

        ws.on('message', (msg) => {
            const fullData = JSON.parse(msg)
            const stockInfo = fullData.formData
            const lineData = fullData.currentOiData
            setInterval(() => {
                runWebSocket(stockInfo)
                    .then((lastOi) => {
                        lineData.push(lastOi)
                        ws.send(JSON.stringify(lineData))
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }, 60000)
        })

        ws.on('close', () => {
            console.log('Connection closed')
        })
    })



})