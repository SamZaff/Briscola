import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Briscola from './pages/Briscola';
import Rooms from './pages/Rooms';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ activeUsers }) => {
  return (
    <div className="App">
      <div>
        <Navbar bg="dark">
          <Navbar.Brand href="#home" style={{ color: 'white', fontWeight: 'bold' }}>Briscola</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {sessionStorage.getItem('username') && (
                <Nav.Link href="/Rooms" style={{ color: 'white' } }>Lobby</Nav.Link>
              )}
              {sessionStorage.getItem('username') && (
                <Nav.Link href="/" style={{ color: 'white', display: 'right' }}>Signout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      {/* <div className="active-users">active users: {activeUsers}</div> */}
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
