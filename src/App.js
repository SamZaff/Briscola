import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Briscola from './pages/Briscola';
import Rooms from './pages/Rooms';
import { connect } from 'react-redux';

const App = ({ activeUsers }) => {
  return (
    <div className="App">
      <div className="active-users">active users: {activeUsers}</div>
      <Switch>
        <Route path="/Briscola" component={Briscola} />
        <Route path ="/Rooms" component = {Rooms} />
        <Route path="/" component={Login} />
      </Switch>
    </div>
  );
}

const mapStateToProps = state => ({
  activeUsers: state.userReducer.activeUsers,
});

export default connect(mapStateToProps)(App);
