const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const route = require('./api/routes/route');

const errorHandler = require("./api/middleware/errorHandling");

const connectDB = require("./configuration/dbConnection");

require('dotenv').config();

const app = express();

connectDB();

app.use(express.json({ limit: '50mb' }));

app.use(cors());

app.get('/', (req, res) => {
    var params = ['{"email":"","password":""}', '{"name":"","email":"","mobileNo":"","password":"","address":"","photo":"",location:[]}', '{"refreshToken":""}-bearer token required', 'bearer token required', 'bearer token required', '{"name":"","email":"",password:"","mobileNo":"","address":"","photo":"",location:[]}-bearer token required', 'bearer token required', '{"bookid":""}-bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', 'bearer token required', '{"name":"","author":"","category":"","description":"","photo":"","location":[]}-bearer token required', '{"name":"","author":"","category":"","description":"","photo":"","location":[]}-bearer token required', '{"bookid":""}-bearer token required', 'bearer token required', '{"bookid":""}-bearer token required', '{"bookid":""}-bearer token required', '{"bookid":""}-bearer token required']
    var info = `<h1>Book donation API Backend Manual</h1><b>root path: /api/</b><table><tr><th>Paths</th><th>Methods</th><th>Parameters</th></tr>`;
    for (var i in route.stack) {
        info = info + `<tr><td>${route.stack[i].route.path}</td><td>${Object.keys(route.stack[i].route.methods)}</td><td>${params[i]}</td></tr>`;
    }
    info = info + "</table>";
    res.status(200).send(info);
});

app.use('/api', route);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Sever running on port " + PORT);
});

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});