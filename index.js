var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Laad html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// User handler
io.on('connection', function(socket){

  // connection
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // afhandelen berichten
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});