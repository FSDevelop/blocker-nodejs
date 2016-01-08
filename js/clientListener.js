/**
 * Client listener (connected to server)
 * @since 1st release
 */
        
// Initialize game
setCanvas();

// Update elements
socket.on('updateData', function(res) {
    players = res.players;
    playersSorted = players.sortBy('score');
    $('.game-content .players ul').html('');
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == player.id) {
            player = players[i];
        }
    }
    for (var i = 0; i < playersSorted.length; i++) {
        $('.game-content .players ul').append(
            '<li>' + playersSorted[i].username + ' ( ' + playersSorted[i].score + ' )</li>'
        );
    }
});

Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 0 : (a[p] < b[p]) ? -1 : 1;
  });
}

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
        while (startDrawing < 5) {
            shots[newShotIndex].position.x -= shots[newShotIndex].velocity.x;
            shots[newShotIndex].position.y -= shots[newShotIndex].velocity.y;
            startDrawing++;
        }
        
        if (startDrawing == 5) shots[newShotIndex].draw = true;
        
        shots[newShotIndex].position.x -= shots[newShotIndex].velocity.x;
        shots[newShotIndex].position.y -= shots[newShotIndex].velocity.y;
                
        if (shots[newShotIndex].position.x > 820 || shots[newShotIndex].position.x < -20 ||
            shots[newShotIndex].position.y > 620 || shots[newShotIndex].position.y < -20) {
            shots[newShotIndex].draw = false;
            clearInterval(shotAnimation[shots[newShotIndex].id]);
        } else if (shots[newShotIndex].velocity.x == 0 && shots[newShotIndex].velocity.y == 0) {
            clearInterval(shotAnimation[shots[newShotIndex].id]);
        }
            
        startDrawing++;
    }, 20);
});

var movingOn = false;
var animation = new Array();

socket.on('playerMovement', function(data) {
    var playerMoved = data.playerMoved;
    
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == playerMoved.id) {
            var playerMoved = players[i];
        }
    }
    
    if ((playerMoved.id == player.id && !movingOn) || playerMoved.id != player.id) {
        animationMovement = 0;
        movingOn = true;
        
        animation[playerMoved.id] = setInterval(function() {
            animationMovement++; // Has to reach 10
            
            //console.log(playerMoved);
            switch (data.direction) {
                case 'left':    playerMoved.x -= 2; break;
                case 'right':   playerMoved.x += 2; break;
                case 'up':      playerMoved.y -= 2; break;
                case 'down':    playerMoved.y += 2; break;
            }
                    
            // Add an horizontal infinite effect
            if (playerMoved.x < 0) {playerMoved.x = 795;}
            else if (playerMoved.x > 795) {playerMoved.x = 0;}
                    
            // Add an vertical infinite effect
            if (playerMoved.y < 0) {playerMoved.y = 595;}
            else if (playerMoved.y > 595) {playerMoved.y = 0;}
                    
            // When the animation is over, stop interval
            if (animationMovement == 25) {
                movingOn = false;
                clearInterval(animation[playerMoved.id]);
            }
        }, 10);
    }
});

// Every 100 miliseconds send an alive event to the server to avoid disconnection
setInterval(function(){
  // Emit an alive event to the server
  if (players.length > 0) {
      socket.emit('alive', +new Date());
  }
}, 100);