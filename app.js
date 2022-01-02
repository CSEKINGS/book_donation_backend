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

app.set("view engine", "ejs");

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.get('/', (req, res) => {
    const params = ['{"email":"","password":""}', '{"name":"","email":"","mobileNo":"","password":"","address":"","photo":"",location:[]}', '{"email":""}-bearer token required', '{"password":""}-bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', '{"name":"","email":"",password:"","mobileNo":"","address":"","photo":"",location:[]}-bearer token required', 'bearer token required', '{"chatId":""}-bearer token required', '{"bookId":""}-bearer token required', '{"bookId":""}-bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', '{"name":"","author":"","categeory":"","description":"","photo":"","location":[]}-bearer token required', '{"name":"","author":"","categeory":"","description":"","photo":"","location":[]}-bearer token required', '{"bookId":""}-bearer token required', 'bearer token required', '{"bookId":""}-bearer token required', '{"bookId":"",message:""}-bearer token required', '{"bookId":""}-bearer token required', '{"bookId":""}-bearer token required'];
    res.render("index", {
        route: route.stack.map((item, i) => `<tr><td>${item.route.path}</td><td>${Object.keys(item.route.methods)}</td><td>${params[i]}</td></tr>`).join(''),
    })
});

app.use('/api', route);

app.use(errorHandler);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log("Sever running on port " + PORT);
});

const io = require('socket.io')(server, { cors: { origin: process.env.FRONTEND, methods: ["GET", "POST"] } });

io.on('connection', (client) => {
    client.on('online', roomId => {
        client.join(roomId);
    });
    client.on('message-sent', msg => {
        Chat.create(msg);
        io.in(msg.chatId).emit("message-received", msg);
    });
});

global.io = io;

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});