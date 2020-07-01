import React from 'react';

import { connect } from 'react-redux';
import { updateHand, toggleJoinRequest, updateTurn } from '../redux/actions/cardsActions'
import { Redirect } from 'react-router-dom';
import helper from '../index'
import '../App.css'


const Briscola = ({ cards, cardField, hand, players, dispatch, turn, checkOverallWinner, trump, joinRequest, chat }) => {

  var end = React.useRef(null)

  const scrollToBottom = () => {
    end.current.scrollIntoView({ behavior: "smooth" })
  };

  React.useEffect(scrollToBottom, [chat])

  // React.useEffect(() => {
  //   if (cards.length > 0 && turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 && players.length > 1) {
  //     handleDraw()
  //     console.log('DRAWING!!')
  //     // turn = ''
  //   }
  //   else {
  //     console.log('WHYYYYY')
  //   }
  // }, []);

  window.onload = function () {
    sessionStorage.removeItem('room')

  }

  // window.addEventListener('beforeunload', (event) => {
  //   requestResponse('decline')
  //   event.preventDefault()
  //   event.returnValue = ''
  // })

  const usersToRespond = () => {
    var temp = [];

    for (var i = 0; i < joinRequest.length; i++) {
      if (!temp.includes(joinRequest[i].username)) {
        temp.push(joinRequest[i].username)
      }
    }
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
    dispatch(updateTurn(''))
    console.log('turn: ', turn)
    // client to server
    // setTimeout(() => {
    helper.helper().emit('drawCard', data)
    // }, 2000);
  };

  const sendChatMessage = () => {
    const data = {
      type: 'message',
      message: document.getElementById('chat-input').value,
      username: sessionStorage.getItem('username'),
      room: sessionStorage.getItem('room'),
      color: document.getElementById('chat-color').value
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



  return (
    <div className>
      {!sessionStorage.getItem('username') && (
        <Redirect to="/" />
      )}

      <div style={{
        margin: 'auto',
        textAlign: 'center',
        paddingTop: '1%'
      }}>
        {/* {cards.length > 0 && turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 && players.length > 1 && handleDraw()} */}

        {cards.length > 0 && trump.name &&
          <div style={{ position: 'relative' }}>
            {turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 && players.length > 1 ?
              <img src={require('../ItalianCards/CardBacking1.png')} className='deck' id='turn' alt='DECK' onClick={() => {
                handleDraw()
              }} />
              : <img src={require('../ItalianCards/CardBacking1.png')} className='deck' id='notTurn' alt='DECK' />}

          </div>}


      </div>

      <div className="turn-state">
        {trump.name && cards.length > 0 && <img src={require('../ItalianCards/' + trump.name + '.jpg')} className='card-face' alt='trump.name'></img>}
        {players && (
          <div>
            {players.length <= 1 ? (
              <h3> <b>Waiting for players...</b></h3>
            ) : (<div> {cardField.length !== players.length && (
              <h3 style={{ padding: '0' }}><b>{turn.username}'s turn</b></h3>)}</div>)}
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
                {/* {player.username === turn.username && <p><b>Your turn</b></p>} */}
              </div> : <div>
                  <div>{player.username}</div>

                </div>}
            </b>
          </div>
        )}
      </div>
      <div>
        {players.map((player, j) =>
          <div>
            {player.username === sessionStorage.getItem('username') ? <div>{hand.map((card, i) =>
              <img style={{
                marginLeft: (j === 0 || j === 3) ? (i) * 71 : -(i) * 71,
                animationName: 'drawCard' + (i + 1).toString(),
                filter: turn.username === sessionStorage.getItem('username') ? '' : 'brightness(75%)'
              }} className={`card-face player${j + 1}`} id="playerHand" src={require('../ItalianCards/' + card.name + '.jpg')} alt={card.name} onClick={() => {
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
                    marginLeft: (j === 0 || j === 3) ? (k) * 71 : -(k) * 71,
                    height: '122px',
                    width: '70px',

                    filter: turn.username === player.username ? '' : 'brightness(75%)'
                  }} alt='deck' />
              )}

              </div>
            }

          </div>
        )}
      </div>

      <div>
      {/* {cards.length > 0 && turn.username === sessionStorage.getItem('username') && hand.length < 3 && cardField.length === 0 && players.length > 1 && handleDraw()} */}
        {cardField && (
          <div>
            {cardField.map((card, i) => <img style={{ marginLeft: (cardField.length * 35) - ((i + 1) * 71) }} src={require('../ItalianCards/' + card.card.name + '.jpg')} className="card-face" id="cardField" alt={card.name} />)}
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
      <div className="chatbox">
        <div className='chat-toggler' onClick={() => {
          document.getElementsByClassName('chat-container')[0].style.height = document.getElementsByClassName('chat-container')[0].style.height === "45px" ? "225px" : "45px"
          document.getElementsByClassName('chat-toggler')[0].style.transform = document.getElementsByClassName('chat-toggler')[0].style.transform === 'rotate(180deg)' ? 'rotate(360deg)' : 'rotate(180deg)'

        }}>▲</div>
        <div className='chat-container'>

          <div className='message'>
            <p><b>Welcome to Briscola!</b></p>
          </div>
          {chat.map((message, i) =>
            <div className='message'>
              <p name={i} style = {{fontStyle: message.username ? '' : 'italic'}}><b style={{ color: message.color }}>{message.username ? (message.username === sessionStorage.getItem('username') ? 'You:' : message.username+':') : ''}</b> {message.message}</p>
            </div>

          )}
          <div ref={end}></div>
        </div>
        <form className="send-message-form" onSubmit={(e) => {
          e.preventDefault()
          sendChatMessage()
          scrollToBottom()
        }
        }>
          <input autoComplete="off" id='chat-input' type="text" placeholder='Type something...'></input>
          <input type="color" id='chat-color' defaultValue='#1e90ff'></input>
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
