/**
 * Keyboard listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

// Keyboard listener
window.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 37: movePlayer('left');    break;
        case 38: movePlayer('up');      break;
        case 39: movePlayer('right');   break;
        case 40: movePlayer('down');    break;
    }
});

var movingOn = false;

function movePlayer(direction) {
    if (!movingOn) {
        movingOn = true;            // Used to stop typing when the movement is on
        animationMovement = 0;
        
        animation = setInterval(function() {
            animationMovement++; // Has to reach 10
            
            switch (direction) {
                case 'left':    player.x -= 5; break;
                case 'right':   player.x += 5; break;
                case 'up':      player.y -= 5; break;
                case 'down':    player.y += 5; break;
            }
            
            // Add an horizontal infinite effect
            if (player.x < 0) player.x = 995;
            else if (player.x > 895) player.x = 0;
            
            // Add an vertical infinite effect
            if (player.y < 0) player.y = 595;
            else if (player.y > 895) player.y = 0;
            
            // Emit a move event to the server
            socket.emit('move', player);
            
            // When the animation is over, stop interval
            if (animationMovement == 10) {
                clearInterval(animation);
                movingOn = false;
            }
        }, 10);
    }
}