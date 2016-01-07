// Some importants requires
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socket = require('socket.io')(server);

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
		
		// Checking every second if the player is still connected
		var lastCycleAlive = 0;
		var playerIsAlive = setInterval(function() {
			if (client.lastAlive == lastCycleAlive) {
				console.log('Disconnected: ' + playerJoined.username);
				disconnectPlayer();
				emitData();
				clearInterval(playerIsAlive);
			} else {
				lastCycleAlive = client.lastAlive;
			}
		}, 1000);
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
	client.on('move', function(playerMoved) {
	    // Finding player on array
	    for (var i = 0; i < players.length; i++) {
	        if (players[i].id == playerMoved.id) {
			    // If player already exists update position
			    players[i].x = playerMoved.x;
			    players[i].y = playerMoved.y;
			    players[i].sprite = playerMoved.sprite;
				client.player = playerMoved;
	            break;
	        }
	    }
		
		emitData();
	});
	
	// When received an alive event (player still online)
	client.on('alive', function(timeAlive) {
		client.lastAlive = timeAlive;
	});
	
	client.on('attacked', function(attackedPlayer, shoterPlayer) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].id === attackedPlayer.id) {
				console.log('Player attacked');
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
server.listen(8080, function() {
	console.log('Waiting for players...');
});