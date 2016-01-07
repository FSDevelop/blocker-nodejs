// Some importants requires
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socket = require('socket.io')(server);

// Players connected (with name, position, sprite, etc);
var players = new Array();

// On player connected
socket.on('connection', function(client) {
	
	// When a player join the game
	client.on('join', function(playerJoined, timeConnected) {
		console.log('Player connected: ' + playerJoined.username);
		client.player = playerJoined;
		
		// Add this player to the player's list
		players.push(playerJoined);
		
		// Last time this player send a request
		client.lastAlive = timeConnected;
		
		// Emit to all the players that a new player is connected
		emitPlayers();
		
		// Checking every second if the player is still connected
		var lastCycleAlive = 0;
		var playerIsAlive = setInterval(function() {
			if (client.lastAlive == lastCycleAlive) {
				console.log('Disconnected: ' + playerJoined.username);
				disconnectPlayer();
				clearInterval(playerIsAlive);
			} else {
				lastCycleAlive = client.lastAlive;
			}
		}, 1000);
	});
	
	function disconnectPlayer() {
		for (var i = 0; i < players.length; i++) {
		    if (players[i].username == client.player.username) {
		        players.splice(i, 1);
		    }
		}
		
		emitPlayers();
	}
	
	// When a player is moving
	client.on('move', function(playerMoved) {
	    // Finding player on array
	    for (var i = 0; i < players.length; i++) {
	        if (players[i].username == playerMoved.username) {
			    // If player already exists update position
			    players[i].x = playerMoved.x;
			    players[i].y = playerMoved.y;
			    players[i].sprite = playerMoved.sprite;
				client.player = playerMoved;
	            break;
	        }
	    }
		
		emitPlayers();
	});
	
	// When received an alive event (player still online)
	client.on('alive', function(timeAlive) {
		client.lastAlive = timeAlive;
	});
	
	client.on('attacked', function() {
		for (var i = 0; i < players.length; i++) {
			if (players[i].username == client.player.username) {
				players[i].lifes -= 1;
				client.player.lifes -= 1;
				if (client.player.lifes <= 0) {
					disconnectPlayer();
				}
				break;
			}
		}
		
		emitPlayers();
	});
	
	// Emit to all the players new players positions
	function emitPlayers() {
		client.emit('updatePlayer', client.player);
		client.emit('updatePlayers', players);
		client.broadcast.emit('updatePlayers', players);
	}
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080, function() {
	console.log('Waiting for players...');
});