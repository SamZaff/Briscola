
const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 4000
const io = require('socket.io')(http)
const deck = require('../deck')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

var rooms = []
var room = {
  name: '',
  users: [],
  trumpSuit: '',
  turn: 0,
  cardField: []
}

const notes = [];
var suits = ['Clubs', 'Swords', 'Gold', 'Cups']
userCount = 0;

const broadcastMessage = (message) => {
  
  io.in(message.roomName).emit('update', message)
};

//DELETE UPDATE USER COUNT

const updateUserCount = (increment) => {
  userCount += increment
  console.log('NUMBER OF CLIENTS: ' + userCount)
  broadcastMessage({
    type: 'UPDATE_USER_COUNT',
    count: userCount,
  });
};

//DELETE UPDATE USER COUNT

const updatePlayers = () => {
  // players = playerList;
  console.log('turn: ', room.users[room.turn])
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: room.users,
    currentTurn: room.users[room.turn],
    roomName: room.name
  })
}

const broadcastAllMessages = (newNote) => {
  notes.unshift(newNote);
  broadcastMessage({
    type: 'UPDATE_MESSAGES',
    notes,
  });
};

//******GAME LOGIC******

const drawCard = (drawnCard, remainingCards) => {

  room.turn = (room.turn + 1) % room.users.length
  console.log('TURN: ' + room.turn)
  for (var i = 0; i < remainingCards.length; i++) {
    //console.log('TEST: ', remainingCards[i].name);
    if (remainingCards[i].name === drawnCard.name) {
      remainingCards.splice(i, 1)
      break;
    }
  }
  broadcastMessage({
    type: 'SET_REMAINING_CARDS',
    remainingCards,
    currentTurn: room.users[room.turn],
    roomName: room.name
  })

}

const determineWinner = () => {
  var points = 0
  var leadingSuit = room.cardField[0].card.suit
  var highest = {
    card: {
      value: 0,
      number: 0
    }
  };
  var tempField = [...room.cardField]

  //cardField.some() checks to see if any of the cards are trump cards
  if (room.cardField.some(item => item.card.suit === room.trumpSuit)) {

    for (var i = 0; i < room.users.length; i++) {
      points = points + room.cardField[i].card.value
      if (room.cardField[i].card.suit !== room.trumpSuit) {
        tempField.splice(tempField.indexOf(room.cardField[i]), 1)
        //this has to be changed
      }
    }
  }
  else {

    for (var i = 0; i < room.users.length; i++) {
      points = points + room.cardField[i].card.value
      if (room.cardField[i].card.suit !== leadingSuit) {
        tempField.splice(tempField.indexOf(room.cardField[i]), 1)
        //this has to be changed
      }
    }
  }
  console.log(tempField.length)
  console.log(tempField.some(item => item.card.value > 0))
  for (var i = 0; i < tempField.length; i++) {
    console.log(tempField[i].card.name)
  }
  if (tempField.some(item => item.card.value > 0)) { //HIGHEST NEEDS TO BE HIGHEST.CARD.VALUE
    for (var i = 0; i < tempField.length; i++) {
      if (highest.card.value < tempField[i].card.value) {
        highest = tempField[i]
        console.log('BY VALUE: ' + highest.username)
      }
    }
    room.turn = room.users.indexOf(highest.username)
    console.log('POINTS: ' + points)
    console.log('WINNER: ' + highest.username)
    
  }
  else {
    for (var i = 0; i < tempField.length; i++) {
      if (highest.card.number < tempField[i].card.number) {
        highest = tempField[i]
        console.log('BY NUMBER: ' + highest.username)
      }
    }
    room.turn = room.users.indexOf(highest.username)
    console.log('POINTS: ' + points)
    console.log('WINNER: ' + highest.username)
    
  }

  broadcastMessage({
    type: 'GIVE_POINTS_AND_TURN',
    currentTurn: highest.username,
    points: points,
    roomName: room.name
  })
}

const setGlobalCard = (newCard) => {
  room.turn = (room.turn + 1) % room.users.length
  room.cardField.push(newCard)
  broadcastMessage({
    type: 'SET_GLOBAL_CARD',
    cardField: room.cardField,
    currentTurn: room.users[room.turn],
    roomName: room.name
  })
  if (room.cardField.length === room.users.length) {
    determineWinner()
  }
}

const clearField = () => {
  room.cardField = []
  broadcastMessage({
    type: 'FIELD_CLEAR',
    cardField: room.cardField,
    roomName: room.name
  })
}

io.on('connection', (socket) => {
  console.log('Someone has connected');
  //console.log(socket.id)
  //broadcastMessage('someone has connected!');
  updateUserCount(1);
  //console.log(socket)


  socket.send(JSON.stringify({
    type: 'UPDATE_MESSAGES',
    notes,
  }))

  socket.on('submitRoom', (data) => {
    console.log('newRoom: ' + data.roomName)
    //rooms[req.body.room] = { users: {} }
    rooms.push({
      name: data.roomName,
      users: [data.username],
      trumpSuit: suits[Math.floor(Math.random() * suits.length)],
      turn: 0,
      cardField: []
    })
    console.log(rooms[0].name)
    socket.join(data.roomName)
    socket.emit('sendRooms', rooms)
    const stuff = {
      players: rooms[rooms.length - 1].users,
      turn: rooms[rooms.length - 1].users[rooms[rooms.length - 1].turn],
      type: 'UPDATE_PLAYER_LIST',
      roomName: data.roomName
    }
    //socket.in(data.roomName).emit('update', stuff)
    broadcastMessage(stuff)
  })



  socket.on('joinRoom', (data) => {

    var stuff;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].name === data.roomName) {
        console.log('if statement test')
        rooms[i].users.push(data.username)
        stuff = {
          players: rooms[i].users,
          turn: rooms[i].users[rooms[i].turn],
          type: 'UPDATE_PLAYER_LIST',
          roomName: data.roomName

        }
        console.log('CURRENT PLAYERS: ' + rooms[i].users)
        socket.join(data.roomName)

      }
    }
    //console.log('TYPE: ', stuff.type)
    //socket.in(data.roomName).emit('update', stuff)
    broadcastMessage(stuff)

    //console.log(rooms[0].users)
  })

  socket.on('getRooms', () => {
    for (var i = 0; i < rooms.length; i) {
      if (!io.sockets.adapter.rooms[rooms[i].name]) {
        console.log('room successfully removed')
        rooms.splice(i, 1)
      }
      else {
        i++
      }
    }
    socket.emit('sendRooms', rooms)
  })

  socket.on('remove', (data) => {

    var temp = []
    var stuff;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].name === data.room) {
        rooms[i].users.splice(rooms.indexOf(data.username), 1)
        stuff = {
          type: 'UPDATE_PLAYER_LIST',
          players: rooms[i].users,
          turn: data.turn
        }
      }
      break;
    }

    socket.in(data.room).emit('update', stuff)
  })

  socket.on('message', (messageObject) => {
    for (var i = 0; i < rooms.length; i++) {
      console.log(rooms[i].name)
      console.log(messageObject.room)
      if (rooms[i].name === messageObject.room) {
        room = rooms[i]
        break;
      }
    }
    switch (messageObject.type) {
      case 'SEND_CARD':
        setGlobalCard(messageObject.newCard);
        break;
      case 'SEND_MESSAGE':
        broadcastAllMessages(messageObject.newNote);
        break;
      case 'GRAB_ROOMS':
        break;
      case 'DRAW_CARD':
        drawCard(messageObject.drawn, messageObject.remainingCards);
        break;
      case 'UPDATE_PLAYERS':
        updatePlayers(messageObject.playerList);
        break;
      case 'CLEAR_FIELD':
        clearField();
        break;
      case 'CHECK_WINNER':
        determineWinner();
        break;
    }
    //console.log(message);
  });

  socket.on('disconnect', () => {
    //broadcastMessage('someone has disconnected!');
    updateUserCount(-1);
    console.log('someone has disconnected!');
  });

  socket.on('error', (e) => {
    console.log(e);
  });
});

http.listen(port, () => {
  console.log('Listening on port: ', port)
})
