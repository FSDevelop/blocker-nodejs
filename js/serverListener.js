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