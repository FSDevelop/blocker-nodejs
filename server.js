// Some importants requires
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socket = require('socket.io')(server);
var fs = require('fs');
var walls;

// Players connected (with name, position, sprite, etc);
var players = new Array();
var shots = new Array();

// On player connected
socket.on('connection', function(client) {
	
	// When a player join the game
	client.on('join', function(playerJoined) {
		console.log('Player connected: ' + playerJoined.username);
		client.player = playerJoined;
		
		// Add this player to the player's list
		players.push(playerJoined);
		
		// Last time this player send a request
		client.lastAlive = playerJoined.id;
		
		// Emit to all the players that a new player is connected
		emitData();
		
		// Emit walls to all players
		fs.readFile('walls', 'utf8', function (err, data) {
			client.emit('walls', data);
		});
		
		
		// Checking every second if the player is still connected
		var lastCycleAlive = 0;
		var playerIsAlive = setInterval(function() {
			if (client.lastAlive == lastCycleAlive) {
				console.log('Player disconnected: ' + playerJoined.username);
				disconnectPlayer();
				emitData();
				clearInterval(playerIsAlive);
			} else {
				lastCycleAlive = client.lastAlive;
			}
		}, 1000);
	});
	
	socket.on('updatePlayer', function(playerUpdated) {
		for (var i = 0; i < players.length; i++) {
		    if (players[i].id == playerUpdated.id) {
				players[i] = playerUpdated;
		    }
		}
		// Emit to all the players that a new player is connected
		emitData();
	});
	
	function disconnectPlayer() {
		for (var i = 0; i < players.length; i++) {
		    if (players[i].id == client.player.id) {
		        players.splice(i, 1);
				client.emit('died');
		    }
		}
	}
	
	// When a player is moving
	client.on('move', function(playerMoved, direction) {
		client.emit('playerMovement', {
			playerMoved: playerMoved,
			direction: direction
		});
		client.broadcast.emit('playerMovement', {
			playerMoved: playerMoved,
			direction: direction
		});
	});
	
	// When received an alive event (player still online)
	client.on('alive', function(timeAlive) {
		client.lastAlive = timeAlive;
	});
	
	client.on('attacked', function(attackedPlayer, shoterPlayer) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id === attackedPlayer.id) {
				console.log('Player ' + attackedPlayer.username + ' attacked by ' + shoterPlayer.username);
				players[i].lifes -= 1;
				
				if (players[i].lifes <= 0) {
					players.splice(i, 1);
					client.emit('died');
				}
			} else if (players[i].id === shoterPlayer.id) {
				players[i].score += 1;
			}
		}
		
		emitData();
	});
	
	// Emit to all the players new players positions
	function emitData() {
		client.emit('updatePlayer', client.player);
		client.emit('updateData', { players: players });
		client.broadcast.emit('updateData', { players: players });
	}
	
	client.on('shot', function(shot) {
		shots.push(shot);
		client.emit('newShot', shot);
		client.broadcast.emit('newShot', shot);
	});
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8081, function() {
	console.log('Waiting for players...');
});