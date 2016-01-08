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

socket.on('walls', function(allWalls) {
    walls = allWalls;
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
        
        var removeShot = false;
                
        if (shots[newShotIndex].position.x > 820 || shots[newShotIndex].position.x < -20 ||
            shots[newShotIndex].position.y > 620 || shots[newShotIndex].position.y < -20) {
            removeShot = true;
        } else if (shots[newShotIndex].velocity.x == 0 && shots[newShotIndex].velocity.y == 0) {
            removeShot = true;
        } else if (shotWallCollision(shots[newShotIndex])) {
            removeShot = true;
        }
        
        if (removeShot) {
            shots[newShotIndex].draw = false;
            clearInterval(shotAnimation[shots[newShotIndex].id]);
        }
            
        startDrawing++;
    }, 20);
});

// Shot collision with wall
function shotWallCollision(shotCollided, direction) {
    var pushedWall = false;
    // Wall limitation
    if (walls !== undefined) {
        var rows = walls.split('\n');
        for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].split('');
            for (var j = 0; j < cols.length; j++) {
                var field = cols[j];
                if (field == '1') {
                    var xWall = j * 50;
                    var yWall = i * 50;
                    shotXPos = shotCollided.position.x;
                    shotYPos = shotCollided.position.y;
                    shotXVel = shotCollided.velocity.x;
                    shotYVel = shotCollided.velocity.y;
                    nextXPos = shotXPos - shotXVel;
                    nextYPos = shotYPos - shotYVel;
                    if (nextXPos >= xWall && nextXPos <= xWall + 50 &&
                        nextYPos >= yWall && nextYPos <= yWall + 50) {
                        pushedWall = true;
                    }
                }
            }
        }
    }
    
    return pushedWall;
}

var movingOn = false;
var animation = new Array();
var animationMovement = new Array();

socket.on('playerMovement', function(data) {
    var playerMoved = data.playerMoved;
    
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == playerMoved.id) {
            playerMoved = players[i];
        }
    }
    
    if ((playerMoved.id == player.id && !movingOn) || playerMoved.id != player.id) {
        animationMovement[playerMoved.id] = 0;
        movingOn = (playerMoved.id == player.id) ? true : movingOn;
        
        animation[playerMoved.id] = setInterval(function() {
            animationMovement[playerMoved.id]++; // Has to reach 10
                
            switch (data.direction) {
                case 'left':    playerMoved.x -= 2; break;
                case 'right':   playerMoved.x += 2; break;
                case 'up':      playerMoved.y -= 2; break;
                case 'down':    playerMoved.y += 2; break;
            }
            
            var horizontalEffect = false;
        
            // Add an horizontal infinite effect
            if (playerMoved.x + 50 <= 0) {
                playerMoved.x = 750;
                horizontalEffect = true;
            } else if (playerMoved.x >= 800) {
                playerMoved.x = 0;
                horizontalEffect = true;
            }
                        
            // Add an vertical infinite effect
            if (playerMoved.y + 50 <= 0) {
                playerMoved.y = 550;
                horizontalEffect = true;
            } else if (playerMoved.y >= 600) {
                playerMoved.y = 0;
                horizontalEffect = true;
            }
                        
            // When the animation is over, stop interval
            if (animationMovement[playerMoved.id] == 25 || horizontalEffect) {
                movingOn = (playerMoved.id == player.id) ? false : movingOn;
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