
const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 4000
const io = require('socket.io')(http)
var deckLogic = require('../deck').data
var defaultDeck = deckLogic.getDeck()
// deck = require('../deck').data.shuffle(deck)
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

var rooms = []
var num; //this variable correlates to room# or which room in the array is being used (EX. "rooms[num]")


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
  console.log('turn: ', rooms[num].users[rooms[num].turn])
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: rooms[num].users,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name
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
  if (rooms[num].cardField.some(item => item.card.suit === rooms[num].trumpSuit)) {

    for (var i = 0; i < rooms[num].users.length; i++) {
      points = points + rooms[num].cardField[i].card.value
      if (rooms[num].cardField[i].card.suit !== rooms[num].trumpSuit) {
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
    rooms[num].turn = rooms[num].users.indexOf(highest.username)
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
    rooms[num].turn = rooms[num].users.indexOf(highest.username)
    console.log('POINTS: ' + points)
    console.log('WINNER: ' + highest.username)
    
  }

  broadcastMessage({
    type: 'GIVE_POINTS_AND_TURN',
    currentTurn: highest.username,
    points: points,
    roomName: rooms[num].name
  })
}

const setGlobalCard = (newCard) => {
  rooms[num].turn = (rooms[num].turn + 1) % rooms[num].users.length
  rooms[num].cardField.push(newCard)
  broadcastMessage({
    type: 'SET_GLOBAL_CARD',
    cardField: rooms[num].cardField,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name
  })
  if (rooms[num].cardField.length === rooms[num].users.length) {
    determineWinner()
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

io.on('connection', (socket) => {
  console.log('Someone has connected');
  //broadcastMessage('someone has connected!');
  updateUserCount(1);


  socket.send(JSON.stringify({
    type: 'UPDATE_MESSAGES',
    notes,
  }))

  socket.on('submitRoom', (data) => {
    console.log('newRoom: ' + data.roomName)
    var temp = deckLogic.shuffle( Object.assign([], defaultDeck))
    var trump = temp.pop()
    console.log('trump: ', trump)
    temp.unshift(trump)
    rooms.push({
      name: data.roomName,
      users: [data.username],
      trumpSuit: trump.suit,
      turn: 0,
      cardField: [],
      deck: temp
    })
    console.log(rooms[rooms.length - 1].name)
    socket.join(data.roomName)
    socket.emit('sendRooms', rooms)
    const stuff = {
      players: rooms[rooms.length - 1].users,
      turn: rooms[rooms.length - 1].users[rooms[rooms.length - 1].turn],
      type: 'UPDATE_PLAYER_LIST',
      roomName: data.roomName,
      cards: rooms[rooms.length - 1].deck
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
          roomName: data.roomName,
          cards: rooms[rooms.length - 1].deck

        }
        console.log('CURRENT PLAYERS: ' + rooms[i].users)
        socket.join(data.roomName)

      }
    }
    broadcastMessage(stuff)

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
    console.log('removing?')
    var stuff;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].name === data.room) {
        rooms[i].users.splice(rooms.indexOf(data.username), 1)
        stuff = {
          type: 'UPDATE_PLAYER_LIST',
          players: rooms[i].users,
          turn: data.turn,
          cards: rooms[i].deck
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
        num = i
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
    }
  });

  socket.on('disconnect', () => {
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
