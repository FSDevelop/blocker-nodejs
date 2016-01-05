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
    
    // Draw players
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
    
    // Draw all players again
    //render();
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
                player[0].x = 695;
            } else if (player[0].x > 695) {
                player[0].x = 0;
            }
            
            // Add an vertical infinite effect
            if (player[0].y < 0) {
                player[0].y = 695;
            } else if (player[0].y > 695) {
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