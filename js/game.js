/**
 * Game playability
 * @since 1st release
 */

function setCanvas() {
    canvas = document.getElementById("game");
    canvasContext = canvas.getContext("2d");
    render();
}

function clearCanvas() {
    canvas.width = canvas.width;
}

function render() {
    clearCanvas();
    drawPlayers();
    drawShots();
}

var shoot = new Array();

function drawShots() {
    if (shoot.length > 0) {
        for (var i = 0; i < shoot.length; i++) {
            canvasContext.fillStyle = "#000";
            canvasContext.arc(shoot.position.x, shoot.position.y, 10, 0, Math.PI * 180, false);
            shoot.position.x += 2;
            shoot.position.y += 4;
        }
    }
}

// On shoting
window.addEventListener('mousedown', function(e) {
    var destX = e.x;
    var destY = e.y;
    var me = player[0];
    
    destX -= canvas.offsetLeft;
    destY -= canvas.offsetTop;
    
    // Adding a shoot
    shoot.push({
        shoter:         me,
        position:       {x: me.x + 25, y: me.y + 25}, 
        destination:    {x: destX, y: destY}
    });
});

function moveShot() {
    
}

function drawPlayers() {
    for (var i = 0; i < player.length; i++) {
        // Draw sprite
        pSprite = player[i].sprite;
        canvasContext.drawImage(sprite, pSprite.x, pSprite.y, pSprite.ax, pSprite.ay, player[i].x, player[i].y, 50, 50);
        
        // Draw username
        canvasContext.font = "13px";
        canvasContext.fillStyle = "#111";
        canvasContext.textAlign = "center";
        canvasContext.fillText(player[i].username, player[i].x + 25, player[i].y + 25);
    }
}

var animationOn = false;
  
window.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 37: movePlayer('left'); break;
        case 38: movePlayer('up'); break;
        case 39: movePlayer('right'); break;
        case 40: movePlayer('down'); break;
    }
});

function movePlayer(direction) {
    if (!animationOn) {
        animationOn = true; // Used to stop typing when the movement is on
        movedPlayer = player[0]; // Player to be moved
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
            if (player[0].x < 0) {
                player[0].x = 595;
            } else if (player[0].x > 595) {
                player[0].x = 0;
            }
            
            // Add an vertical infinite effect
            if (player[0].y < 0) {
                player[0].y = 595;
            } else if (player[0].y > 595) {
                player[0].y = 0;
            }
            
            // Emit a move event to the server
            socket.emit('move', {username: username, x: movedPlayer.x, y: movedPlayer.y, sprite: movedPlayer.sprite});
            
            // Write players on new position
            render();
            
            // When the animation is over, stop interval
            if (animationMovement == 10) {
                clearInterval(animation);
                animationOn = false;
            }
        }, 5);
    }
}