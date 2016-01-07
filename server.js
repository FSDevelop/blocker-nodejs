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
	client.on('join', function(playerJoined, timeConnected) {
		console.log('Player connected: ' + playerJoined.username);
		client.player = playerJoined;
		
		// Add this player to the player's list
		players.push(playerJoined);
		
		// Last time this player send a request
		client.lastAlive = timeConnected;
		
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
		    if (players[i].username == client.player.username) {
		        players.splice(i, 1);
				client.emit('died');
		    }
		}
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
		
		emitData();
	});
	
	// When received an alive event (player still online)
	client.on('alive', function(timeAlive) {
		client.lastAlive = timeAlive;
	});
	
	client.on('attacked', function(shot) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].username == client.player.username) {
				if (shot.shoter.username != client.player.username) {
					console.log('Player attacked');
					client.player.lifes -= 1;
					
					if (client.player.lifes <= 0) {
						disconnectPlayer();
					}
					
					removeShot(shot);
					emitData();
					
					break;
				}
			}
		}
	});
	
	function removeShot(shot) {
		for (var i = 0; i < shots.length; i++) {
			if (shots[i].id == shot.id) {
				shots[i].draw = false;
				break;
			}
		}
	}
	
	// Emit to all the players new players positions
	function emitData() {
		var data = { players: players };
		client.emit('updatePlayer', client.player);
		client.emit('updateData', data);
		client.broadcast.emit('updateData', data);
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