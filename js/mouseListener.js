/**
 * Mouse listener
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

// On shoting
window.addEventListener('mousedown', function(e) {
    var destX = e.x - canvas.offsetLeft;
    var destY = e.y - canvas.offsetTop;
    
    var xTotalVel = player.x - destX;
    var yTotalVel = player.y - destY;
    
    var totalVel = Math.abs(xTotalVel) + Math.abs(yTotalVel);
    var totalFPS = 3;

    var xVelocity = xTotalVel * totalFPS / totalVel;
    var yVelocity = yTotalVel * totalFPS / totalVel;
    
    shot = {
        shoter:         player,
        origin:         {x: player.x + 25, y: player.y + 25},
        position:       {x: player.x + 25, y: player.y + 25},
        velocity:       {x: xVelocity, y: yVelocity},
        draw:           false
    };
    
    // Adding a shoot
    var shotIndex = shots.push(shot);
    moveShot(shotIndex);
});

function moveShot(shotIndex) {
    shotIndex -= 1;
    
    var startDrawing = 0;
    
    var shotAnimation = setInterval(function() {
        shots[shotIndex].position.x -= shots[shotIndex].velocity.x;
        shots[shotIndex].position.y -= shots[shotIndex].velocity.y;
            
        if (startDrawing == 15) {
            shots[shotIndex].draw = true;
        } else if (startDrawing >= 15) {
            render();
        }
            
        if (shots[shotIndex].position.x > 620 || shots[shotIndex].position.x < 0 ||
            shots[shotIndex].position.y > 620 || shots[shotIndex].position.y < 0) {
                shots[shotIndex].draw = false;
            clearInterval(shotAnimation);
        }
        startDrawing++;
    }, 10);
}