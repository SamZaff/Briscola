import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Rooms = (username, password) => {
    const [rooms, setRooms] = React.useState([]);
    console.log('username: ' + username.username)
    axios.get('socket/getRooms')
    .then((res) => {
        //console.log(res.data.name)
        setRooms(res.data)
        //console.log('rooms: ' + rooms.name)
    })
    .catch(console.log)
    return (
        <div>
            <div>Rooms:</div>
            <div>
                {/* {Object.keys(rooms).forEach(room => (
                    <div>{room}
                    <button>Join</button>
                    </div>
                    
                ))} */}
                {rooms.map((note, i) => (
                    <div key={i}>
                        <div>{note.name}</div>
                        <button onClick = {() => (<div>TEST!!</div>)}> Join</button>
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
