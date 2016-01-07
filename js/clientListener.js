/**
 * Client listener (connected to server)
 * @since 1st release
 */
        
// Initialize game
setCanvas();

// Update players on game
socket.on('updatePlayers', function(allPlayers) {
    players = allPlayers;
});
    
// Every 100 miliseconds send an alive event to the server to avoid disconnection
setInterval(function(){
  // Emit an alive event to the server
  if (players.length > 0) {
      socket.emit('alive', {
          username: username, 
          x: players[0].x, y: players[0].y, 
          sprite: players[0].sprite
      }, +new Date());
  }
}, 100);
          
// Update position on action from client
socket.on('move', function(playerMoved) {
    // Draw all players again
    render();
});