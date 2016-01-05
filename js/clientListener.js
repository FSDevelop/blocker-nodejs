/**
 * Client listener (connected to server)
 * @since 1st release
 */

var player = new Array();
/* 
    player[0] is username
    player[1] is x position
    player[2] is y position
    player[3] is sprite
*/

var socket, canvas, canvasContext;
var sprite = document.getElementById("sprites");

if (username != null && username != '') {
    // Generate a random number (0, 50, 100 or 150) to set the random sprite
    rNum = -1;
    while (rNum != 0 && rNum != 50 && rNum != 100 && rNum != 150) {
      rNum = Math.floor((Math.random() * 150) + 0);
    }
    
    // Set user sprite (position on image);
    userSprite = {x: rNum, y: 0, ax: 50, ay: 50};
    
    // Add client connected player to the map
    player.push({username: username, x: 0, y: 0, sprite: userSprite});
        
    // Initialize game
    setCanvas();
    
    // Every 100 miliseconds send an alive event to the server to avoid disconnection
    setInterval(function(){
      // Emit an alive event to the server
      socket.emit('alive', {username: username, x: player[0].x, y: player[0].y, sprite: player[0].sprite});
    }, 100);
    
    // Make connection with server
    socket = io.connect('http://192.168.1.35:8080');
          
    // Update position on action from client
    socket.on('move', function(playerMoved) {
        
        // Finding player on array
        var index = -1;
        for (var i = 0; i < player.length; i++) {
            if (player[i].username == playerMoved.username) {
                index = i; break;
            }
        }
            
        if (index != -1) {
            // If player already exists update position
            player[index].x = playerMoved.x;
            player[index].y = playerMoved.y;
            player[index].sprite = playerMoved.sprite;
        } else {
            // If player doesn't exist, add a new one
            player.push({username: playerMoved.username, x: playerMoved.x, y: playerMoved.y, sprite: playerMoved.sprite});
        }
            
        // Draw all players again
        render();
    });
  }