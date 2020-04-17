import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

const Rooms = (username) => {
    window.onload = function () {
        console.log(window.location.pathname)

    }
    const [rooms, setRooms] = React.useState([]);
    //console.log('username: ' + username.username)
    axios.get('socket/getRooms')
        .then((res) => {
            setRooms(res.data)
        })
        .catch(console.log)
    return (
        <div>
            <div>
                {!sessionStorage.getItem('username') && (
                    <Redirect to="/" />
                )}
                <h2>Welcome, {sessionStorage.getItem('username')}</h2>
            </div>
            <div>Rooms:</div>
            <div>
                {rooms.map((room, i) => (
                    <div key={i}>
                        <div>{room.name}</div>
                        <NavLink to={"/Briscola/" + room.name}>Join</NavLink>
                    </div>
                ))}
            </div>
            <form action="socket/Rooms" method="POST">
                <input name="room" type="text" required />
                <button type="submit">New Room</button>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
});

export default connect(mapStateToProps)(Rooms)
