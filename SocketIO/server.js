var deckLogic = require('../deck').data
var defaultDeck = deckLogic.getDeck()

var rooms = []

const determineWinner = (io, num) => {
  var points = 0
  //cardField.some() checks to see if any of the cards are trump cards
  var leadingSuit = rooms[num].cardField.some(item => item.card.suit === rooms[num].trump.suit) ? rooms[num].trump.suit : rooms[num].cardField[0].card.suit
  var highest = {
    card: {
      value: 0,
      number: 0
    }
  };
  var tempField = [...rooms[num].cardField]

  for (var i = 0; i < rooms[num].users.length; i++) {
    points += rooms[num].cardField[i].card.value
    if (rooms[num].cardField[i].card.suit !== leadingSuit) {
      tempField.splice(tempField.indexOf(rooms[num].cardField[i]), 1)
      //this has to be changed
    }
  }

  if (tempField.some(item => item.card.value > 0)) {
    for (var i = 0; i < tempField.length; i++) {
      if (highest.card.value < tempField[i].card.value) {
        highest = tempField[i]
      }
    }
  }
  else {
    for (var i = 0; i < tempField.length; i++) {
      if (highest.card.number < tempField[i].card.number) {
        highest = tempField[i]
      }
    }
  }

  if (points > 0) {
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
  io.sockets.emit('sendRooms', rooms)
}

module.exports.cancel = (io, data) => {
  if (io.sockets.adapter.rooms[data]) {
    io.to(Object.keys(io.sockets.adapter.rooms[data].sockets)[0]).emit('update', { type: 'CANCEL' })
  }
}

module.exports.joinRoom = (socket, io, data) => {

  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.roomName) {
      rooms[i].users.push({
        username: data.username,
        score: 0,
        handLength: 0,
        id: socket.id
      })

      socket.join(data.roomName)
      module.exports.restartGame(io, { room: data.roomName })
      module.exports.sendRooms(io)
      break;
    }
  }

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

module.exports.remove = (socket, io) => {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].users.some(item => item.id === socket.id)) {
      for (var j = 0; j < rooms[i].users.length; j++) {
        if (rooms[i].users[j].id === socket.id) {
          rooms[i].users.splice(j, 1)
        }
      }
      module.exports.restartGame(io, { room: rooms[i].name })
      module.exports.sendRooms(io)
      break;
    }
  }

}

module.exports.response = (io, data) => {
  if (data.joinRequest.length > 0) {
    var roomSize = Object.keys(io.sockets.adapter.rooms[data.room].sockets).length
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
}

module.exports.drawCard = (socket, io, data) => {
  let num = 0;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      break;
    }
  }
  if (!io.sockets.adapter.rooms[rooms[num].name].sockets[socket.id]) {
    return
  }
  for (var j = 0; j < rooms[num].users.length; j++) {
    if (rooms[num].users[j].username === data.username) {
      rooms[num].users[j].handLength++
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
      break
    }
  }


}

module.exports.sendCard = (socket, io, data) => {
  let num = 0;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      break;
    }
  }
  if (!io.sockets.adapter.rooms[rooms[num].name].sockets[socket.id]) {
    return
  }
  for (var j = 0; j < rooms[num].users.length; j++) {
    if (rooms[num].users[j].username === data.username) {
      rooms[num].users[j].handLength--
      break
    }
  }
  rooms[num].turn = (rooms[num].turn + 1) % rooms[num].users.length
  rooms[num].cardField.push(data.newCard)
  rooms[num].playedCards++,
  console.log(rooms[num].users[rooms[num].turn])
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
    type: 'RESTART_GAME',
    turn: rooms[num].users[0],
    trump: rooms[num].trump,
    cards: rooms[num].deck,
    players: rooms[num].users,
    roomName: rooms[num].name,
    cardField: [],
    message: { message: `Game resetting...Trump card drawn (${rooms[num].trump.name})`, color: 'white'}
  })
}

module.exports.sendMessage = (io, data) => {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].name === data.room) {
      num = i
      io.in(rooms[num].name).emit('update', {
        type: 'GET_MESSAGE',
        message: { username: data.username, message: data.message, color: data.color }
      })
      break;
    }
  }
  // rooms[num].chat.push({ username: data.username, message: data.message })


}