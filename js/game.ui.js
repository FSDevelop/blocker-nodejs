/**
 * UI functionality (first script to run)
 * @since January, 2016
 */

var username;
var host = 'http://localhost';

$(function() {
    // Focus the input
    $('.username-div input').focus();
    
    // When the user press enter
    $('.username-div input').keydown(function(e) {
        if (e.keyCode == 13) {
            
            // Validate input
            if ($(this).val().length <= 10 && $(this).val().length > 1) {
                
                $('.username-div').fadeOut(function() {
                    $('#game').fadeIn();
                });
                
                // Set username and load game
                username = $(this).val();
                
                // Start the game
                setTimeout(function() {
                    $.getScript(host + '/blocker/js/gameUtility.js', function() {
                        $.getScript(host + '/blocker/js/game.js');
                    });
                }, 500);
                
            } else {
                alert('Name between 1 and 6 characters');
                return false;
            }
            
        }
    });
});