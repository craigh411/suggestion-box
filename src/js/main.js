import SuggestionBox from './suggestion-box.js';

(function($) {
    $.fn.suggestionBox = function(options) {
        // Get the bound dom element
        var domElement = $(this).get()[0];
            
        var suggestionBox = $.data(domElement, 'suggestionBox');

        if (!suggestionBox) {
            suggestionBox = new SuggestionBox(options, this);
            $.data(domElement, 'suggestionBox', suggestionBox);
        }

        return suggestionBox;
    };
}(jQuery));
