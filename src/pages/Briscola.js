import React from 'react';

import { connect } from 'react-redux';
import { updateHand, toggleJoinRequest } from '../redux/actions/cardsActions'
import { Redirect } from 'react-router-dom';
import helper from '../index'
import '../App.css'


const Briscola = ({ cards, cardField, hand, players, dispatch, turn, checkOverallWinner, trump, joinRequest }) => {

  window.onload = function () {
    sessionStorage.removeItem('room')

  }

  window.onbeforeunload = function () {
    if (turn.username === this.sessionStorage.getItem('username')) {
      turn = players[(players.indexOf(turn) + 1) % players.length]
    }
    const data = {
      room: sessionStorage.getItem('room'),
      username: sessionStorage.getItem('username'),
      turn
    };
    if (sessionStorage.getItem('room')) {
      // client to server
      sessionStorage.removeItem('room')
      helper.helper().emit('remove', data)
    }
    if (joinRequest.length > 0) {
      requestResponse('decline')
    }

  }

  const usersToRespond = () => {
    var temp = [];

    for (var i = 0; i < joinRequest.length; i++) {
      if (!temp.includes(joinRequest[i].username)) {
        console.log(joinRequest[i])
        temp.push(joinRequest[i].username)
      }
    }
    console.log(joinRequest.length)
    return temp.join(' & ')
  }



  const requestResponse = (response) => {
    var data = {
      room: sessionStorage.getItem('room'),
      joinRequest,
      response
    }
    helper.helper().emit('response', data)
    dispatch(toggleJoinRequest([]))
  }

  const handleDraw = () => {
    hand.push(cards.pop())
    dispatch(updateHand(hand))
    const data = {
      room: sessionStorage.getItem('room'),
      username: sessionStorage.getItem('username')
    };
    // client to server
    turn = ''
    helper.helper().emit('drawCard', data)
  };

  const sendChatMessage = () => {
    // const data = {
    //   type: 'SEND_MESSAGE',
    //   newNote: text,
    //   room: sessionStorage.getItem('room')
    // };
    // // client to server
    // helper.helper().emit('message', data)
    // setText('');
    console.log(joinRequest)
    usersToRespond()
  };

  const handleCardField = (card) => {
    const data = {
      newCard: card,
      room: sessionStorage.getItem('room'),
      username: sessionStorage.getItem('username')
    };
    turn = ''
    // client to server
    helper.helper().emit('sendCard', data)

  };

  const clearField = () => {
    const data = {
      room: sessionStorage.getItem('room')
    };
    //client to server
    helper.helper().emit('clearField', data)
  }

  const restartGame = () => {
    const data = {
      room: sessionStorage.getItem('room')
    }
    helper.helper().emit('restartGame', data)
  }

  const getHighestScore = () => {
    var highest = [{ username: '', score: 0 }];
    var tieCase = []
    for (var i = 0; i < players.length; i++) {
      if (highest[0].score < players[i].score) {
        highest = [players[i]]
      }
      else if (highest[0].score === players[i].score) {
        highest.push(players[i])
      }

    }
    if (highest.length === 1) {
      return highest[0].username
    }
    else {
      for (var j = 0; j < highest.length; j++) {
        tieCase.push(highest[j].username)
      }
      return tieCase.join(' & ')
    }
  }

  const getStats = () => {
    console.log(cards.length > 0)
    console.log(turn.username)
    console.log(turn.username === sessionStorage.getItem('username'))
    console.log(hand.length < 3)
    console.log(cardField.length === 0)
  }

  return (
    <div>
      {!sessionStorage.getItem('username') && (
        <Redirect to="/" />
      )}
      <div style={{ top: '75%', position: 'fixed', margin: '0 auto', width: '100%' }}>
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
            <div>Cards left in deck: {cards.length}</div>

            {(cardField.length === players.length && cardField.length !== 0) && (
              <div>
                <button onClick={() => {
                  clearField()
                }}>Clear</button>
              </div>
            )}
          </div>
        )}

      </div>

      <div>
        {cards.length > 0 && turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 /*&& players.length > 1*/ ?
          <img src={require('../ItalianCards/CardBacking1.png')} className='deck' id='turn' alt='DECK' onClick={() => handleDraw()} />
          : <img src={require('../ItalianCards/CardBacking1.png')} className='deck' id='notTurn' alt='DECK' onClick={() => getStats()} />}

      </div>

      <div className = 'winScreen'>
        {checkOverallWinner && (
          <div>
            <h2>{getHighestScore()} Wins!</h2>
            <button onClick={() => restartGame()}>Play Again</button>
          </div>
        )}
      </div>

      <div>
        {players.map((player, j) =>
          <div>
            {player.username === sessionStorage.getItem('username') ? <div >{hand.map((card, i) =>
              <img style={{
                marginLeft: (j === 0 || j === 3) ? (i) * 90 : -(i) * 90,
                animationName: 'drawCard' + (i + 1).toString(),
                filter: turn.username === sessionStorage.getItem('username') ? '' : 'brightness(70%)'
              }} className={`cardFace player${j + 1}`} id="playerHand" src={require('../ItalianCards/' + card.name + '.jpg')} alt={card.name} onClick={() => {
                if (turn.username === sessionStorage.getItem('username') && (hand.length === 3 || cards.length < players.length) && cardField.length <= 3) {
                  handleCardField({
                    username: sessionStorage.getItem('username'),
                    card: card
                  })
                  hand.splice(i, 1)
                }
              }
              } />
            )}
            <div><b>{player.username}</b></div>
            </div>
            
            : <div >
              <div> {[...Array(player.handLength)].map((item, k) =>
              <img className = {`player${j+1}`} src = {require('../ItalianCards/CardBacking1.png')}
              style = {{marginLeft: (j === 0 || j === 3) ? (k) * 90 : -(k) * 90,
                 height: '155px', 
                 width: '89px', 
                 filter: turn.username === player.username ? '' : 'brightness(70%)'}} />
              )}
              
             </div>
             <div><b>{player.username}</b></div>
             </div>}
             
          </div>
        )}
      </div>




      <div>
        {cardField && (
          <div>
            {cardField.map((card, i) => <img style={{ marginLeft: (cardField.length * 45) - ((i + 1) * 90) }} src={require('../ItalianCards/' + card.card.name + '.jpg')} className="cardFace" id="cardField" alt={card.name} />)}
          </div>
        )}

      </div>

      <div>
        {/* {cards.map((card, i) => <img src={require('../ItalianCards/' + card.name + '.jpg')} width="100" height="207" />)} */}

      </div>

      {joinRequest.length > 0 && (
        <div>

          <div className="modal">
            <div className="modal_content">
              <span className="close" onClick={() => requestResponse('decline')} >
                &times;
                                </span>
              <p><b>{usersToRespond()} </b>would like to join. This will restart your current game.</p>
              <div className="btns">
                <button onClick={() => requestResponse('accept')}>Accept</button>
                <button onClick={() => requestResponse('decline')}>Decline</button>
              </div>

            </div>
          </div>
        </div>
      )}

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
  trump: state.cardsReducer.trump,
  joinRequest: state.cardsReducer.joinRequest
});

export default connect(mapStateToProps)(Briscola);
