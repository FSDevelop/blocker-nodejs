/**
 * Mouse listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   February, 2016
 */

var canShot = true;

// On shoting
window.addEventListener('mousedown', function(e) {
    requestShot(e);
});

function requestShot(mouseEvent) {
    if (canShot) {
        canShot = false;
        
        // x, y mouse position when clicked
        var destination = {
            x: mouseEvent.x - canvas.offsetLeft,
            y: mouseEvent.y - canvas.offsetTop
        };
        
        // distance between player position and clicked position
        var distance = {
            x: Math.abs(player.position.x - destination.x),
            y: Math.abs(player.position.y - destination.y)
        };
        
        var totalDistance = distance.x + distance.y;
        var totalFPS = 6;

        var velocity = {
            x: distance.x * totalFPS / totalDistance,
            y: distance.y * totalFPS / totalDistance
        };
        
        // shot definition        
        var shot = {
            id:             +new Date(),
            shoter:         player,
            origin:         player.position,
            position:       player.position,
            velocity:       { x: velocity.x, y: velocity.y },
            draw:           false
        };
                
        // emit to server that there is a new shot on the field
        socket.emit('shot', shot);
        
        // allow to shot again after 0.3 seconds
        setTimeout(function() {
            canShot = true;
        }, 300);
    }
}
