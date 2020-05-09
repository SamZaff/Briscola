const DEFAULT_STATE = {
  cards: [],
  cardField: [],
  hand: [],
  turn: '',
  checkOverallWinner: false,
  trump: {}

};

const cardsReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_CARDS':
      return {
        ...state,
        cards: action.cards,
      }
    case 'UPDATE_CURRENT_CARD':
      return {
        ...state,
        cardField: action.cardField,
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
    default:
      return state;
  }
};

export default cardsReducer;
