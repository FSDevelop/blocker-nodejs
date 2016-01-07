/**
 * Some general and utils functions
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2015
 */

function generateRandomSprite() {
    rNum = -1;
    while (rNum != 0 && rNum != 50 && rNum != 100 && rNum != 150) {
      rNum = Math.floor((Math.random() * 150) + 0);
    }

    // Return sprite (position on image);
    return {
        x: rNum, y: 0, 
        ax: 50, ay: 50
    };
}