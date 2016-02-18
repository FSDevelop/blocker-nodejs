/**
 * Server listener
 * @since January, 2016
 */

// Make connection with server
var socket = io.connect(host + ':8080');

// When the player Joins, it receives all the players currently connected data
socket.on('playersConnected', function(playersConnected) {
    players = playersConnected;
    gameLoop();
});

// When a new player connnects
socket.on('newPlayer', function(newPlayer) {
    players.push(newPlayer);
});

// When a player disconnects
socket.on('playerDisconnected', function(playerDisconnected) {
    if (players.length > 0) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == playerDisconnected) {
                console.log('Disconnected player ' + players[i].username);
                players.splice(i, 1);
                break;
            }
        }
    }
});

// When a player is moving
socket.on('movement', function(movement) {
    var startMoving = 1;
    var movementAnimation = setInterval(function() {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == movement.playerId) {
                var playerToMove = players[i];
                break;
            }
        }
        
        switch (movement.direction) {
            case 'left':    playerToMove.position.x -= 2; break;
            case 'right':   playerToMove.position.x += 2; break;
            case 'up':      playerToMove.position.y -= 2; break;
            case 'down':    playerToMove.position.y += 2; break;
        }
        
        if (startMoving == 25) {
            socket.emit('updatePlayer', playerToMove.id, playerToMove.position);
            clearInterval(movementAnimation);
        }
        
        startMoving++;
    }, 10);
});