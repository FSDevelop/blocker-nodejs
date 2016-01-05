var express = require('express');
var app = express();

// Express server
var server = require('http').createServer(app);

// Server socket with Socket.io
var io = require('socket.io')(server);

// On player connect
io.on('connection', function(player) {
	// When a player is connected
	player.on('join', function(playerJoined) {
		console.log('Player connected: ' + playerJoined.username);
	});
	
	// When a player is moving
	player.on('move', function(playerMoved) {
		// Send that move to everyone
		player.broadcast.emit('move', playerMoved);
	});
	
	// When received an alive event (user still online)
	player.on('alive', function(playerAlive, clientTime) {
		player.broadcast.emit('move', playerAlive);
	});
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

console.log('Waiting for players...');

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080);