import React from 'react';

import { connect } from 'react-redux';
import { updateHand } from '../redux/actions/cardsActions'
import { Redirect } from 'react-router-dom';
import helper from '../index'
import '../App.css'


const Briscola = ({ cards, cardField, hand, players, dispatch, turn, checkOverallWinner, trump }) => {
  const [text, setText] = React.useState('');


  // window.onload = function () {
  //   console.log('%c TEST ON LOAD', 'color: green;')
  //   console.log(window.location.pathname)
  //   const data = {
  //     type: 'UPDATE_PLAYERS',
  //     playerList: players,
  //     room: sessionStorage.getItem('room')

  //   };
  //   helper.helper().emit('message', data)

  // }

  window.onbeforeunload = function () {
    console.log('ONBEFOREUNLOAD')
    if (turn.username === this.sessionStorage.getItem('username')) {
      turn = players[(players.indexOf(turn) + 1) % players.length]
    }
    const data = {
      room: sessionStorage.getItem('room'),
      username: sessionStorage.getItem('username'),
      turn
    };
    sessionStorage.removeItem('room')
    // client to server
    // helper.helper().emit('message', data)
    helper.helper().emit('remove', data)

  }

  const handleDraw = () => {
    hand.push(cards.pop())
    dispatch(updateHand(hand))
    const data = {
      type: 'DRAW_CARD',
      room: sessionStorage.getItem('room')
    };
    // client to server
    helper.helper().emit('message', data)
  };

  const handleSubmit = () => {
    const data = {
      type: 'SEND_MESSAGE',
      newNote: text,
      room: sessionStorage.getItem('room')
    };
    // client to server
    helper.helper().emit('message', data)
    setText('');
  };

  const handleCardField = (card) => {
    console.log()
    const data = {
      type: 'SEND_CARD',
      newCard: card,
      room: sessionStorage.getItem('room')
    };
    // client to server
    helper.helper().emit('message', data)

  };

  const clearField = () => {
    const data = {
      type: 'CLEAR_FIELD',
      room: sessionStorage.getItem('room')
    };
    //client to server
    helper.helper().emit('message', data)
  }

  const restartGame = () => {
    const data = {
      type: 'RESTART_GAME',
      room: sessionStorage.getItem('room')
    }
    helper.helper().emit('message', data)
  }

  const getHighestScore = () => {
    var highest = [{username: '', score: 0}];
    var tieCase = []
    for (var i = 0; i < players.length; i++) {
      if (highest[0].score < players[i].score) {
        highest = [players[i]]
        console.log(highest)
      }
      else if (highest[0].score === players[i].score) {
        highest.push(players[i])
        console.log(highest)
      }

    }
    if (highest.length === 1) {
      console.log('HIGHEST: ' + highest[0])
      return highest[0].username
    }
    else {
      console.log('WE HAVE A TIE!')
      for (var j = 0; j < highest.length; j++) {
        tieCase.push(highest[j].username)
      }
      return tieCase.join(' & ')
    }
  }

  return (
    <div>
      <div>
        {!sessionStorage.getItem('username') && (
          <Redirect to="/" />
        )}
      </div>
      <h1>Briscola</h1>
      <div>
        {players && (
          <div>
            Current Players:
            {players.map((player, i) =>
              <div>{player.username}'s score:{player.score}</div>
            )}
            {players.length === 1 && (
              <h3> <b>Waiting for players...</b></h3>
            )}
            <div>Trump suit: {trump.suit} ({trump.name})</div>
          </div>
        )}

      </div>
      
      <div>
        {cards.length > 0 && turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 && players.length > 1 &&(
          <button onClick={() => {

            //if ((hand.length < 3) && turn.username === sessionStorage.getItem('username') && cardField.length === 0) {
              handleDraw()
            //}
          }}>
            Draw
          </button>
        )}

      </div>
      <div>
        {checkOverallWinner && (
          <div>
            <h2>{getHighestScore()} Wins!</h2>
            <button onClick = {() => restartGame()}>Play Again</button>
          </div>
        )}
      </div>
      <div>


        <div >{hand.map((card, i) =>
          // <div id = "playerHand"> 
          <img src={require('../ItalianCards/' + card.name + '.jpg')} width="100" height="207" alt={card.name} onClick={() => {
            if (turn.username === sessionStorage.getItem('username') && (hand.length === 3 || cards.length < players.length) && cardField.length <= 3) {
              handleCardField({
                username: sessionStorage.getItem('username'),
                card: card
              })
              hand.splice(i, 1)
            }
            else {
              console.log('TURN: ' + turn.username)
              console.log('HAND SIZE: ' + hand.length)
              console.log('FIELD SIZE: ' + cardField.length)
            }
          }
          } />
          // </div>
        )}</div>


      </div>

      <div>
        {cardField && (
          <div>
            {cardField.map((card, i) => <img src={require('../ItalianCards/' + card.card.name + '.jpg')} width="200" height="414" alt={card.name} />)}
          </div>
        )}

      </div>

      <div>
        {(cardField.length === players.length && cardField.length !== 0) && (
          <div>
            <button onClick={() => {
              clearField()
            }}>Clear</button>
          </div>
        )}
      </div>

      <div>
        {/* {cards.map((card, i) => <img src={require('../ItalianCards/' + card.name + '.jpg')} width="100" height="207" />)} */}
        Cards left in deck: {cards.length}
      </div>

      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>

      {!sessionStorage.getItem('username') && (
        <Redirect to="/" />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  notes: state.notesReducer.notes,
  cards: state.cardsReducer.cards,
  cardField: state.cardsReducer.cardField,
  hand: state.cardsReducer.hand,
  players: state.userReducer.players,
  turn: state.cardsReducer.turn,
  checkOverallWinner: state.cardsReducer.checkOverallWinner,
  trump: state.cardsReducer.trump
});

export default connect(mapStateToProps)(Briscola);
