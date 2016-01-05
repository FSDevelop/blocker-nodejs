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
        canvasContext.font = "12px";
        canvasContext.fillStyle = "#111";
        canvasContext.textAlign = "center";
        canvasContext.fillText(player[i].username, player[i].x + 25, player[i].y + 25);
    }
}
  
window.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 37: player[0].x -= 50; break;
        case 38: player[0].y -= 50; break;
        case 39: player[0].x += 50; break;
        case 40: player[0].y += 50; break;
    }
    
    if (player[0].x < 0) {
        player[0].x = 650;
    } else if (player[0].x > 650) {
        player[0].x = 0;
    }
    
    if (player[0].y < 0) {
        player[0].y = 650;
    } else if (player[0].y > 650) {
        player[0].y = 0;
    }
    
    // Emit a move event to the server
    socket.emit('move', {username: username, x: player[0].x, y: player[0].y, sprite: player[0].sprite});
    
    // Draw all players again
    render();
});