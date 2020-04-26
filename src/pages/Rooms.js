import React from 'react';
import { connect } from 'react-redux';
import { Redirect} from 'react-router-dom'
import helper from '../index'

const Rooms = (players) => {

    const [rooms, setRooms] = React.useState([]);
    const [newRoom, setNewRoom] = React.useState('');
    const [isRedirect, setIsRedirect] = React.useState(false);
    const [isTaken, setIsTaken] = React.useState(false);
    
    window.onload = function() {
        console.log('onload test')
        helper.helper().emit('getRooms')
        
    }
    
    

    React.useEffect(() => {
        helper.helper().on('sendRooms', rooms => {
            setRooms(rooms)
        })
      }, []);

    const submitRoom = (players) => {
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: newRoom
        }
        console.log(rooms.includes(newRoom))
        if (newRoom !== null && !rooms.includes(newRoom)) {
            helper.helper().emit('submitRoom', data)
            sessionStorage.setItem('room', newRoom)
            setIsRedirect(true)
            
        }
        else if (rooms.includes(newRoom)) {
            console.log('NAME TAKEN')
            setIsTaken(true)
        }
        console.log('this is a test1')
        
    }

    const joinRoom = (room) => {
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: room
        }
        sessionStorage.setItem('room', room)
        helper.helper().emit('joinRoom', data)
        console.log('PLAYERS: ', players)
        setIsRedirect(true)
        //console.log(players)
    }

    
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
                        <div>{room.users.length}/4</div>
                        {room.users.length < 4 && (
                        <button onClick = {() => joinRoom(room.name)}>Join</button>
                        )}
                        {room.users.length >= 4 && (
                        <div> <b>FULL</b> </div>
                        )}
                    </div>
                ))}
            </div>
            <form>
                <input type="text" value = {newRoom} onChange = {e => setNewRoom(e.target.value)}  required />
                <button onClick={submitRoom}>New Room</button>
            </form>
            {isRedirect && (
                <Redirect to = "/Briscola"/>
            )}
            {isTaken && (
                <p color = "red">Room name has already been taken</p>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
    players: state.userReducer.players
});

export default connect(mapStateToProps)(Rooms)
