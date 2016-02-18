// Some importants requires
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// All players
var players = new Array();

// On player connected
io.on('connection', function(client) {
	// When a player join the game
	client.on('join', function(player) {
		console.log('Player connected: ' + player.username);
		
		// Set client player to the recent joined
		client.player = player;
		
		// First time connected
		client.lastConnection = player.id;
		
		// Add new player to the list
		players.push(player);
		
		// Tell the new client who is connected
		client.emit('playersConnected', players);
		
		// Tell everyone there is a new player
		client.broadcast.emit('newPlayer', player);
		
		// Disconnect player when no data emision
		manageDisconnection();
	});
	
	// Sent 1 time per second to tell server player is still online
	client.on('stillAlive', function(time) {
		client.lastConnection = time;
	});
	
	// When a player is moving
	client.on('movement', function(playerId, direction) {
		var data = { playerId: playerId, direction: direction };
		client.emit('movement', data);
		client.broadcast.emit('movement', data);
	});
	
	// When there is no alive update, disconnect player
	function manageDisconnection() {
		var lastConnection = 0;
		var connection = setInterval(function() {
			if (client.lastConnection == lastConnection) {
				console.log('Player disconnected: ' + client.player.username);
				client.broadcast.emit('playerDisconnected', client.player.id);
				removePlayer(client.player.id);
				clearInterval(connection);
			}
			lastConnection = client.lastConnection;
		}, 5000);
	}
	
	// Remove player from array
	function removePlayer(player) {
		if (players.length > 0) {
			for (var i = 0; i < players.length; i++) {
				if (players[i].id == player) {
					players.splice(i, 1);
				}
			}
		}
	}
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080, function() {
	console.log('Waiting for players...');
});