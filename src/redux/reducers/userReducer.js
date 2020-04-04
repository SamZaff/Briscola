// Creating a reducer

// Step 1 initialize state
const INITIAL_STATE = {
  email: 'temp',
  isLoggedIn: false,
  activeUsers: 0,
  username: '',
  password: '',
  newUsername: '',
  newPassword: '',
  players: [],
};

// Step 2 create listener function
const userReducer = (state = INITIAL_STATE, action) => {
  // Step 3 create switch for action types
  switch (action.type) {
    case 'SET_IS_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      };
    case 'SET_EMAIL':
      return {
        ...state, // spread operator
        // email: state.email,
        // isLoggedIn: state.isLoggedIn,
        email: action.email,
      };
    case 'SET_ACTIVE_USERS':
      return {
        ...state,
        activeUsers: action.activeUsers,
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.username
      }
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.password
      }
    case 'SET_NEW_USERNAME':
      return {
        ...state,
        newUsername: action.newUsername
      }
    case 'SET_NEW_PASSWORD':
      return {
        ...state,
        newPassword: action.newPassword
      }
    case 'UPDATE_PLAYER_LIST':
      return {
        ...state,
        players: action.players
      }
    default:
      return state;
  }
};

// don't forget to export
export default userReducer;
