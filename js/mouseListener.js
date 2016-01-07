/**
 * Mouse listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */
 
var canShot = true;

// On shoting
window.addEventListener('mousedown', function(e) {
    if (canShot) {
        var destX = e.x - canvas.offsetLeft;
        var destY = e.y - canvas.offsetTop;
        
        var xTotalVel = player.x - destX;
        var yTotalVel = player.y - destY;
        
        var totalVel = Math.abs(xTotalVel) + Math.abs(yTotalVel);
        var totalFPS = 6;

        var xVelocity = xTotalVel * totalFPS / totalVel;
        var yVelocity = yTotalVel * totalFPS / totalVel;
        
        shot = {
            id:             +new Date(),
            shoter:         player,
            origin:         {x: player.x + 25, y: player.y + 25},
            position:       {x: player.x + 25, y: player.y + 25},
            velocity:       {x: xVelocity, y: yVelocity},
            draw:           true
        };
        
        // Adding a shoot
        socket.emit('shot', shot);
        
        canShot = false;
        
        setTimeout(function() {
            canShot = true;
        }, 500);
    }
});