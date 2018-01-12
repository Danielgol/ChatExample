
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('Your server is running...');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function(socket){

  //Disconnect
  socket.on('disconnect', function(data){

    try{
      if(users[connections.indexOf(socket)].userName != ""){
        users.splice(connections.indexOf(socket), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
        sendUsers();
       } 
    }catch(err){

    }

  });

  //Send Message
  socket.on('send message', function(data){
    console.log(data.userName+': '+data.message);
    io.sockets.emit('new message', data);
  });

  //New User
  socket.on('new user', function(data){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    console.log('New user: '+data.userName);
    users.push(data);
    sendUsers();
  });

  function sendUsers(){
    io.sockets.emit('list users', {users: users});
  }

});
