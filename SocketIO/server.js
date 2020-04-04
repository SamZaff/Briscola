//import deck from './deck';
const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 4000
const io = require('socket.io')(http)

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.set('views', './src/pages')
// app.use(express.static('/src'))
// app.use(express.urlencoded({extended: true}))

// const rooms = {name: {}}


// app.get('/', (req, res) => {
 
//   res.render('Rooms', { rooms: rooms})
// })

// app.get(':/room', (req, res) => {
//   res.render('Briscola', { roomName: req.params.room })
// })

// app.get('/getRooms', (req, res) => {
//   console.log('THIS IS ALSO A TEST WOO')
//   res.send(rooms, () => {
//     console.log("This is a test. I don't know if this will work")
//   })
// })

//const wss = require('ws')
//const wss = new WebSocket.Server({ port: 4000 });

const notes = [];
var players = [];
var turn = 0;
var cardField = [];
var trumpSuit = 'Clubs';
userCount = 0;

const broadcastMessage = (message) => {
  //wss.clients.forEach((client) => {
  // io.clients.forEach((client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(message)); //server to client
  //   }
  // });
  io.emit('update', message)
};

const updateUserCount = (increment) => {
  console.log('NUMBER OF CLIENTS: ' + userCount)
  userCount += increment
  broadcastMessage({
    type: 'UPDATE_USER_COUNT',
    count: userCount,
  });
};

const updatePlayers = (playerList) => {
  players = playerList;
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: playerList,
    currentTurn: players[turn]
  })
}

const sendPlayers = () => {
  broadcastMessage({
    type: 'UPDATE_PLAYER_LIST',
    players: players,
    currentTurn: players[turn]
  })
}

const broadcastAllMessages = (newNote) => {
  notes.unshift(newNote);
  broadcastMessage({
    type: 'UPDATE_MESSAGES',
    notes,
  });
};

const drawCard = (drawnCard, remainingCards) => {
  //console.log(deck)
  //console.log('DRAWN CARD: ' + drawnCard.name)
  turn = (turn + 1) % players.length
  console.log('TURN: ' + turn)
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
    currentTurn: players[turn]
  })

}

const determineWinner = () => {
  var points = 0
  var leadingSuit = cardField[0].card.suit
  var highest = {
    card: {
      value: 0,
      number: 0
    }
  };
  var tempField = [...cardField]
  
  //cardField.some() checks to see if any of the cards are trump cards
  if (cardField.some(item => item.card.suit === trumpSuit)) { 
    console.log('passed trump test')
    for (var i = 0; i < players.length; i++) {
      // console.log(cardField[i].card.value)
      // console.log(cardField[i].card.number)
      points = points + cardField[i].card.value
      if (cardField[i].card.suit !== trumpSuit) {
        
        tempField.splice(tempField.indexOf(cardField[i]), 1)
        //this has to be changed
      }
    }
  }
  else {
    console.log('passed leading test')
    for (var i = 0; i < players.length; i++) {
      points = points + cardField[i].card.value
      if (cardField[i].card.suit !== leadingSuit) {
        tempField.splice(tempField.indexOf(cardField[i]), 1)
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
    turn = players.indexOf(highest.username)
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
    turn = players.indexOf(highest.username)
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
  turn = (turn + 1) % players.length
  cardField.push(newCard)
  broadcastMessage({
    type: 'SET_GLOBAL_CARD',
    cardField,
    currentTurn: players[turn]
  })
  if (cardField.length === players.length) {
    determineWinner()
  }
}

const clearField = () => {
  cardField = []
  broadcastMessage({
    type: 'FIELD_CLEAR',
    cardField,
  })
}

io.on('connection', (ws) => {
  console.log('Someone has connected');
  
  //broadcastMessage('someone has connected!');
  updateUserCount(1);
  //console.log(ws)
  

  ws.send(JSON.stringify({
    type: 'UPDATE_MESSAGES',
    notes,
  }))
  
  ws.on('message', (messageObject) => {
    //const messageObject = JSON.parse(message);
    //console.log(messageObject.newCard)
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

  ws.on('disconnect', () => {
    //broadcastMessage('someone has disconnected!');
    updateUserCount(-1);
    console.log('someone has disconnected!');
  });

  ws.on('error', (e) => {
    console.log(e);
  });
});

http.listen(port, () => {
  console.log('SHH!')
})
