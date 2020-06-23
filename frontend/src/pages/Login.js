import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios'

const Login = () => {

    window.onload = function () {
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('room')
    }

    const submitLoginForm = () => {
        axios.post('/check', {
            username: document.getElementsByName('username')[0].value,
            password: document.getElementsByName('password')[0].value

        })
            .then((res) => {
                console.log('then test')
                if (res.data.valid) {
                    console.log('account found')
                    sessionStorage.setItem('username', document.getElementsByName('username')[0].value)
                    window.location.href = '/Rooms'
                }
                else {
                    document.getElementsByName('username')[0].setCustomValidity('Username or password is incorrect')
                    console.log('account not found')
                }
            })
            .catch(e => {
                console.log(e)
            })
        sessionStorage.setItem('username', document.getElementsByName('username')[0].value)
    }

    const submitSignupForm = () => {
        if (document.getElementsByName('password')[1].value === document.getElementsByName('password_confirm')[0].value) {
            if (document.getElementsByName('password')[1].value.length > 0 && document.getElementsByName('password_confirm')[0].value.length > 0 && document.getElementsByName('username')[1].value.length > 0) {
                axios.post('/insertAcc', {
                    username: document.getElementsByName('username')[1].value,
                    password: document.getElementsByName('password')[1].value,

                })
                    .then((res) => {
                        console.log('then test')
                        if (res.data.valid) {
                            console.log('account added')
                            sessionStorage.setItem('username', document.getElementsByName('username')[1].value)
                            window.location.href = '/Rooms'
                        }
                        else {
                            console.log('account exists')
                            document.getElementsByName('username')[1].setCustomValidity('Account already exists')
                        }
                    })
                    .catch(console.log('something went wrong!'))
            }
        }
        else {
            document.getElementsByName('password')[1].setCustomValidity('Passwords do not match')
        }
    }

    const passwordValidate = () => {
        document.getElementById('password').value.includes(' ') ? document.getElementById('password').setCustomValidity('Password can\'t contain Spaces') : document.getElementById('password').setCustomValidity('')
    }

    const passwordCheck = () => {
        if (document.getElementById('password').value !== document.getElementById('password_confirm').value) {
            document.getElementById('password_confirm').setCustomValidity('Passwords Do Not Match')
        }
        else {
            document.getElementById('password_confirm').setCustomValidity('')
        }
    }

    return (
        <div>
            <div>
                <h1><u>Login</u></h1>
                <form onSubmit={e => e.preventDefault()}>
                    <div>
                        <input name="username" autoComplete="off" type="text" className="inputs" placeholder="Username" required />
                    </div>
                    <div>
                        <input name="password" type='password' className="inputs" placeholder="Password" required />
                    </div>
                    <button className="login" id="login" onClick={submitLoginForm}  ><span>Login</span></button>
                </form>
            </div>
            <div>

                <h2><u>Sign Up</u></h2>
                <form onSubmit={e => e.preventDefault()}>
                    <div>
                        <input name="username" autoComplete="off" type="text" className="inputs" placeholder="Username" required />
                    </div>
                    <div>
                        <input name="password" type='password' className="inputs" id="password" placeholder="Password" onChange={() => {
                            passwordCheck()
                            passwordValidate()
                        }} required />
                    </div>
                    <div>
                        <input name="password_confirm" type='password' className="inputs" id="password_confirm" placeholder="Confirm Password" onChange={passwordCheck} required />
                    </div>
                    <button className="signup" onClick={submitSignupForm}><span>Sign Up</span></button>
                </form>

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
