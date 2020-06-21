import { combineReducers } from 'redux';
import userReducer from './userReducer';
import cardsReducer from './cardsReducer';

export default combineReducers({
  userReducer,
  cardsReducer
});