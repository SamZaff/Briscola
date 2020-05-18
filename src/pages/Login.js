import React from 'react';
//import '../App.css'
import { connect } from 'react-redux';
// import {Redirect} from 'react-router-dom'

const Login = () => {

    window.onload = function () {
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('room')
    }

    const submitLoginForm = () => {

        sessionStorage.setItem('username', document.getElementsByName('username')[0].value)
        // document.getElementById('login').submit()
    }

    const submitSignupForm = () => {
        sessionStorage.setItem('username', document.getElementsByName('username')[1].value)
        document.getElementById('signup').submit()
    }

    const passwordCheck = () => {
        if (document.getElementById('password').value !== document.getElementById('password_confirm').value) {
            console.log('IF TEST')
            document.getElementById('password_confirm').setCustomValidity('Passwords Do Not Match')
        }
        else {
            console.log('YEEEEES')
            document.getElementById('password_confirm').setCustomValidity('')
        }
    }

    return (
        <div>
            <h1><u>Login</u></h1>
            <form action="db/check" method="POST">
                <div>
                    <input name="username" type="text" className="inputs" placeholder="Username" required />
                </div>
                <div>
                    <input name="password" type='password' className="inputs" placeholder="Password" required />
                </div>
                <button className="login" id="login" onClick={submitLoginForm}  ><span>Login</span></button>
            </form>
            <div>

                <h2><u>Sign Up</u></h2>
                <form action="db/insertAcc" method="POST" id="signup">
                    <div>
                        <input name="username" type="text" className="inputs" placeholder="Username" required />
                    </div>
                    <div>
                        <input name="password" type='password' className="inputs" id="password" placeholder="Password" onChange={passwordCheck} required />
                    </div>
                    <div>
                        <input name="password_confirm" type='password' className="inputs" id="password_confirm" placeholder="Confirm Password" onChange={passwordCheck} required />
                    </div>
                    <button className="signup" onClick={submitSignupForm}><span>Sign Up</span></button>
                </form>

            </div>
            {/* {sessionStorage.getItem('username') && (
                <Redirect to = "/Rooms"/>
            )} */}
        </div>
    );

}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
    players: state.userReducer.players,
});

export default connect(mapStateToProps)(Login);
