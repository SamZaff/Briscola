import React from 'react';

import { connect } from 'react-redux';
import { updateHand, toggleJoinRequest } from '../redux/actions/cardsActions'
import { Redirect } from 'react-router-dom';
import helper from '../index'
import '../App.css'


const Briscola = ({ cards, cardField, hand, players, dispatch, turn, checkOverallWinner, trump, joinRequest, chat }) => {

  const scrollToBottom = (i) => {
    console.log(document.getElementsByName(i).values)
    // document.getElementsByName(i)[0].scrollIntoView({behavior: "smooth"})
  };


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
    const data = {
      type: 'message',
      message: document.getElementById('chat-input').value,
      username: sessionStorage.getItem('username'),
      room: sessionStorage.getItem('room')
    };
    // client to server
    helper.helper().emit('message', data)
    document.getElementById('chat-input').value = ''
    
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

      <div style={{
        left: 'calc(40%)', width: '20%',
        top: 'calc(5%)', position: 'fixed', textAlign: 'center'
      }}>
        {cards.length > 0 && turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 /*&& players.length > 1*/ ?
          <img src={require('../ItalianCards/CardBacking1.png')} className='deck' id='turn' alt='DECK' onClick={() => handleDraw()} />
          : <img src={require('../ItalianCards/CardBacking1.png')} className='deck' id='notTurn' alt='DECK' onClick={() => getStats()} />}

        {players && (
          <div style={{ marginTop: '-30px' }}>
            {players.length <= 1 ? (
              <h3> <b>Waiting for players...</b></h3>
            ) : (<h3><b>{turn.username}'s turn</b></h3>)}
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

      <div className='winScreen'>
        {checkOverallWinner && (
          <div>
            <h2>{getHighestScore()} Wins!</h2>
            <button style={{ fontSize: 'large' }} onClick={() => restartGame()}>Play Again</button>
          </div>
        )}
      </div>
      <div>
        {players.map((player, j) =>
          <div>
            <b className={`player${j + 1}`} style={{ marginBottom: (j >= 2) ? '200px' : `${-50}px`, textAlign: 'center', width: '270px', marginLeft: (j === 1 || j === 2) ? '-185px' : '0px' }}>
              {player.username === sessionStorage.getItem('username') ? <div>
                <div>You!</div>
                <div>Score: {player.score}</div>
                {/* {cardField.length < players.length && turn.username === sessionStorage.getItem('username') && (
              <h3>Your turn</h3>
            )} */}
              </div> : <div>
                  <div>{player.username}</div>
                  {/* {cardField.length < players.length && turn.username === player.username && (
              <h3>Current turn</h3>
            )} */}
                </div>}
            </b>
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
                filter: turn.username === sessionStorage.getItem('username') ? '' : 'brightness(65%)'
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
            </div>
              :
              <div> {[...Array(player.handLength)].map((item, k) =>
                <img className={`player${j + 1}`} src={require('../ItalianCards/CardBacking1.png')}
                  style={{
                    marginLeft: (j === 0 || j === 3) ? (k) * 90 : -(k) * 90,
                    height: '155px',
                    width: '89px',

                    filter: turn.username === player.username ? '' : 'brightness(65%)'
                  }} alt='deck' />
              )}

              </div>
            }

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
      <div className = "chatbox">
        <div className ='chat-container'>
          <div className ='message'>
            <p><b>Welcome to Briscola!</b></p>
          </div>
          {chat.map((message, i) =>
          <div className = 'message'>
            <p name = {i}><b style = {{color: ['dodgerblue','red','lime','yellow'][
              0
            ]}}>{message.username === sessionStorage.getItem('username') ? 'You' : message.username}</b>: {message.message}</p>
            {scrollToBottom(i)}
            </div>
            
          )}
          
        </div>
        <form className ="send-message-form" onSubmit={(e) => {
          e.preventDefault()
          sendChatMessage()
        }
        }>
          <input autoComplete="off" id = 'chat-input' type="text" placeholder='Type something...'></input>
          <button id="message-submit" type="submit"></button>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  cards: state.cardsReducer.cards,
  cardField: state.cardsReducer.cardField,
  hand: state.cardsReducer.hand,
  players: state.userReducer.players,
  turn: state.cardsReducer.turn,
  checkOverallWinner: state.cardsReducer.checkOverallWinner,
  trump: state.cardsReducer.trump,
  joinRequest: state.cardsReducer.joinRequest,
  chat: state.cardsReducer.chat
});

export default connect(mapStateToProps)(Briscola);
