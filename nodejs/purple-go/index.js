const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/user-router');

const port = 8080;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', userRouter);

const server = http.createServer(app);


server.on('listening', () => {
    console.log('listening on port ', port);
})

server.listen(port);
