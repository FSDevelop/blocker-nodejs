/**
 * UI functionality (first script to run)
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
            if ($(this).val().length <= 6 && $(this).val().length > 1) {
                
                $('.username-div').fadeOut(function() {
                    $('.game-content').fadeIn();
                });
                
                // Set username and load game
                username = $(this).val();
                
                // Start the game
                setTimeout(function() {
                    $.getScript('http://192.168.1.35/blocker/js/gameUtility.js');
                    $.getScript('http://192.168.1.35/blocker/js/game.js');
                }, 500);
                
            } else {
                alert('Name between 1 and 6 characters');
                return false;
            }
            
        }
    });
});