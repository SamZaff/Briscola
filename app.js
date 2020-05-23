const express = require('express');
const app = express();
const userCheck = require('./MongoDB/usercheck.js');
const socketIO = require('./socketIO/server.js');
const bodyParser = require('body-parser')
const port = process.env.PORT || 4000
const http = require('http').Server(app); //POTENTIALLY REMOVE
const io = require('socket.io')(http)
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.json());
app.use((req, res, next) => {
    //res.header("Access-Control-Allow-Origin", "*");
    console.log(req.path)
    next();
})

app.use(express.static('./public'));
app.get('/', (req, res) => res.send('Hello From Express!'))

app.use(userCheck)

io.on('connection', (socket) => {
    socket.on('getRooms', () => {
        socketIO.sendRooms(io)
    })
    socket.on('cancel', (data) => {
        socketIO.cancel(io, data)
    })
    socket.on('joinRoom', (data) => {
        socketIO.joinRoom(socket, io, data)
    })
    socket.on('submitRoom', (data) => {
        socketIO.submitRoom(socket, io, data)
    })
    socket.on('joinRequest', (data) => {
        socketIO.joinRequest(socket, io, data)
    })
    socket.on('remove', (data) => {
        socketIO.remove(socket, io, data)
    })
    socket.on('response', (data) => {
        socketIO.response(io, data)
    })
    socket.on('drawCard', (data) => {
        socketIO.drawCard(io, data)
    })
    socket.on('sendCard', (data) => {
        socketIO.sendCard(io, data)
    })
    socket.on('clearField', (data) => {
        socketIO.clearField(io, data)
    })
    socket.on('restartGame', (data) => {
        socketIO.restartGame(io, data)
    })
    socket.on('disconnect', () => {
        console.log('someone has disconnected!');
    });
    socket.on('error', (e) => {
        console.log(e);
    });
})

http.listen(port, () => {
    console.log('Listening on port: ', port);
})

