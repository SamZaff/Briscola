
const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 4000
const io = require('socket.io')(http)
var deckLogic = require('../deck').data
var defaultDeck = deckLogic.getDeck()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

var rooms = []
var num; //this variable correlates to room# or which room in the array is being used (EX. "rooms[num]")


const notes = [];
var suits = ['Clubs', 'Swords', 'Gold', 'Cups']

const broadcastMessage = (message) => {
  io.in(message.roomName).emit('update', message)
};

const updatePlayers = () => {
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: rooms[num].users,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name,
    trump: rooms[num].trump
  })
}

const broadcastAllMessages = (newNote) => {
  notes.unshift(newNote);
  broadcastMessage({
    type: 'UPDATE_MESSAGES',
    notes,
  });
};

const sendRooms = () => {
  for (var i = 0; i < rooms.length; i) {
    if (!io.sockets.adapter.rooms[rooms[i].name]) {
      console.log('room successfully removed')
      rooms.splice(i, 1)
    }
    else {
      i++
    }
  }
  if (rooms.length === 0) {
    console.log('no rooms left')
  }
  io.sockets.emit('sendRooms', rooms)
}

//******GAME LOGIC******

const drawCard = (/*drawnCard, remainingCards*/) => {

  rooms[num].turn = (rooms[num].turn + 1) % rooms[num].users.length
  rooms[num].deck.pop()
  broadcastMessage({
    type: 'SET_REMAINING_CARDS',
    remainingCards: rooms[num].deck,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name
  })


}

const determineWinner = () => {
  var points = 0
  var leadingSuit = rooms[num].cardField[0].card.suit
  var highest = {
    card: {
      value: 0,
      number: 0
    }
  };
  var tempField = [...rooms[num].cardField]

  //cardField.some() checks to see if any of the cards are trump cards
  if (rooms[num].cardField.some(item => item.card.suit === rooms[num].trump.suit)) {

    for (var i = 0; i < rooms[num].users.length; i++) {
      points = points + rooms[num].cardField[i].card.value
      if (rooms[num].cardField[i].card.suit !== rooms[num].trump.suit) {
        tempField.splice(tempField.indexOf(rooms[num].cardField[i]), 1)
        //this has to be changed
      }
    }
  }
  else {

    for (var i = 0; i < rooms[num].users.length; i++) {
      points = points + rooms[num].cardField[i].card.value
      if (rooms[num].cardField[i].card.suit !== leadingSuit) {
        tempField.splice(tempField.indexOf(rooms[num].cardField[i]), 1)
        //this has to be changed
      }
    }
  }

  if (tempField.some(item => item.card.value > 0)) { //HIGHEST NEEDS TO BE HIGHEST.CARD.VALUE
    for (var i = 0; i < tempField.length; i++) {
      if (highest.card.value < tempField[i].card.value) {
        highest = tempField[i]
      }
    }
    rooms[num].turn = rooms[num].users.findIndex(function (item, i) {
      if (item.username === highest.username) {
        rooms[num].users[i].score += points
        return highest.username
      }
    })

  }
  else {
    for (var i = 0; i < tempField.length; i++) {
      if (highest.card.number < tempField[i].card.number) {
        highest = tempField[i]
      }
    }
    rooms[num].turn = rooms[num].users.findIndex(function (item, i) {
      if (item.username === highest.username) {
        rooms[num].users[i].score += points
        return highest.username
      }
    })

  }

  broadcastMessage({
    type: 'GIVE_POINTS_AND_TURN',
    currentTurn: { username: highest.username },
    points: points,
    roomName: rooms[num].name,
    updatedScores: rooms[num].users
  })
}

const setGlobalCards = (newCard) => {
  rooms[num].turn = (rooms[num].turn + 1) % rooms[num].users.length
  rooms[num].cardField.push(newCard)
  rooms[num].playedCards++
  broadcastMessage({
    type: 'SET_GLOBAL_CARD',
    cardField: rooms[num].cardField,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name
  })
  if (rooms[num].cardField.length === rooms[num].users.length) {
    determineWinner()
  }
  if (rooms[num].playedCards >= 40) {
    broadcastMessage({
      type: 'FINISH_GAME',
      roomName: rooms[num].name
    })
  }
}

const clearField = () => {
  rooms[num].cardField = []
  broadcastMessage({
    type: 'FIELD_CLEAR',
    cardField: [],
    roomName: rooms[num].name
  })
}

const restartGame = () => {
  rooms[num].cardField = []
  rooms[num].deck.unshift(rooms[num].trump)
  rooms[num].playedCards = 0
  rooms[num].turn = 0
  if (rooms[num].users.length === 3) {
    rooms[num].deck = Object.assign([], defaultDeck)
    rooms[num].deck.splice(21, 1)
    rooms[num].deck = deckLogic.shuffle(rooms[num].deck)
    rooms[num].playedCards++
  }
  else {
    rooms[num].deck = deckLogic.shuffle(Object.assign([], defaultDeck))
  }
  rooms[num].trump = rooms[num].deck.pop()
  rooms[num].deck.unshift(rooms[num].trump)
  for (var i = 0; i < rooms[num].users.length; i++) {
    rooms[num].users[i].score = 0
  }
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    turn: rooms[num].users[0],
    trump: rooms[num].trump,
    cards: rooms[num].deck,
    players: rooms[num].users,
    roomName: rooms[num].name,
    cardField: []
  })

}

io.on('connection', (socket) => {
  console.log('Someone has connected');
  //broadcastMessage('someone has connected!');

  socket.send(JSON.stringify({
    type: 'UPDATE_MESSAGES',
    notes,
  }))

  socket.on('submitRoom', (data) => {
    var temp = deckLogic.shuffle(Object.assign([], defaultDeck))
    var trump = temp.pop()
    temp.unshift(trump)
    rooms.unshift({
      name: data.roomName,
      users: [{
        username: data.username,
        score: 0
      }],
      trump: trump,
      turn: 0,
      cardField: [],
      deck: temp,
      playedCards: 0
    })
    socket.join(data.roomName)
    sendRooms()
    const stuff = {
      players: rooms[rooms.length - 1].users,
      turn: rooms[rooms.length - 1].users[rooms[rooms.length - 1].turn],
      type: 'UPDATE_PLAYER_LIST',
      roomName: data.roomName,
      cards: rooms[rooms.length - 1].deck,
      trump
    }
    broadcastMessage(stuff)
  })

  socket.on('joinRequest', (data) => {
    const message = {
      type: 'RECIEVE_REQUEST',
      joining: {
        id: socket.id,
        username: data.username
      }

    }
    io.to(Object.keys(io.sockets.adapter.rooms[data.roomName].sockets)[0]).emit('update', message)
  })

  socket.on('cancel', (data) => {
    if (io.sockets.adapter.rooms[data]) {
      io.to(Object.keys(io.sockets.adapter.rooms[data].sockets)[0]).emit('update', { type: 'CANCEL' })
    }
  })

  socket.on('response', (data) => {
    var roomSize = Object.keys(io.sockets.adapter.rooms[data.room].sockets).length
    console.log(roomSize)
    console.log(io.sockets.adapter.rooms[data.room].sockets)
    for (var i = 0; i < data.joinRequest.length; i++) {
      if (roomSize < 4) {
        io.to(data.joinRequest[i].id).emit(data.response, data.room)
        roomSize++
      }
      else {
        io.to(data.joinRequest[i].id).emit('decline', data.room)
      }
    }

  })

  socket.on('joinRoom', (data) => {
    var stuff;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].name === data.roomName) {
        rooms[i].users.push({
          username: data.username,
          score: 0
        })
        rooms[i].cardField = []
        rooms[i].playedCards = 0
        if (rooms[i].users.length === 3) {
          rooms[i].deck = Object.assign([], defaultDeck)
          rooms[i].deck.splice(21, 1)
          rooms[i].deck = deckLogic.shuffle(rooms[i].deck)
          rooms[i].playedCards++
        }
        else {
          rooms[i].deck = deckLogic.shuffle(Object.assign([], defaultDeck))
        }
        rooms[i].trump = rooms[i].deck.pop()
        rooms[i].deck.unshift(rooms[i].trump)

        rooms[i].turn = 0
        for (var j = 0; j < rooms[i].users.length - 1; j++) {
          rooms[i].users[j].score = 0
        }
        stuff = {
          players: rooms[i].users,
          turn: rooms[i].users[0],
          type: 'UPDATE_PLAYER_LIST',
          roomName: data.roomName,
          cards: rooms[i].deck,
          cardField: [],
          trump: rooms[i].trump
        }
        socket.join(data.roomName)
        sendRooms()
        break;
      }
    }

    broadcastMessage(stuff)

  })

  socket.on('getRooms', () => {
    sendRooms()
  })

  socket.on('remove', (data) => {
    var stuff;
    var temp;
    var tempTurn;
    if (data.room) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].name === data.room) {
          if (data.turn) {
            tempTurn = data.turn
          }
          else {
            tempTurn = rooms[i].turn
          }
          rooms[i].users.find(function (item, j) {
            if (item) {
              if (item.username === data.username) {
                temp = j
                rooms[i].users.splice(temp, 1)

              }
            }
          })
          stuff = {
            type: 'UPDATE_PLAYER_LIST',
            players: rooms[i].users,
            turn: tempTurn,
            cards: rooms[i].deck,
            trump: rooms[i].trump
          }
        }
        break;
      }

      sendRooms()
      socket.in(data.room).emit('update', stuff)

    }
    else {
      console.log('not actively in room')
    }
  })

  socket.on('message', (messageObject) => {
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].name === messageObject.room) {
        num = i
        break;
      }
    }
    switch (messageObject.type) {
      case 'SEND_CARD':
        setGlobalCards(messageObject.newCard);
        break;
      case 'SEND_MESSAGE':
        broadcastAllMessages(messageObject.newNote);
        break;
      case 'GRAB_ROOMS':
        break;
      case 'DRAW_CARD':
        drawCard();
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
      case 'RESTART_GAME':
        restartGame();
        break;
    }
  });

  socket.on('disconnect', () => {
    console.log('someone has disconnected!');
  });

  socket.on('error', (e) => {
    console.log(e);
  });
});

http.listen(port, () => {
  console.log('Listening on port: ', port)
})
