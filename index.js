const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Room = require('./server/js/Room');
const Player = require('./server/js/Player');

// Create a room.
const room = new Room();

// Home route.
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Host static files.
app.use(express.static('public'));

// Connect handler.
io.on('connection', function(socket) {
    // Preate a new player.
    const player = new Player(socket);

    // Add player to list.
    room.addPlayer(player);
});

// Start the server.
http.listen(3000, function() {
    console.log('listening on *:3000');
});
