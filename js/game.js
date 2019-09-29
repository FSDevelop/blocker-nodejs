/**
 * Game playability
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

// Players online (get from server)
var players = new Array();
var shots = new Array();
var walls;

// Define local web browser player
var player = {
    id:         +new Date(),
    username:   username,
    x:          randomPosition(750),
    y:          randomPosition(550),
    sprite:     generateRandomSprite(),
    lifes:      3,
    score:      0,
    shotColor:  '#'+Math.floor(Math.random()*16777215).toString(16)
};

var sprites = document.getElementById("sprites");
var canvas;         // Canvas element
var canvasContext;  // Canvas context (where things will be rendered)
var socket = io.connect('http://' + host); // Make connection with server

// Tell the server that there is a new player
socket.emit('join', player);

// Initialize the canvas
function setCanvas() {
    canvas = document.getElementById("game");
    canvasContext = canvas.getContext("2d");
    
    setInterval(function() {
        render();
    }, 20);
}

// Remove elements from canvas
function clearCanvas() {
    canvas.width = canvas.width;
}

// Write elements (sprites, shots, etc) on canvas
function render() {
    clearCanvas();
    drawWalls();        // walls
    drawPlayers();      // players
    drawShots();        // shots
    drawScore();        // score
    drawHearts();       // hearts
    manageCollisions(); // collisions
}

function drawPlayers() {
    // Ensure that there is at least 1 player connected before render
    if (players.length > 0) {
        for (var i = 0; i < players.length; i++) {
            // Draw sprite
            pSprite = players[i].sprite;
            
            // Draw sprite
            canvasContext.drawImage(
                sprites, pSprite.x, pSprite.y, pSprite.ax, pSprite.ay,   // Sprite image position
                players[i].x, players[i].y, 50, 50                      // Position on canvas
            );
            
            // Draw username
            canvasContext.font = "15px Arial";
            canvasContext.fillStyle = "#fff";
            canvasContext.textAlign = "center";
            canvasContext.fillText(
                players[i].username, 
                players[i].x + 25, players[i].y - 5
            );
        }
    }
}

function drawShots() {
    if (shots.length > 0) {
        for (var i = 0; i < shots.length; i++) {
            if (shots[i].draw) {
                canvasContext.beginPath();
                canvasContext.fillStyle = shots[i].color;
                canvasContext.arc(shots[i].position.x, shots[i].position.y, 5, 0, Math.PI * 180);
                canvasContext.fill();
            }
        }
    }
}

var wallsDrawed = false;

function drawWalls() {
    if (walls !== undefined) {
    
        var rows = walls.split('\n');
        for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].split('');
            for (var j = 0; j < cols.length; j++) {
                var field = cols[j];
                if (field == '1') {
                    var xWall = j * 50;
                    var yWall = i * 50;
                        
                    canvasContext.fillStyle = "#000";
                    canvasContext.fillRect(xWall, yWall, 50, 50);
                }
            }
        }
    }
}

function manageCollisions() {
    // Manage shots collisions
    if (shots.length > 0) {
        for (var i = 0; i < shots.length; i++) {
            if (shots[i].draw) {
                for (var j = 0; j < players.length; j++) {
                    if (shots[i].position.x >= players[j].x && shots[i].position.x <= (players[j].x + 50) &&
                        shots[i].position.y >= players[j].y && shots[i].position.y <= (players[j].y + 50)) {
                        if (players[j].id == player.id) {
                            if (shots[i].shoter.id != player.id) {
                                shots[i].draw = false;
                                socket.emit('attacked', players[j], shots[i].shoter);
                            }
                        } else {
                            if (shots[i].shoter.id != players[j].id) {
                                shots[i].draw = false;
                            }
                        }
                    }
                }
            }
        }
    }
}

function drawScore() {
    // Draw hearts
    canvasContext.font = "25px Arial";
    canvasContext.fillStyle = "#999";
    canvasContext.textAlign = 'left';
    canvasContext.fillText('Score: ' + player.score, 50, 35);
}

function drawHearts() {
    // Draw hearts
    canvasContext.font = "30px Arial";
    canvasContext.fillStyle = "#999";
    canvasContext.textAlign = 'left';
    var hearts = '';
    for (var i = 0; i < player.lifes; i++) {
        hearts += '♥ ';
    }
    canvasContext.fillText(hearts, 680, 35);
}

$.getScript('http://' + host + '/blocker/js/clientListener.js');
$.getScript('http://' + host + '/blocker/js/keyboardListener.js');
$.getScript('http://' + host + '/blocker/js/mouseListener.js');
