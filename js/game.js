/**
 * Game playability
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

// Players online (get from server)
var players = new Array();
var shots = new Array();

// Define local web browser player
var player = {
    username: username,
    x: 0, y: 0,
    sprite: generateRandomSprite(),
    lifes: 3
};

var sprites = document.getElementById("sprites");
var canvas;         // Canvas element
var canvasContext;  // Canvas context (where things will be rendered)
var socket = io.connect('http://192.168.1.35:8080'); // Make connection with server

// Tell the server that there is a new player
socket.emit('join', player, +new Date());

// Initialize the canvas
function setCanvas() {
    canvas = document.getElementById("game");
    canvasContext = canvas.getContext("2d");
    
    setInterval(function() {
        render();
    }, 10);
}

// Remove elements from canvas
function clearCanvas() {
    canvas.width = canvas.width;
}

// Write elements (sprites, shots, etc) on canvas
function render() {
    clearCanvas();
    drawPlayers();
    drawShots();
    //drawHearts();
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
            canvasContext.fontSize = "14px";
            canvasContext.fillStyle = "#111";
            canvasContext.textAlign = "center";
            canvasContext.fillText(
                players[i].username, 
                players[i].x + 25, players[i].y + 25
            );
        }
    }
}

function drawShots() {
    if (shots.length > 0) {
        for (var i = 0; i < shots.length; i++) {
            if (shots[i].draw) {
                canvasContext.beginPath();
                canvasContext.fillStyle = '#ff00ff';
                canvasContext.arc(shots[i].position.x, shots[i].position.y, 5, 0, Math.PI * 180);
                canvasContext.fill();
                manageCollision(i);
            }
        }
    }
}

function manageCollision(i) {
    if (shots[i].draw) {
        if (shots[i].shoter.username != player.username) {
            if (shots[i].position.x >= player.x && shots[i].position.x <= (player.x + 50) &&
                shots[i].position.y >= player.y && shots[i].position.y <= (player.y + 50)) {
                socket.emit('attacked', shots[i]);
            }
        } 
    }
}

function drawHearts() {
    // Draw hearts
    canvasContext.font = "30px Arial";
    canvasContext.fillStyle = "#111";
    canvasContext.textAlign = 'left';
    var hearts = '';
    for (var i = 0; i < player.lifes; i++) {
        hearts += '♥ ';
    }
    canvasContext.fillText(hearts, 520, 30);
}

$.getScript('http://192.168.1.35/blocker/js/clientListener.js');
$.getScript('http://192.168.1.35/blocker/js/keyboardListener.js');
$.getScript('http://192.168.1.35/blocker/js/mouseListener.js');
