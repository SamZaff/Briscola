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

    window.onbeforeunload = function () {
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
            <h4>Join a Room:</h4>

            <div>
                <table className="roomsTable">
                    <tr>
                        <th>Name</th>
                        <th># of Players</th>
                        <th>Status</th>
                    </tr>
                    {rooms.map((room, i) => (
                        <tr key={i}>
                            <td>{room.name}</td>
                            <td>{room.users.length}/4</td>

                            {room.users.length < 4 && room.users.length > 0 && !room.users.some(item => item.username === sessionStorage.getItem('username')) && (

                                <td className="joinable" onClick={() => !modal && joinRoom(room)}><b>Join Now! (Click here)</b></td>

                            )}
                            {room.users.some(item => item.username === sessionStorage.getItem('username')) && (
                                <td className="unjoinable"><b>Already Joined</b></td>
                            )}
                            {room.users.length >= 4 && !room.users.some(item => item.username === sessionStorage.getItem('username')) && (
                                <td className="unjoinable"><b>Full</b></td>
                            )}
                            {room.users.length <= 0 && (
                                <td className="unjoinable"><b>Unavailable</b></td>
                            )}


                        </tr>
                    ))}

                </table>
                {rooms.length < 1 && (
                    <div className="empty">
                        No rooms currently available...
                    </div>
                )}
                <h4>Create a Room:</h4>
                <form>
                    <input className="inputs" type="text" value={newRoom} onChange={e => setNewRoom(e.target.value)} required />
                    <div >
                        <button className="new" onClick={submitRoom}>New Room</button>
                    </div>
                </form>
            </div>
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
                                : <div>
                                    <h3>You were denied access</h3>
                                    <div>
                                    <div style = {{paddingTop: '15px', marginBottom: '15px'}}>
                                    <u >Possible Reasons:</u>
                                    </div>
                                    <ul>
                                        <li>The host declined your request</li>
                                        <li>The room is full</li>
                                        <li>The host left the room</li>
                                        <li>You joined on another tab</li>
                                    </ul>
                                    </div>
                                    </div>}
                                

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
