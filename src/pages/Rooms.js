import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import helper from '../index'
import '../App.css'

const Rooms = (players) => {

    const [rooms, setRooms] = React.useState([]);
    const [newRoom, setNewRoom] = React.useState('');
    const [isRedirect, setIsRedirect] = React.useState(false);
    const [isTaken, setIsTaken] = React.useState(false);
    const [modal, toggleModal] = React.useState(false);

    window.onload = function () {
        console.log('onload test')
        if (sessionStorage.getItem('username')) {
            helper.helper().emit('getRooms')
        }

    }

    React.useEffect(() => {
        if (sessionStorage.getItem('username')) {

            helper.helper().on('sendRooms', rooms => {
                setRooms(rooms)
                console.log(rooms)
            })
        }
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
        console.log(room.users.includes(sessionStorage.getItem('username')))
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: room.name
        }
        sessionStorage.setItem('room', room.name)
        helper.helper().emit('joinRoom', data)
        console.log('PLAYERS: ', players)
        setIsRedirect(true)
    }


    return (
        <div>
            <div>
                {!sessionStorage.getItem('username') && (
                    <Redirect to="/" />
                )}
                <h2 className = "h2">Welcome, {sessionStorage.getItem('username')}</h2>
            </div>
            <div>Rooms:</div>
            <div>
                {rooms.map((room, i) => (
                    <div key={i}>
                        <div>{room.name}</div>
                        <div>{room.users.length}/4</div>
                        {room.users.length < 4 && !room.users.some(item => item.username === sessionStorage.getItem('username')) && (

                            <button onClick={() => joinRoom(room)}>Join</button>
                        )}
                        {room.users.some(item => item.username === sessionStorage.getItem('username')) && (
                            <div> <b> ALREADY JOINED</b> </div>
                        )}
                        {room.users.length >= 4 && (
                            <div> <b>FULL</b> </div>
                        )}
                    </div>
                ))}
            </div>
            <form>
                <input type="text" value={newRoom} onChange={e => setNewRoom(e.target.value)} required />
                <button onClick={submitRoom}>New Room</button>
            </form>
            {!modal && (
                <div>
                    <button onClick={() => toggleModal(true)}>modal test</button>
                </div>
            )}
            {modal && (
                <div>
                    
                    <div className="modal">
                        <div className="modal_content"> 
                            <span className="close" onClick={() => toggleModal(false)} >
                                &times;
                                </span>
                            <a>Waiting for host to accept invite...</a>
                        </div>
                    </div>
                </div>
            )}
            {isRedirect && (
                <Redirect to="/Briscola" />
            )}
            {isTaken && (
                <p color="red">Room name has already been taken</p>
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
