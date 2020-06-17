const express = require('express');
const app = express();
const userCheck = require('./MongoDB/usercheck.js');
const socketIO = require('./socketIO/server.js');
const bodyParser = require('body-parser')
const port = process.env.PORT || 4000
const http = require('http').Server(app); //POTENTIALLY REMOVE
const io = require('socket.io')(http)
const path = require('path')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path)
    next();
})

console.log('SERVER LOG TEST')

// app.use(express.static('./public'));
// app.get('/', (req, res) => res.send('Hello From Express!'))

app.use(userCheck)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

io.on('connection', (socket) => {
    if (socket.id) {
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
        socket.on('message', (data) => {
            socketIO.sendMessage(io, data)
        })
    }
    socket.on('disconnect', () => {
        console.log('someone has disconnected!');
    });
    socket.on('error', (e) => {
        console.log(e);
    });
})

if (process.env.NODE_ENV === "production") {
    // console.log('DIRECTORY: ' + path.resolve( __dirname))
    app.use(express.static(path.resolve(__dirname, 'frontend', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}
http.listen(port, () => {
    console.log('Listening on port: ', port);
})

