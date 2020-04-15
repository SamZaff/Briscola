import React from 'react';
//import '../App.css'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUsername, setPassword, setNewPassword, setNewUsername, verify, addAccount } from '../redux/actions/userActions';
import helper from '../socket-client'


const Login = ({ username, password, isLoggedIn, dispatch, newUsername, newPassword, players }) => {
    const [wrongInfo, setWrongInfo] = React.useState(false);
    const [existingAccount, setExistingAccount] = React.useState(false);
    
    window.onload = function () {
        console.log('%c TEST ON LOAD', 'color: orange;')
        const data = {
            type: 'GET_PLAYERS',
        };
        // client to server
        
        helper.helper().emit('message', data)
        //console.log(players)
        //window.ws.send(JSON.stringify(data));
    }

    const updatePlayers = () => {

        const data = {
            type: 'UPDATE_PLAYERS',
            playerList: players,

        };
        // client to server
        console.log('UPDATE PLAYERS')
        helper.helper().emit('message', data)
        //window.ws.send(JSON.stringify(data));
        console.log('USERNAME!: ' + username)
        console.log(players)
    };

    return (
        <div>
            <h1>Login</h1>
            <div>Username:
              <input onChange={e => dispatch(setUsername(e.target.value))} value={username} />
            </div>
            <div>Password:
              <input type='password' onChange={e => dispatch(setPassword(e.target.value))} value={password} />
            </div>
            <button onClick={() => {
                //if (!players.includes(username)) {
                    dispatch(verify(username, password))
                    console.log(isLoggedIn)
                    if (!isLoggedIn) {
                        setWrongInfo(true);
                    }
                    // else {

                    players.push(username)
                    console.log('PLAYERS: ' + players)
                    updatePlayers();
                    // }
                //}

            }} > Log In</button>
            <div>
                {wrongInfo && (
                    <div>
                        Incorrect username/password
                    </div>
                )}
            </div>
            <div>
                
                <h2>Sign Up</h2>
                <div>Username:
              <input onChange={e => dispatch(setNewUsername(e.target.value))} value={newUsername} />
                </div>
                <div>Password:
              <input type='password' onChange={e => dispatch(setNewPassword(e.target.value))} value={newPassword} />
                </div>
                <button onClick={() => {
                    dispatch(addAccount())
                    console.log(newUsername)
                    console.log(username)
                    if (!isLoggedIn) {
                        setExistingAccount(true)
                    }
                    //else {
                    players.push(newUsername)
                    updatePlayers()
                     //   }
                }} > Sign Up</button>
                
            </div>
            <div>
                {existingAccount && (
                    <div>
                        Username already exists
                    </div>
                )}
            </div>
            <div>
                {isLoggedIn && (
                    <Redirect to="/Rooms" />
                )}
            </div>
        </div>
    );

}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
    isLoggedIn: state.userReducer.isLoggedIn,
    players: state.userReducer.players,
});

export default connect(mapStateToProps)(Login);
