var express = require('express');
var app = express();

// Express server
var server = require('http').createServer(app);

// Server socket with Socket.io
var io = require('socket.io')(server);

// On player connect
io.on('connection', function(player) {
	// When a player is connected
	player.on('join', function(playerJoined, playerTime) {
		console.log('Player connected: ' + playerJoined.username);
		player.lastAlive = playerTime;
		
		var lastCycleAlive = 0;
		var playerIsAlive = setInterval(function() {
			if (player.lastAlive == lastCycleAlive) {
				console.log('Disconnected: ' + playerJoined.username);
				player.broadcast.emit('afk', playerJoined);
				clearInterval(playerIsAlive);
			} else {
				lastCycleAlive = player.lastAlive;
			}
		}, 1000);
		
	});
	
	// When a player is moving
	player.on('move', function(playerMoved) {
		// Send that move to everyone
		player.broadcast.emit('move', playerMoved);
	});
	
	// When received an alive event (user still online)
	player.on('alive', function(playerAlive, playerTime) {
		player.broadcast.emit('move', playerAlive);
		player.lastAlive = playerTime;
	});
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

console.log('Waiting for players...');

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080);