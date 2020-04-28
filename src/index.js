import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import rootReducer from './redux/reducers/rootReducer';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { setActiveUsers, updatePlayerList } from './redux/actions/userActions';
import { updateNotes } from './redux/actions/notesActions';
import { updateCards, updateTurn, updateCardField, updatePoints, toggleCheckWinner } from './redux/actions/cardsActions'
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import socketIOClient from 'socket.io-client'

const socket = socketIOClient('http://localhost:4000')
const store = createStore(rootReducer, applyMiddleware(thunk));

socket.on('update', messageObject => {
    console.log(messageObject.type)
    switch (messageObject.type) {
    case 'UPDATE_USER_COUNT':
      store.dispatch(setActiveUsers(messageObject.count));
      break;
    case 'UPDATE_MESSAGES':
      store.dispatch(updateNotes(messageObject.notes))
      // put it here
      break;
    case 'SET_GLOBAL_CARD':
      store.dispatch(updateCardField(messageObject.cardField))
      store.dispatch(updateTurn(messageObject.currentTurn))
      //store.dispatch(updateCards(messageObject.remainingCards))
      break;
    case 'SET_REMAINING_CARDS':
      store.dispatch(updateCards(messageObject.remainingCards))
      store.dispatch(updateTurn(messageObject.currentTurn))
      break;
    case 'UPDATE_PLAYER_LIST':
      console.log('welp, this better print OR ELSE')
      store.dispatch(updatePlayerList(messageObject.players))
      store.dispatch(updateTurn(messageObject.turn))
      store.dispatch(updateCards(messageObject.cards))
      break;
    case 'FIELD_CLEAR':
      store.dispatch(updateCardField(messageObject.cardField))
      break;
    case 'GIVE_POINTS_AND_TURN':
      store.dispatch(updateTurn(messageObject.currentTurn))
      store.dispatch(updatePoints(messageObject.points))
      store.dispatch(toggleCheckWinner(true))
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
  console.log('socket-client test')
  return socket;
}

export default{helper}