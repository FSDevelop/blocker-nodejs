/**
 * Client listener (connected to server)
 * @since 1st release
 */
        
// Initialize game
setCanvas();

// Update elements
socket.on('updateData', function(res) {
    players = res.players;
    
    for (var i = 0; i < players.length; i++) {
        if (players[i].username == player.username) {
            player = players[i];
        }
    }
});

socket.on('updatePlayer', function(playerRefreshed) {
    player = playerRefreshed;
});

socket.on('died', function() {
    $('#game').fadeOut(function() {
        window.location = window.location;
    })
});

var shotAnimation = new Array();

socket.on('newShot', function(shot) {
    var startDrawing = 0;
    
    var newShotIndex = shots.push(shot) - 1;
    
    shotAnimation[shots[newShotIndex].id] = setInterval(function() {
        shots[newShotIndex].position.x -= shots[newShotIndex].velocity.x;
        shots[newShotIndex].position.y -= shots[newShotIndex].velocity.y;
                
        if (shots[newShotIndex].position.x > 1020 || shots[newShotIndex].position.x < -20 ||
            shots[newShotIndex].position.y > 620 || shots[newShotIndex].position.y < -20) {
            shots[newShotIndex].draw = false;
            clearInterval(shotAnimation[shots[newShotIndex].id]);
        }
            
        startDrawing++;
    }, 20);
});

// Every 100 miliseconds send an alive event to the server to avoid disconnection
setInterval(function(){
  // Emit an alive event to the server
  if (players.length > 0) {
      socket.emit('alive', +new Date());
  }
}, 100);