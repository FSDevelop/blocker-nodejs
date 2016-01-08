/**
 * Mouse listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */
 
var canShot = true;
var shoting;
var mouseEvent;

// On shoting
window.addEventListener('mousedown', function(e) {
    mouseEvent = e;
    shotBullet();
});

function shotBullet(e) {
    if (canShot) {
        canShot = false;
        
        var destX = mouseEvent.x - canvas.offsetLeft;
        var destY = mouseEvent.y - canvas.offsetTop;
                
        var xTotalVel = (player.x + 25) - destX;
        var yTotalVel = (player.y + 25) - destY;
                
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
            draw:           false,
            color:          player.shotColor
        };
                
        socket.emit('shot', shot);
        
        setTimeout(function() {
            canShot = true;
        }, 300);
    }
}