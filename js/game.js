/**
 * Game playability
 * @author  Federico Sosa (federico.sosa@modelit.xyz)
 * @since   January, 2016
 */
 
$(function() {
    // Get server listener
    $.getScript(host + 'js/serverListener.js');
    
    // Create local player
    var player = createPlayer();
});