import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link, NavLink } from 'react-router-dom'
import helper from '../index'

const Rooms = () => {

    const [rooms, setRooms] = React.useState([]);
    const [newRoom, setNewRoom] = React.useState('');
    const [isRedirect, setIsRedirect] = React.useState(false);
    
    window.onload = function() {
        console.log('onload test')
        helper.helper().emit('getRooms')
        
    }
    
    // helper.helper().on('sendRooms', rooms => {
    //     setRooms(rooms)
    // })

    const submitRoom = () => {
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: newRoom
        }
        if (newRoom !== null) {
            helper.helper().emit('submitRoom', data)
            sessionStorage.setItem('room', newRoom)
            setIsRedirect(true)
            
        }
        console.log('this is a test')
        
    }

    const joinRoom = (room) => {
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: room
        }
        helper.helper().emit('joinRoom', data)
        console.log('this is a test')
        setIsRedirect(true)
    }

    
    // axios.get('socket/getRooms')
    //     .then((res) => {
    //         setRooms(res.data)
    //     })
    //     .catch(console.log)
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
                        <button onClick = {joinRoom(room.name)}>Join</button>
                    </div>
                ))}
            </div>
            <form>
                <input type="text" value = {newRoom} onChange = {e => setNewRoom(e.target.value)}  required />
                {/* <button >New Room</button> */}
                <button onClick={submitRoom}>New Room</button>
            </form>
            {isRedirect && (
                <Redirect to = "/Briscola"/>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
});

export default connect(mapStateToProps)(Rooms)
