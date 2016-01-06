// Some importants requires
var express = require('express');
var app = express();
var http = require('http');

// Express server
var server = http.createServer(app);

// Server socket with Socket.io
var socket = require('socket.io')(server);

// Players connected (with name, position, etc);
var players = new Array();

// On player connected
socket.on('connection', function(player) {
	
	// When a player join the game
	player.on('join', function(playerJoined, timeConnected) {
		console.log('Player connected: ' + playerJoined.username);
		
		// Add this player to the player's list
		players.push(player);
		
		// Last time this player send a request
		player.lastAlive = timeConnected;
		
		// Checking every second if the player is still connected
		var lastCycleAlive = 0;
		var playerIsAlive = setInterval(function() {
			if (player.lastAlive == lastCycleAlive) {
				console.log('Disconnected: ' + playerJoined.username);
				
				player.broadcast.emit('dropPlayer', playerJoined);
				
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
	
	// When received an alive event (player still online)
	player.on('alive', function(playerAlive, timeAlive) {
		player.broadcast.emit('move', playerAlive);
		player.lastAlive = timeAlive;
	});
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080, function() {
	console.log('Waiting for players...');
});