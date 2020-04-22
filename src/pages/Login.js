import React from 'react';
//import '../App.css'
import { connect } from 'react-redux';

const Login = ({ dispatch }) => {
    const [wrongInfo, setWrongInfo] = React.useState(false);
    const [existingAccount, setExistingAccount] = React.useState(false)


    window.onload = function () {
        console.log('%c TEST ON LOAD', 'color: orange;')
        // const data = {
        //     type: 'GET_PLAYERS',
        // };
        // // client to server

    }
    
    const submitLoginForm = () => {
        sessionStorage.setItem('username', document.getElementsByName('username')[0].value)
        document.getElementsByTagName('form')[0].submit()
    }

    const submitSignupForm = () => {
        sessionStorage.setItem('username', document.getElementsByName('username')[1].value)
        document.getElementsByTagName('form')[1].submit()
    }


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
                <button onClick = {submitLoginForm} >Login</button>
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
                    <button onClick = {submitSignupForm}>Sign Up</button>
                </form>

            </div>
            <div>
                {existingAccount && (
                    <div>
                        Username already exists
                    </div>
                )}
            </div>
        </div>
    );

}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
    players: state.userReducer.players,
});

export default connect(mapStateToProps)(Login);
