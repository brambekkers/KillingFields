const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Room = require('./Room');

// Create a room.
const room = new Room(io);

// Host static files.
app.use(express.static('client/public'));

// Home route.
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/public/index.html');
});

// Start the server.
http.listen(3030, function() {
    console.log('Server listening on localhost:3030');
    console.log('Killing Fields has started!');
});
