var express = require('express');
var app = express();

// Express server
var server = require('http').createServer(app);

// Server socket with Socket.io
var io = require('socket.io')(server);

// On client connect
io.on('connection', function(client) {
	console.log('Client connected');
	
	// When a client is moving
	client.on('move', function(playerMoved) {
		// Send that move to everyone
		client.broadcast.emit('move', playerMoved);
	});
	
	// When received an alive event (user still online)
	client.on('alive', function(playerAlive) {
		client.broadcast.emit('move', playerAlive);
	});
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

console.log('Waiting for clients...');

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080);