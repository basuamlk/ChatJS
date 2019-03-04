const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];


server.listen(process.env.PORT || 3000); // Runs the server to listen onto port 3000
console.log('Server Running.... ');

app.get('/', function(req,res){          //creates a route
    res.sendFile(__dirname + '/index.html')
});

    // Connect
io.sockets.on('connection',function(socket){    //Open a connection
    connections.push(socket); //pushes ip into connection
    console.log('Connected: %s sockets connected',connections.length); //number of users connected

    // Disconnect
    socket.on('disconnect',function(data){

        connections.splice(users.indexOf(socket.username),1) //removes the socket specified from connections array
        updateUsernames();
        console.log('%s has been removed',connections[connections.indexOf(socket)]);
        console.log('Disconnected: %s sockets connected',connections.length);

    });

    // Send Message
    socket.on('send message',function(data){        //submit the form -> caught here -> sends "new message" then emits "new message" which is caught on the client
    //console.log(data);    
    io.sockets.emit('new message',{msg: data, user: socket.username});  //emit a new msg event
    });

    // New User
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

});