import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import rootReducer from './redux/reducers/rootReducer';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { updatePlayerList } from './redux/actions/userActions';
import { updateCards, updateTurn, updateCardField, toggleCheckOverallWinner, setTrumpSuit, toggleJoinRequest, updateHand, updateChat } from './redux/actions/cardsActions'
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import socketIOClient from 'socket.io-client'

const socket = socketIOClient()
const store = createStore(rootReducer, applyMiddleware(thunk));

socket.on('update', messageObject => {
    switch (messageObject.type) {
    case 'SET_GLOBAL_CARD':
      store.dispatch(updateCardField(messageObject.cardField))
      store.dispatch(updateTurn(messageObject.currentTurn))
      store.dispatch(updatePlayerList(messageObject.players))
      break;
    case 'SET_REMAINING_CARDS':
      store.dispatch(updateCards(messageObject.remainingCards))
      store.dispatch(updateTurn(messageObject.currentTurn))
      store.dispatch(updatePlayerList(messageObject.players))
      break;
    case 'UPDATE_PLAYER_LIST':
      store.dispatch(updatePlayerList(messageObject.players))
      store.dispatch(updateTurn(messageObject.turn))
      store.dispatch(updateCards(messageObject.cards))
      store.dispatch(setTrumpSuit(messageObject.trump))
      store.dispatch(toggleCheckOverallWinner(false))
      break;
    case 'RESTART_GAME':
      store.dispatch(updatePlayerList(messageObject.players))
      store.dispatch(updateTurn(messageObject.turn))
      store.dispatch(updateCards(messageObject.cards))
      store.dispatch(setTrumpSuit(messageObject.trump))
      store.dispatch(toggleCheckOverallWinner(false))
      store.dispatch(updateCardField(messageObject.cardField))
      store.dispatch(updateHand([]))
      store.dispatch(updateChat(messageObject.message))
      break;
    case 'FIELD_CLEAR':
      store.dispatch(updateCardField(messageObject.cardField))
      break;
    case 'GIVE_POINTS_AND_TURN':
      store.dispatch(updateTurn(messageObject.currentTurn))
      store.dispatch(updatePlayerList(messageObject.updatedScores))
      break;
    case 'FINISH_GAME':
      store.dispatch(toggleCheckOverallWinner(true))
      break;
    case 'RECIEVE_REQUEST':
      store.dispatch(toggleJoinRequest([messageObject.joining]))
      break;
    case 'GET_MESSAGE':
      store.dispatch(updateChat(messageObject.message))
      break;
    case 'CANCEL':
      store.dispatch(toggleJoinRequest([]))
      break;
    default:
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  ,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

function helper() {
  return socket;
}

export default{helper}