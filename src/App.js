import React from 'react';
import './App.css'
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Briscola from './pages/Briscola';
import Rooms from './pages/Rooms';
import { connect } from 'react-redux';
import { Navbar, Nav} from 'react-bootstrap'
import helper from './index'
// import 'bootstrap/dist/css/bootstrap.min.css';

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
      
        <Navbar className = "nav-bar">
          <Navbar.Brand className = "nav-bar-title">Briscola</Navbar.Brand>
          <Navbar.Collapse>
            <Nav>
              {sessionStorage.getItem('username') && (
                <Nav.Link className = "nav-bar-content" href="/Rooms" style={{ color: 'white' } } onClick = {() => {
                  // const data = {
                  //   room: '',
                  //   username: ''
                  // };
                  const room = sessionStorage.getItem('room')
                  const username = sessionStorage.getItem('username')
                  sessionStorage.removeItem('room')
                  helper.helper().emit('remove', {room, username})
                }}>Lobby</Nav.Link>
              )}
              {sessionStorage.getItem('username') && (
                <Nav.Link className = "nav-bar-content" href="/" style={{ color: 'white', display: 'right' }} onClick = {() => {
                  // const data = {
                  //   room: '',
                  //   username: ''
                  // };
                  const room = sessionStorage.getItem('room')
                  const username = sessionStorage.getItem('username')
                  sessionStorage.removeItem('username')
                  sessionStorage.removeItem('room')
                  helper.helper().emit('remove', {room, username})
                }}>Signout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      
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
