//import deck from './deck';
const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 4000
const io = require('socket.io')(http)

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

var rooms = []
var room = ''

const notes = [];
var suits = ['Clubs', 'Swords', 'Gold', 'Cups']
userCount = 0;

const broadcastMessage = (message) => {
 
  io.to(room.name).emit('update', message)
};

const updateUserCount = (increment) => {
  userCount += increment
  console.log('NUMBER OF CLIENTS: ' + userCount)
  broadcastMessage({
    type: 'UPDATE_USER_COUNT',
    count: userCount,
  });
};

const updatePlayers = (playerList) => {
 // players = playerList;
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: room.users,
    currentTurn: room.users[room.turn]
  })
}

const sendPlayers = () => {
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: room.users,
    currentTurn: room.users[room.turn]
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
  //console.log(deck)
  //console.log('DRAWN CARD: ' + drawnCard.name)
  room.turn = (room.turn + 1) % room.users.length
  console.log('TURN: ' + room.turn)
  for (var i = 0; i < remainingCards.length; i++) {
    //console.log('TEST: ', remainingCards[i].name);
    if (remainingCards[i].name === drawnCard.name) {
      remainingCards.splice(i, 1)
      break;
    }
  }
  //remainingCards.splice(remainingCards.indexOf(drawnCard), 1 )
  //console.log(remainingCards)
  broadcastMessage({
    type: 'SET_REMAINING_CARDS',
    remainingCards,
    currentTurn: room.users[room.turn]
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
    console.log('passed trump test')
    for (var i = 0; i < room.users.length; i++) {
      // console.log(cardField[i].card.value)
      // console.log(cardField[i].card.number)
      points = points + room.cardField[i].card.value
      if (room.cardField[i].card.suit !== room.trumpSuit) {

        tempField.splice(tempField.indexOf(room.cardField[i]), 1)
        //this has to be changed
      }
    }
  }
  else {
    console.log('passed leading test')
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
    broadcastMessage({
      type: 'GIVE_POINTS_AND_TURN',
      currentTurn: highest.username,
      points: points
    })
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
    broadcastMessage({
      type: 'GIVE_POINTS_AND_TURN',
      currentTurn: highest.username,
      points: points
    })
  }

}

const setGlobalCard = (newCard) => {
  room.turn = (room.turn + 1) % room.users.length
  room.cardField.push(newCard)
  broadcastMessage({
    type: 'SET_GLOBAL_CARD',
    cardField: room.cardField,
    currentTurn: room.users[room.turn]
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
    console.log('so this works?')
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
      type: 'UPDATE_PLAYER_LIST'
    }
    socket.emit('update', stuff)
  })

  socket.on('joinRoom', (data) => {
    console.log('does this work too?')
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].name === data.roomName) {
        rooms[i].users.push(data.username)
      }
    }
    
    socket.join(toString(data.roomName))
    //console.log(rooms[0].users)
  })

  socket.on('getRooms', () => {
    console.log('this is a test')
    socket.emit('sendRooms', rooms)
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
      case 'GET_PLAYERS':
        sendPlayers();
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
