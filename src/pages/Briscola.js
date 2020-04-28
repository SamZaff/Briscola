import React from 'react';

import { connect } from 'react-redux';
import { updateHand, toggleCheckWinner, increaseScore } from '../redux/actions/cardsActions'
import { Redirect} from 'react-router-dom';
import helper from '../index'


const Briscola = ({ cards, cardField, hand, players, dispatch, turn, points, checkWinner, score }) => {
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
    if (turn === this.sessionStorage.getItem('username')){
      turn = players[(players.indexOf(turn) + 1)%players.length]
    }
    const data = {
      room: sessionStorage.getItem('room'),
      username: sessionStorage.getItem('username'),
      turn
    };
    // client to server
    //window.ws.send(JSON.stringify(data));
    // helper.helper().emit('message', data)
    helper.helper().emit('remove', data)
    
  }
  
  if (checkWinner) {
    if (turn === sessionStorage.getItem('username')) {
      score += points
    console.log('EARNED POINTS: ' + points)
    console.log('SCORE: ' + score)
    dispatch(increaseScore(score))
    }
    dispatch(toggleCheckWinner(false))
  }

  const handleDraw = () => {
    //console.log(players)
    // hand.push(cards[Math.floor(Math.random() * cards.length)]) //DELETE LATER
   // console.log('cards: ', cards.length)
    hand.push(cards.pop())
    dispatch(updateHand(hand))
    console.log('cards: ', cards)
    console.log(cards[0].suit + "(" + cards[0].name + ")")
    const data = {
      type: 'DRAW_CARD',
      //drawn: hand[hand.length - 1], //DELETE LATER
      //remainingCards: cards, //DELETE LATER
      room: sessionStorage.getItem('room')
    };
    // client to server
    //window.ws.send(JSON.stringify(data));
    helper.helper().emit('message', data)
  };

  const handleSubmit = () => {
    const data = {
      type: 'SEND_MESSAGE',
      newNote: text,
      room: sessionStorage.getItem('room')
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
      room: sessionStorage.getItem('room')
    };
    // client to server
    helper.helper().emit('message', data)
    //window.ws.send(JSON.stringify(data));

  };

  const clearField = () => {
    const data = {
      type: 'CLEAR_FIELD',
      room: sessionStorage.getItem('room')
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
      {/* {(cards === 0 && hand === 0 &&)} */}
      <div>
        <button onClick={() => {
          console.log(turn)
          if ((hand.length < 3) && turn === sessionStorage.getItem('username') && cardField.length === 0) {
            handleDraw()
          }
        }}>
          Draw
        </button>
      </div>
      <div>


        <div>{hand.map((card, i) =>
          <img src={require('../ItalianCards/' + card.name + '.jpg')} width="100" height="207" alt={card.name} onClick={() => {
            if (turn === sessionStorage.getItem('username') && (hand.length === 3 || cards.length < players.length) && cardField.length <= 3) {
              handleCardField({
                username: sessionStorage.getItem('username'),
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
            {cardField.map((card, i) => <img src={require('../ItalianCards/' + card.card.name + '.jpg')} width="200" height="414" alt={card.name} />)}
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
      <div>
        {/* Trump suit: {cards[0].suit} ({cards[0].name}) */}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>

      {!sessionStorage.getItem('username') && (
        <Redirect to ="/"/>
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
  points: state.cardsReducer.points,
  checkWinner: state.cardsReducer.checkWinner,
  score: state.cardsReducer.score
});

export default connect(mapStateToProps)(Briscola);
