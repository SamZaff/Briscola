const DEFAULT_STATE = {
  cards: [],
  cardField: [],
  hand: [],
  turn: '',
  checkOverallWinner: false,
  trump: {},
  joinRequest: []
};

const cardsReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_CARDS':
      return {
        ...state,
        cards: action.cards,
      }
    case 'UPDATE_CURRENT_CARD':
      if (action.cardField.length === 0) {
        return {
          ...state,
          cardField: action.cardField
        }
      }
      else {
        return {
          ...state,
          cardField: [action.cardField, ...state.cardField],
          // joinRequest: [...state.joinRequest, action.joinRequest[0]]
        }
      }
    case 'UPDATE_HAND':
      return {
        ...state,
        hand: action.hand,
      }
    case 'UPDATE_TURN':
      return {
        ...state,
        turn: action.turn,
      }
    case 'INCREASE_SCORE':
      return {
        ...state,
        score: action.score,
      }
    case 'CHECK_OVERALL_WINNER':
      return {
        ...state,
        checkOverallWinner: action.checkOverallWinner
      }
    case 'SET_TRUMP_SUIT':
      return {
        ...state,
        trump: action.trump
      }
    case 'TOGGLE_JOIN_REQUEST':
      if (action.joinRequest.length === 0) {
        return {
          ...state,
          joinRequest: action.joinRequest
        }
      }
      else {
        return {
          ...state,
          joinRequest: [...state.joinRequest, action.joinRequest[0]]
        }
      }
    default:
      return state;
  }
};

export default cardsReducer;
