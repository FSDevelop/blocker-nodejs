/**
 * Some general and util functions
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2016
 */

// new player class
function Player() {
    this.id         = +new Date();
    this.username   = username;
    this.position   = randomPosition();
    this.lifes      = 3;
    this.score      = 0;
    this.color      = '#' + Math.floor( Math.random() * 11777215 ).toString(16);
}

// new shot class
function Shot(data) {
    this.id         = +new Date();
    this.shoter     = data.shoter;
    this.origin     = data.origin;
    this.position   = data.position;
    this.velocity   = data.velocity;
    this.draw       = data.draw;
}

// generates a random player position
function randomPosition() {
    randomX = 1;
    randomY = 1;
    maxX = canvas.width - 25;
    maxY = canvas.height - 25;
    
    while (randomX % 75 != 0)
      randomX = Math.floor((Math.random() * maxX));
    
    while (randomY % 75 != 0)
      randomY = Math.floor((Math.random() * maxY));
    
    return { x: randomX, y: randomY };
}