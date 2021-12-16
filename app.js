const express = require("express");
const cors = require('cors');
const route = require('./api/routes/route');
const errorHandler = require("./api/middleware/errorHandling");

const connectDB = require("./configuration/dbConnection");

require('dotenv').config();

const app = express();

connectDB();

const Chat = require("./models/chat-model");

app.use(express.json({ limit: '50mb' }));

app.use(cors());

app.get('/', (req, res) => {
    var params = ['{"email":"","password":""}', '{"name":"","email":"","mobileNo":"","password":"","address":"","photo":"",location:[]}', '{"email":""}-bearer token required', '{"password":""}-bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', '{"name":"","email":"",password:"","mobileNo":"","address":"","photo":"",location:[]}-bearer token required', 'bearer token required', '{"bookId":""}-bearer token required', '{"bookId":""}-bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', '{"name":"","author":"","categeory":"","description":"","photo":"","location":[]}-bearer token required', '{"name":"","author":"","categeory":"","description":"","photo":"","location":[]}-bearer token required', '{"bookId":""}-bearer token required', 'bearer token required', '{"bookId":""}-bearer token required', '{"bookId":"",message:""}-bearer token required', '{"bookId":""}-bearer token required', '{"bookId":""}-bearer token required']
    var info = `<h1>Book donation API Backend Documentation</h1><b>root path: /api/</b><table><tr><th>Paths</th><th>Methods</th><th>Parameters</th></tr>`;
    for (var i in route.stack) {
        info = info + `<tr><td>${route.stack[i].route.path}</td><td>${Object.keys(route.stack[i].route.methods)}</td><td>${params[i]}</td></tr>`;
    }
    info = info + "</table>";
    res.status(200).send(info);
});

app.use('/api', route);

app.use(errorHandler);

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: process.env.FRONTEND, methods: ["GET", "POST"] } });

io.on('connection', (client) => {
    client.on('online', roomId => {
        console.log('room', roomId);
        client.roomId = roomId
        // Chat.find({ chatId: roomId }, (err, chats) => {
        //     if (err) {
        //         return next(err);
        //     } else {
        //         io.in(roomId).emit('notifications', chats);
        //     }
        // })
    });
    client.on('message-sent', msg => {
        Chat.create(msg);
        io.in(msg.chatId).emit("message-received", msg);
    })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Sever running on port " + PORT);
});

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});