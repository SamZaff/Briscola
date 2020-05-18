import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import helper from '../index'
import '../App.css'
import ReactLoading from 'react-loading'

const Rooms = () => {

    const [rooms, setRooms] = React.useState([]);
    const [newRoom, setNewRoom] = React.useState('');
    const [chosenRoom, setChosenRoom] = React.useState('');
    const [isRedirect, setIsRedirect] = React.useState(false);
    const [modal, toggleModal] = React.useState(false);
    const [rejected, setRejected] = React.useState(false);

    window.onload = function () {
        sessionStorage.removeItem('room')
        if (sessionStorage.getItem('username')) {
            helper.helper().emit('getRooms')
        }

    }

    window.onbeforeunload = function() {
        if (!rejected && modal) {
            helper.helper().emit('cancel', chosenRoom)
        }
    }

    React.useEffect(() => {
        if (sessionStorage.getItem('username')) {

            helper.helper().on('sendRooms', rooms => {
                setRooms(rooms)
            })

            helper.helper().on('accept', (roomName) => {
                var data = {
                    username: sessionStorage.getItem('username'),
                    roomName
                }
                helper.helper().emit('joinRoom', data)
                setIsRedirect(true)
            })

            helper.helper().on('decline', () => {
                // toggleModal(false)
                setRejected(true)
            })
        }
    }, []);

    const submitRoom = () => {
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: newRoom
        }
        if (newRoom !== '' && !rooms.some(room => room.name === newRoom)) {

            helper.helper().emit('submitRoom', data)
            sessionStorage.setItem('room', newRoom)
            setIsRedirect(true)

        }

    }

    const joinRoom = (room) => {
        setChosenRoom(room.name)
        var data = {
            username: sessionStorage.getItem('username'),
            roomName: room.name
        }
        sessionStorage.setItem('room', room.name)
        helper.helper().emit('joinRequest', data)
        toggleModal(true)
    }

    return (
        <div>
            <div>
                {!sessionStorage.getItem('username') && (
                    <Redirect to="/" />
                )}
                <h2 className="h2">Welcome, {sessionStorage.getItem('username')}</h2>
            </div>
            <h4>Rooms:</h4>
            {!modal && (
                <div>
                    {rooms.map((room, i) => (
                        <div key={i}>
                            {room.users.length > 0 && (
                                <div>
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
                            )}

                        </div>
                    ))}
                    <form>
                        <input type="text" value={newRoom} onChange={e => setNewRoom(e.target.value)} required />
                        <button onClick={submitRoom}>New Room</button>
                    </form>
                </div>
            )}
            {modal && (
                <div>

                    <div className="modal">
                        <div className="modal_content">
                            <span className="close" onClick={() => {
                                if (!rejected) {
                                    helper.helper().emit('cancel', chosenRoom)
                                }
                                sessionStorage.removeItem('room')
                                setRejected(false)
                                toggleModal(false)

                            }} >
                                &times;
                                </span>
                            <p>Waiting for host to accept invite...</p>
                            {!rejected ? <ReactLoading type='bars' className="centered" />
                                : <b>You were denied access</b>}

                        </div>
                    </div>
                </div>
            )}
            {isRedirect && (
                <Redirect to="/Briscola" />
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
