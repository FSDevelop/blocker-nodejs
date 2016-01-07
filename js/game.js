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

/* TODO: Not used for now
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
*/

$.getScript('http://192.168.1.35/blocker/js/clientListener.js');
$.getScript('http://192.168.1.35/blocker/js/keyboardListener.js');
$.getScript('http://192.168.1.35/blocker/js/mouseListener.js');
