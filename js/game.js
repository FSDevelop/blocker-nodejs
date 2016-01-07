/**
 * Game playability
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

// Players online (get from server)
var players = new Array();

// Define local web browser player
var player = {
    username: username,
    x: 0, y: 0,
    sprite: generateRandomSprite()
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
    render();
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

var shots = new Array();

function drawShots() {
    if (shots.length > 0) {
        for (var i = 0; i < shots.length; i++) {
            if (shots[i].draw) {
                canvasContext.beginPath();
                canvasContext.fillStyle = '#ff00ff';
                canvasContext.arc(shots[i].position.x, shots[i].position.y, 5, 0, Math.PI * 180);
                canvasContext.fill();
            }
        }
    }
}

$.getScript('http://192.168.1.35/blocker/js/clientListener.js');
$.getScript('http://192.168.1.35/blocker/js/keyboardListener.js');
$.getScript('http://192.168.1.35/blocker/js/mouseListener.js');
