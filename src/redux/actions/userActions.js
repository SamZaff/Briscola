import axios from 'axios'
import md5 from 'md5'

export const setEmail = email => ({ // 1 param = no parentheses
  type: 'SET_EMAIL',
  email,
  // email: email,
});

export const setIsLoggedIn = isLoggedIn => ({
  type: 'SET_IS_LOGGED_IN',
  isLoggedIn,
});

export const setActiveUsers = activeUsers => ({
  type: 'SET_ACTIVE_USERS',
  activeUsers,
});

export const setUsername = username => ({
  type: 'SET_USERNAME',
  username
});

export const setPassword = password => ({
  type: 'SET_PASSWORD',
  password
});

export const setNewUsername = newUsername => ({
  type: 'SET_NEW_USERNAME',
  newUsername
});

export const setNewPassword = newPassword => ({
  type: 'SET_NEW_PASSWORD',
  newPassword
});

export const updatePlayerList = players => ({
  type: 'UPDATE_PLAYER_LIST',
  players
});



export const verify = (username, password) => (dispatch, getState) => {
  const username = getState().userReducer.username;
  const password = getState().userReducer.password;
  // getState().userReducer.isLoggedIn = true;
  // console.log('logged in? ' + getState().userReducer.isLoggedIn)
  console.log(password);
  console.log(username)
  console.log('USER ACTION TEST')
  axios.get(`db/check?username=${username}&password=${md5(password)}`)
    .then((res) => {
      console.log('VALID?: ' + res.data.valid)
      if (res.data.valid) {
        console.log('REALLY VALID?: ' + res.data.valid)
        dispatch(setIsLoggedIn(true))
        dispatch(setUsername(username))
      }
    })
    .catch(console.log);

}

export const addAccount = () => (dispatch, getState) => {
  const username = getState().userReducer.newUsername;
  const password = getState().userReducer.newPassword;
  console.log(password);
  console.log(username)
  axios.get(`db/insertAcc?username=${username}&password=${md5(password)}`)
    .then((res) => {
      if (res.data.valid) {
        dispatch(setIsLoggedIn(true))
        dispatch(setUsername(username))
        dispatch(setNewUsername(''))
        dispatch(setNewPassword(''))
      }
    })
    .catch(console.log);

}