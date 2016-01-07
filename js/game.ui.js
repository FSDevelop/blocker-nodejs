/**
 * UI functionality
 * @since 1st release
 */

var username;

$(function() {
    // Focus the input
    $('.username-div input').focus();
    
    // When the user press enter
    $('.username-div input').keydown(function(e) {
        if (e.keyCode == 13) {
            
            // Validate input
            if ($(this).val().length <= 6) {
                
                $('.username-div').fadeOut(function() {
                    $('canvas').fadeIn();
                });
                
                // Set username and load game
                username = $(this).val();
                $.getScript('http://192.168.1.35/blocker/js/gameUtility.js');
                $.getScript('http://192.168.1.35/blocker/js/game.js');
                
            } else {
                return false;
            }
            
        }
    });
});