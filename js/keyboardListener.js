/**
 * Keyboard listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */
 
var allowToMove = true;

// Keyboard listener
window.addEventListener('keydown', function(e) {
    if (allowToMove) {
        allowToMove = false;
        var allowedKey = true;
        switch (e.keyCode) {
            case 65: direction = 'left';    break;
            case 87: direction = 'up';      break;
            case 68: direction = 'right';   break;
            case 83: direction = 'down';    break;
            default: allowedKey = false;
        }
        
        if (allowedKey) {
            if (!playerWallCollision(player, direction)) {
                socket.emit('move', player, direction);
            }
        }
        
        setTimeout(function(){
            allowToMove = true;
        }, 200);
    }
});

// Player collision with wall
function playerWallCollision(playerMoved, direction) {
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
                    if (direction == 'left') {
                        if ((playerMoved.x - 25) >= xWall && (playerMoved.x - 25) <= (xWall + 50) &&
                            (playerMoved.y + 25) >= yWall && (playerMoved.y + 25) <= (yWall + 50)) {
                            pushedWall = true;
                        }
                    } else if (direction == 'right') {
                        if ((playerMoved.x + 75) >= xWall && (playerMoved.x + 75) <= (xWall + 50) &&
                            (playerMoved.y + 25) >= yWall && (playerMoved.y + 25) <= (yWall + 50)) {
                            pushedWall = true;
                        }
                    } else if (direction == 'up') {
                        if ((playerMoved.x + 25) >= xWall && (playerMoved.x + 25) <= (xWall + 50) &&
                            (playerMoved.y - 25) >= yWall && (playerMoved.y - 25) <= (yWall + 50)) {
                            pushedWall = true;
                        }
                    } else if (direction == 'down') {
                        if ((playerMoved.x + 25) >= xWall && (playerMoved.x + 25) <= (xWall + 50) &&
                            (playerMoved.y + 75) >= yWall && (playerMoved.y + 75) <= (yWall + 50)) {
                            pushedWall = true;
                        }
                    }
                }
            }
        }
    }
    
    return pushedWall;
}