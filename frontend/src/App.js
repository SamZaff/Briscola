import React from 'react';
import './App.css'
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Briscola from './pages/Briscola';
import Rooms from './pages/Rooms';
import About from './pages/About'
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap'
import helper from './index'

const App = () => {
  return (
    <div className="App">

      <Navbar className="nav-bar">
        <Navbar.Brand className="nav-bar-title">Briscola</Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            {sessionStorage.getItem('username') && (
              <Nav.Link className="nav-bar-content" href="/Rooms" onClick={() => {
                const room = sessionStorage.getItem('room')
                const username = sessionStorage.getItem('username')
                sessionStorage.removeItem('room')
                helper.helper().emit('remove', { room, username })
              }}>Lobby</Nav.Link>
            )}
            <Nav.Link className="nav-bar-content" href="/About" onClick={() => {
              const room = sessionStorage.getItem('room')
              const username = sessionStorage.getItem('username')
              sessionStorage.removeItem('room')
              helper.helper().emit('remove', { room, username })
            }}>Info</Nav.Link>
            {sessionStorage.getItem('username') ? (
              <Nav.Link className="nav-bar-content" href="/" onClick={() => {
                const room = sessionStorage.getItem('room')
                const username = sessionStorage.getItem('username')
                sessionStorage.removeItem('username')
                sessionStorage.removeItem('room')
                helper.helper().emit('remove', { room, username })
              }}>Signout</Nav.Link>
            ) : <Nav.Link className="nav-bar-content" href="/">Login</Nav.Link>}

          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path="/Briscola" component={Briscola} />
        <Route path="/Rooms" component={Rooms} />
        <Route path="/About" component={About} />
        <Route path="/" component={Login} />
      </Switch>
    </div>
  );
}

const mapStateToProps = state => ({
  activeUsers: state.userReducer.activeUsers,
});

export default connect(mapStateToProps)(App);
