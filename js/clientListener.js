/**
 * Client listener (connected to server)
 * @since 1st release
 */

// Make connection with server
var socket = io.connect('http://192.168.1.35:8080');
    
// Generate a random sprite
var userSprite = generateRandomSprite();
    
// Define new player
var newPlayer = {
    username: username, // Username
    x: 0, y: 0,         // Position
    sprite: userSprite  // Sprite
};
    
// Push player to the map
players.push(newPlayer);
    
// Tell the server that there is a new player
var timeConnected = +new Date();
socket.emit('join', newPlayer, timeConnected);
        
// Initialize game
setCanvas();
    
// Every 100 miliseconds send an alive event to the server to avoid disconnection
setInterval(function(){
  // Emit an alive event to the server
  socket.emit('alive', {
      username: username, 
      x: players[0].x, y: players[0].y, 
      sprite: players[0].sprite
  }, +new Date());
}, 100);
    
// If the player was disconnected, drop it from players array
socket.on('dropPlayer', function(playerDisconnected) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].username == playerDisconnected.username) {
            players.splice(i, 1);
        }
    }
});
          
// Update position on action from client
socket.on('move', function(playerMoved) {
            
    // Finding player on array
    var index = -1;
    for (var i = 0; i < players.length; i++) {
        if (players[i].username == playerMoved.username) {
            index = i; break;
        }
    }
                
    if (index != -1) {
        // If player already exists update position
        players[index].x = playerMoved.x;
        players[index].y = playerMoved.y;
        players[index].sprite = playerMoved.sprite;
    } else {
        // If player doesn't exist, add a new one
        players.push({
            username: playerMoved.username, 
            x: playerMoved.x, y: playerMoved.y, 
            sprite: playerMoved.sprite
        });
    }
                
    // Draw all players again
    render();
});