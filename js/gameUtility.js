/**
 * Some general and util functions
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2016
 */

function createPlayer() {
    return {
        id:         +new Date(),
        username:   username,
        position:   randomPosition(),
        lifes:      3,
        score:      0,
        color:      '#' + Math.floor( Math.random() * 11777215 ).toString(16)
    };
}

function randomPosition() {
    randomX = 1;
    randomY = 1;
    maxX = canvas.width - 25;
    maxY = canvas.height - 25;
    
    while (randomX % 50 != 0)
      randomX = Math.floor((Math.random() * maxX) + 25);
    
    while (randomY % 50 != 0)
      randomY = Math.floor((Math.random() * maxY) + 25);
    
    return { x: randomX, y: randomY };
}