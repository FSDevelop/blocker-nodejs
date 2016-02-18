/**
 * Mouse listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   February, 2016
 */

var canShot = true;
var mouseEvent;

// On shoting
window.addEventListener('mousedown', function(e) {
    mouseEvent = e;
    shot();
});

function shot() {
    if (canShot) {
        canShot = false;
        
        // x, y mouse position when clicked
        var destination = {
            x: mouseEvent.x - canvas.offsetLeft,
            y: mouseEvent.y - canvas.offsetTop
        };
        
        // distance between player position and clicked position
        var distance = {
            x: Math.abs((player.x + 25) - destination.x),
            y: Math.abs((player.y + 50) - destination.y)
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
            origin:         { x: player.x + 25, y: player.y + 25 },
            position:       { x: player.x + 25, y: player.y + 25 },
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
