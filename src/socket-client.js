import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient();

function helper() {
    console.log('socket-client test')
    return socket;
}

export default{helper}