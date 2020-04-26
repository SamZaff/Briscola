import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Briscola from './pages/Briscola';
import Rooms from './pages/Rooms';
import { connect } from 'react-redux';
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';

const App = ({ activeUsers }) => {
  return (
    <div className="App">
      {/* <Navbar>
  <Navbar.Brand href="#home">Briscola</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#link">Link</Nav.Link>
      
    </Nav>
  </Navbar.Collapse>
</Navbar> */}
      <div className="active-users">active users: {activeUsers}</div>
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
