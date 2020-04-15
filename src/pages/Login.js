import React from 'react';
//import '../App.css'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
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
            <form action="db/check" method="POST">
                <div>Username:
              <input name="username" type="text" required />
                </div>
                <div>Password:
              <input name="password" type='password' required />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                {wrongInfo && (
                    <div>
                        Incorrect username/password
                    </div>
                )}
            </div>
            <div>

                <h2>Sign Up</h2>
                <form action="db/insertAcc" method="POST">
                <div>Username:
              <input name="username" type="text" required />
                </div>
                <div>Password:
              <input name="password" type='password' required />
                </div>
                <button type="submit">Sign Up</button>
            </form>

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
