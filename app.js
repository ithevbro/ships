const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const rooms = {};

function generateRoomId() {
    return Math.random().toString(36).substr(2, 6);
}

app.use(express.static('./public'))
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    io.emit('users', io.engine.clientsCount);
    let roomId;
    for (const id in rooms) {
        if (rooms[id].players.length < 2 && rooms[id].readyCount !== 2) {
            roomId = id;
            break;
        }
    }

    if (!roomId) {
        roomId = generateRoomId();
        rooms[roomId] = { players: [], readyCount: 0 };
    }

    rooms[roomId].players.push(socket.id);
    socket.join(roomId);

    socket.on('ready', () => {
        rooms[roomId].readyCount++;
    });

    socket.on('move', (move) => {
        if (rooms[roomId].readyCount == 2) {
            socket.to(roomId).emit('move', move);
        }
    });

    socket.on('disconnect', () => {
        io.emit('users', io.engine.clientsCount);
        const index = rooms[roomId].players.indexOf(socket.id);
        if (index !== -1) {
            rooms[roomId].players.splice(index, 1);
            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId];
            } else {
                io.to(roomId).emit('opponentLeft');
            }
        }
        console.log(rooms);
    });
    console.log(rooms);
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});