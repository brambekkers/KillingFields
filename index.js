const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Room = require('./server/js/Room');

// Create a room.
const room = new Room(io);

// Home route.
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Host static files.
app.use(express.static('public'));

// Start the server.
http.listen(3000, function() {
    console.log('listening on *:3000');
});
