import React from 'react';
import axios from 'axios';

const Rooms = () => {
    const [rooms, setRooms] = React.useState('');
    axios.get('getRooms')
    .then((res) => {
        console.log('axios test')
        setRooms(res.data.rooms)
        console.log(rooms)
    })
    .catch(console.log)
    return (
        <div></div>
    )
}

export default(Rooms)