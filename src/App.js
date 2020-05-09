import React from 'react';
import './App.css'
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Briscola from './pages/Briscola';
import Rooms from './pages/Rooms';
import { connect } from 'react-redux';
import { Navbar, Nav} from 'react-bootstrap'
import helper from './index'
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  window.onerror = function() {
    return (
      <div>
        AN ERROR OCCURED
      </div>
    )
  }

  return (
    <div className="App">
      <div>
        <Navbar bg="dark">
          <Navbar.Brand style={{ color: 'white', fontWeight: 'bold' }}>Briscola</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {sessionStorage.getItem('username') && (
                <Nav.Link href="/Rooms" style={{ color: 'white' } } onClick = {() => {
                  const data = {
                    room: '',
                    username: ''
                  };
                  data.room = Object.assign('', sessionStorage.getItem('room'))
                  data.username = Object.assign('', sessionStorage.getItem('username'))
                  sessionStorage.removeItem('room')
                  helper.helper.emit('remove', data)
                }}>Lobby</Nav.Link>
              )}
              {sessionStorage.getItem('username') && (
                <Nav.Link href="/" style={{ color: 'white', display: 'right' }} onClick = {() => {
                  const data = {
                    room: 'shit',
                    username: 'shit'
                  };
                  data.room = Object.assign([], sessionStorage.getItem('room'))
                  data.username = Object.assign([], sessionStorage.getItem('username'))
                  sessionStorage.removeItem('username')
                  sessionStorage.removeItem('room')
                  helper.helper.emit('remove', data)
                }}>Signout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <Switch>
        <Route path="/Briscola" component={Briscola} />
        <Route path="/Rooms" component={Rooms} />
        <Route path="/" component={Login} />
      </Switch>
    </div>
  );
}

const mapStateToProps = state => ({
  activeUsers: state.userReducer.activeUsers,
});

export default connect(mapStateToProps)(App);
