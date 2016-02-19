/**
 * Game playability
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2016
 */
 
var canvas, context, player;
var players = new Array();
var shots = new Array();
var FPS = 60; // Frames per second

$(prepareGame);

function prepareGame() {
    // Get server listener
    $.getScript(host + '/blocker/js/listeners/server.js', function() {
        // Define canvas element
        canvas = document.getElementById('game');
        context = canvas.getContext('2d');
            
        // Create local player
        player = createPlayer();
        
        // Tell the server there is a new player
        socket.emit('join', player);
    });
}

function gameLoop() {
    var frame = 0;
    setInterval(function() {
        render();
        frame++;
        
        if (frame % FPS == 0) {
            socket.emit('stillAlive', +new Date());
        }
    }, 1000 / FPS);
}

function render() {
    // Clear canvas
    canvas.width = canvas.width;
    
    // Start drawing things
    drawPlayers();
    drawShots();
}

function drawPlayers() {
    if (players.length > 0) {
        for (var i = 0; i < players.length; i++) {
            p = players[i];
            
            // Draw circle
            context.beginPath();
            context.fillStyle = p.color;
            context.arc(p.position.x, p.position.y, 25, 0, Math.PI * 180);
            context.fill();
            
            // Draw border
            context.beginPath();
            context.fillStyle = '#000';
            context.arc(p.position.x, p.position.y, 25, 0, Math.PI * 180);
            context.stroke();
            
            // Draw username
            context.font = "18px Arial";
            context.fillStyle = "#fff";
            context.textAlign = "center";
            context.fillText(p.username, p.position.x, p.position.y + 5);
        }
    }
}

function drawShots() {
    if (shots.length > 0) {
        for (var i = 0; i < shots.length; i++) {
            s = shots[i];
            context.beginPath();
            context.fillStyle = s.shoter.color;
            context.arc(s.position.x, s.position.y, 5, 0, Math.PI * 180);
            context.stroke();
        }
    }
}

$.getScript(host + '/blocker/js/listeners/keyboard.js');
$.getScript(host + '/blocker/js/listeners/mouse.js');