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
        color:      '#' + Math.floor( Math.random() * 16777215 ).toString(16)
    };
}

function randomPosition() {
    randomX = 1;
    randomY = 1;
    
    while (randomX % 50 != 0)
      randomX = Math.floor((Math.random() * maxX) + 0);
    
    while (randomY % 50 != 0)
      randomY = Math.floor((Math.random() * maxY) + 0);
    
    return { x: randomX, y: randomY };
}