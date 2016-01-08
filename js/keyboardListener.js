/**
 * Keyboard listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

// Keyboard listener
window.addEventListener('keydown', function(e) {
    var allowedKey = true;
    switch (e.keyCode) {
        case 65: direction = 'left';    break;
        case 87: direction = 'up';      break;
        case 68: direction = 'right';   break;
        case 83: direction = 'down';    break;
        default: allowedKey = false;
    }
    
    if (allowedKey) {
        socket.emit('move', player, direction);
    }
});