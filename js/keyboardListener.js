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
        movingOn = true; // Used to stop typing when the movement is on
        movedPlayer = players[0]; // Player to be moved
        animationMovement = 0;
        animation = setInterval(function() {
            animationMovement++;
            
            switch (direction) {
                case 'left': movedPlayer.x -= 5; break;
                case 'right': movedPlayer.x += 5; break;
                case 'up': movedPlayer.y -= 5; break;
                case 'down': movedPlayer.y += 5; break;
            }
            
            // Add an horizontal infinite effect
            if (players[0].x < 0) {
                players[0].x = 595;
            } else if (players[0].x > 595) {
                players[0].x = 0;
            }
            
            // Add an vertical infinite effect
            if (players[0].y < 0) {
                players[0].y = 595;
            } else if (players[0].y > 595) {
                players[0].y = 0;
            }
            
            // Emit a move event to the server
            socket.emit('move', {username: username, x: movedPlayer.x, y: movedPlayer.y, sprite: movedPlayer.sprite});
            
            // Write players on new position
            render();
            
            // When the animation is over, stop interval
            if (animationMovement == 10) {
                clearInterval(animation);
                movingOn = false;
            }
        }, 5);
    }
}