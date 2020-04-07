import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient('http://localhost:4000');

function helper() {
    console.log('socket-client test')
    return socket;
}

export default{helper}