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
    let roomId;
    io.emit('users', io.engine.clientsCount);
    socket.on('ready', (data) => {
        for (const id in rooms) {
            if (rooms[id].players.length < 2 && rooms[id].readyCount !== 2) {
                roomId = id;
                break;
            }
        }
        if (!roomId) {
            roomId = generateRoomId();
            rooms[roomId] = { players: [], readyCount: 0, data: [], idData: [] };
        }
        rooms[roomId].players.push(socket.id);
        socket.join(roomId);
        rooms[roomId].data.push(data)
        rooms[roomId].idData.push(socket.id)
        rooms[roomId].readyCount++;
        socket.emit('ready', rooms[roomId].readyCount);
        if (rooms[roomId].readyCount == 2) {
            let r = Math.floor(Math.random() * 2)
            io.to(rooms[roomId].players[r]).emit('move', 0);
            if (r) {
                io.to(rooms[roomId].players[0]).emit('move', 1);
            } else {
                io.to(rooms[roomId].players[1]).emit('move', 1);
            }
            if (rooms[roomId].players[0] === rooms[roomId].idData[0]) {
                io.to(rooms[roomId].players[0]).emit('ready', rooms[roomId].data[1]);
                io.to(rooms[roomId].players[1]).emit('ready', rooms[roomId].data[0]);

            } else {
                io.to(rooms[roomId].players[0]).emit('ready', rooms[roomId].data[0]);
                io.to(rooms[roomId].players[1]).emit('ready', rooms[roomId].data[1]);
            }
        }
    });

    socket.on('move', (move) => {
        if (socket.id === rooms[roomId].players[0] && move === 'miss') {
            io.to(rooms[roomId].players[0]).emit('move', 1);
            io.to(rooms[roomId].players[1]).emit('move', 0);
        } else if (socket.id === rooms[roomId].players[1] && move === 'miss') {
            io.to(rooms[roomId].players[0]).emit('move', 0);
            io.to(rooms[roomId].players[1]).emit('move', 1);
        }
    });

    socket.on('end', (endData) => {
        if (endData === 'gg') {
            socket.to(roomId).emit('end', 'gg')
        } else if (endData === 'win') {
            socket.to(roomId).emit('end', 'win')
        } else {
            socket.to(roomId).emit('end', 'left')
        }
    })

    socket.on('shot', (hittData) => {
        console.log(hittData);
        socket.to(roomId).emit('shot', hittData)
    })

    socket.on('disconnect', () => {
        io.emit('users', io.engine.clientsCount);
        io.to(roomId).emit('end', 'left')
        if (rooms[roomId]) {
            const index = rooms[roomId].players.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomId].players.splice(index, 1);
                if (rooms[roomId].players.length <= 1) {
                    delete rooms[roomId];
                } else {
                    io.to(roomId).emit('opponentLeft');
                }
            }
        }
    });
});

server.listen(3000);