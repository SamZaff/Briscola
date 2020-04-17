import React from 'react';

import { connect } from 'react-redux';
import { updateHand, toggleCheckWinner, increaseScore } from '../redux/actions/cardsActions'
import { Redirect} from 'react-router-dom';
import helper from '../socket-client'


const Briscola = ({ cards, cardField, hand, isLoggedIn, players, dispatch, turn, username, points, checkWinner, score }) => {
  const [text, setText] = React.useState('');
  window.onload = function () {
    console.log('%c TEST ON LOAD', 'color: green;')
    console.log(window.location.pathname)
    
  }
  
  window.onbeforeunload = function () {
    console.log('ONBEFOREUNLOAD')
    players.splice(players.indexOf(username), 1)
    const data = {
      type: 'UPDATE_PLAYERS',
      playerList: players,

    };
    // client to server
    //window.ws.send(JSON.stringify(data));
    helper.helper().emit('message', data)
  }
  
  if (checkWinner) {
    if (turn === username) {
      score += points
    console.log('EARNED POINTS: ' + points)
    console.log('SCORE: ' + score)
    dispatch(increaseScore(score))
    }
    dispatch(toggleCheckWinner(false))
  }

  const handleDraw = () => {
    hand.push(cards[Math.floor(Math.random() * cards.length)])
    dispatch(updateHand(hand))
    
    const data = {
      type: 'DRAW_CARD',
      drawn: hand[hand.length - 1],
      remainingCards: cards
    };
    // client to server
    //window.ws.send(JSON.stringify(data));
    helper.helper().emit('message', data)
  };


  const handleSubmit = () => {
    const data = {
      type: 'SEND_MESSAGE',
      newNote: text,

    };
    // client to server
    //window.ws.send(JSON.stringify(data));
    helper.helper().emit('message', data)
    setText('');
  };

  const handleCardField = (card) => {
    console.log()
    const data = {
      type: 'SEND_CARD',
      newCard: card,
      remainingCards: cards
    };
    // client to server
    helper.helper().emit('message', data)
    //window.ws.send(JSON.stringify(data));

  };

  const clearField = () => {
    const data = {
      type: 'CLEAR_FIELD'
    };
    //client to server
    helper.helper().emit('message', data)
    //window.ws.send(JSON.stringify(data))
  }

  return (
    <div>
      <div>
        Score: {score}
      </div>
      <div>
        {!sessionStorage.getItem('username') && (
          <Redirect to="/" />
        )}
      </div>
      <div>
        {players && (
          <div>
            Current Players:
              {players.map((card, i) =>
              <div>{card}</div>
            )}
          </div>
        )}

      </div>
      <h2>Briscola</h2>
      <div>
        <button onClick={() => {
          console.log('username: ' + username)
          if ((hand.length < 3) && turn === username && cardField.length === 0) {
            handleDraw()
          }
        }}>
          Draw
        </button>
      </div>
      <div>


        <div>{hand.map((card, i) =>
          <img src={require('../ItalianCards/' + card.name + '.jpg')} width="100" height="207" onClick={() => {
            if (turn === username && (hand.length === 3 || cards.length < players.length) && cardField.length <= 3) {
              handleCardField({
                username: username,
                card: card
              })
              //NOTE TO FUTURE SELF: you may be able to change the above line to JSON data, that 
              //                     contains both the card and the username
              hand.splice(i, 1)
            }
            else {
              console.log('TURN: ' + turn)
              console.log('HAND SIZE: ' + hand.length)
              console.log('FIELD SIZE: ' + cardField.length)
            }
          }
          } />
        )}</div>


      </div>

      <div>
        {cardField && (
          <div>
            {cardField.map((card, i) => <img src={require('../ItalianCards/' + card.card.name + '.jpg')} width="200" height="414" />)}
          </div>
        )}

      </div>

      <div>
          {(cardField.length === players.length && cardField.length !== 0) && (
            <div>
              <button onClick = {() => {
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
    </div>
  );
};

const mapStateToProps = state => ({
  notes: state.notesReducer.notes,
  cards: state.cardsReducer.cards,
  cardField: state.cardsReducer.cardField,
  hand: state.cardsReducer.hand,
  isLoggedIn: state.userReducer.isLoggedIn,
  players: state.userReducer.players,
  username: state.userReducer.username,
  turn: state.cardsReducer.turn,
  points: state.cardsReducer.points,
  checkWinner: state.cardsReducer.checkWinner,
  score: state.cardsReducer.score
});

export default connect(mapStateToProps)(Briscola);
