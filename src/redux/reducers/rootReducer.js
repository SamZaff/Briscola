import { combineReducers } from 'redux';
import notesReducer from './notesReducer';
import userReducer from './userReducer';
import cardsReducer from './cardsReducer';

export default combineReducers({
  notesReducer,
  userReducer,
  cardsReducer
});