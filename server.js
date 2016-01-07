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
		
		// Add this player to the player's list
		players.push(playerJoined);
		
		// Last time this player send a request
		client.lastAlive = timeConnected;
		
		// Emit to all the players that a new player is connected
		client.emit('updatePlayers', players);
		client.broadcast.emit('updatePlayers', players);
		
		// Checking every second if the player is still connected
		var lastCycleAlive = 0;
		var playerIsAlive = setInterval(function() {
			if (client.lastAlive == lastCycleAlive) {
				console.log('Disconnected: ' + playerJoined.username);
				disconnectPlayer(playerJoined);
				clearInterval(playerIsAlive);
			} else {
				lastCycleAlive = client.lastAlive;
			}
		}, 1000);
	});
	
	function disconnectPlayer (playerToDisconnect) {
		for (var i = 0; i < players.length; i++) {
		    if (players[i].username == playerToDisconnect.username) {
		        players.splice(i, 1);
		    }
		}
		
		// Emit to all the players that a new player is connected
		client.emit('updatePlayers', players);
		client.broadcast.emit('updatePlayers', players);
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
	            break;
	        }
	    }
			
		// Emit to all the players new players positions
		client.emit('updatePlayers', players);
		client.broadcast.emit('updatePlayers', players);
	});
	
	// When received an alive event (player still online)
	client.on('alive', function(timeAlive) {
		client.lastAlive = timeAlive;
	});
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080, function() {
	console.log('Waiting for players...');
});