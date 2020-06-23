var deckLogic = require('../deck').data
var defaultDeck = deckLogic.getDeck()

var rooms = []

const determineWinner = (io, num) => {
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

  io.in(rooms[num].name).emit('update', {
    type: 'GIVE_POINTS_AND_TURN',
    currentTurn: { username: highest.username },
    points: points,
    roomName: rooms[num].name,
    updatedScores: rooms[num].users
  })
}

module.exports.sendRooms = (io) => {
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

module.exports.cancel = (io, data) => {
  if (io.sockets.adapter.rooms[data]) {
    io.to(Object.keys(io.sockets.adapter.rooms[data].sockets)[0]).emit('update', { type: 'CANCEL' })
  }
}

module.exports.joinRoom = (socket, io, data) => {

  var stuff;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.roomName) {
      rooms[i].users.push({
        username: data.username,
        score: 0,
        handLength: 0,
        id: socket.id
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
        rooms[i].users[j].handLength = 0
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
      module.exports.sendRooms(io)
      break;
    }
  }

  io.in(stuff.roomName).emit('update', stuff)
}

module.exports.submitRoom = (socket, io, data) => {
  var temp = deckLogic.shuffle(Object.assign([], defaultDeck))
  var trump = temp.pop()
  temp.unshift(trump)
  rooms.unshift({
    name: data.roomName,
    users: [{
      username: data.username,
      score: 0,
      handLength: 0,
      id: socket.id
    }],
    trump: trump,
    turn: 0,
    cardField: [],
    deck: temp,
    playedCards: 0,
    chat: []
  })
  socket.join(data.roomName)
  module.exports.sendRooms(io)
  const stuff = {
    players: rooms[0].users,
    turn: rooms[0].users[rooms[0].turn],
    type: 'UPDATE_PLAYER_LIST',
    roomName: data.roomName,
    cards: rooms[0].deck,
    trump
  }
  io.in(stuff.roomName).emit('update', stuff)
}

module.exports.joinRequest = (socket, io, data) => {
  const message = {
    type: 'RECIEVE_REQUEST',
    joining: {
      id: socket.id,
      username: data.username
    }

  }
  io.to(Object.keys(io.sockets.adapter.rooms[data.roomName].sockets)[0]).emit('update', message)
}

module.exports.remove = (socket, io, data) => {
  var stuff;
  var temp = -1;
  var tempTurn;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].users.some(item => item.id === socket.id)) {
      temp = i;
      break;
    }
  }
  if (temp > -1) {
    for (var j = 0; j < rooms[temp].users.length; j++) {
      if (rooms[temp].users[j].id === socket.id) {
        rooms[temp].users.splice(j, 1)
      }
    }
    module.exports.restartGame(io, {room: rooms[temp].name})
    module.exports.sendRooms(io)
  }


}

module.exports.response = (io, data) => {
  var roomSize = Object.keys(io.sockets.adapter.rooms[data.room].sockets).length
  console.log(roomSize)
  console.log(io.sockets.adapter.rooms[data.room].sockets)
  var requestNames = []
  for (var i = 0; i < data.joinRequest.length; i++) {
    if (roomSize < 4 && !requestNames.includes(data.joinRequest[i].username)) {
      io.to(data.joinRequest[i].id).emit(data.response, data.room)
      roomSize++
      requestNames.push(data.joinRequest[i].username)
    }
    else {
      io.to(data.joinRequest[i].id).emit('decline', data.room)
    }
  }

}

module.exports.drawCard = (io, data) => {
  let num = 0;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      // console.log('DRAWCARD PASS!')
      num = i
      break;
    }
  }
  for (var j = 0; j < rooms[num].users.length; j++) {
    if (rooms[num].users[j].username === data.username) {
      rooms[num].users[j].handLength++
      break
    }
  }
  rooms[num].turn = (rooms[num].turn + 1) % rooms[num].users.length
  rooms[num].deck.pop()
  let stuff = {
    type: 'SET_REMAINING_CARDS',
    remainingCards: rooms[num].deck,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name,
    players: rooms[num].users
  }
  io.in(data.room).emit('update', stuff)

}

module.exports.sendCard = (io, data) => {
  let num = 0;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      // console.log('SENDCARD PASS!')
      break;
    }
  }
  for (var j = 0; j < rooms[num].users.length; j++) {
    if (rooms[num].users[j].username === data.username) {
      rooms[num].users[j].handLength--
      break
    }
  }
  rooms[num].turn = (rooms[num].turn + 1) % rooms[num].users.length
  rooms[num].cardField.push(data.newCard)
  rooms[num].playedCards++
  io.in(rooms[num].name).emit('update', {
    type: 'SET_GLOBAL_CARD',
    cardField: data.newCard,
    currentTurn: rooms[num].users[rooms[num].turn],
    roomName: rooms[num].name,
    players: rooms[num].users
  })
  if (rooms[num].cardField.length === rooms[num].users.length) {
    determineWinner(io, num)
  }
  if (rooms[num].playedCards >= 40) {
    io.in(rooms[num].name).emit('update', {
      type: 'FINISH_GAME',
      roomName: rooms[num].name
    })
  }
}

module.exports.clearField = (io, data) => {
  let num = 0;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      // console.log('CLEARFIELD PASS!')
      break;
    }
  }
  rooms[num].cardField = []
  io.in(rooms[num].name).emit('update', {
    type: 'FIELD_CLEAR',
    cardField: [],
    roomName: rooms[num].name
  })
}

module.exports.restartGame = (io, data) => {
  let num = 0;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      break;
    }
  }
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
    rooms[num].users[i].handLength = 0
  }
  io.in(rooms[num].name).emit('update', {
    type: 'UPDATE_PLAYER_LIST',
    turn: rooms[num].users[0],
    trump: rooms[num].trump,
    cards: rooms[num].deck,
    players: rooms[num].users,
    roomName: rooms[num].name,
    cardField: []
  })
}

module.exports.sendMessage = (io, data) => {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      break;
    }
  }
  // rooms[num].chat.push({ username: data.username, message: data.message })


  io.in(rooms[num].name).emit('update', {
    type: 'GET_MESSAGE',
    message: { username: data.username, message: data.message, color: data.color }
  })
}