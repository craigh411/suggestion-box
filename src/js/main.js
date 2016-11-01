import $ from 'jQuery';
import SuggestionBox from './suggestion-box.js';

(function($) {
    $.fn.suggestionBox = function(options) {
        // Get the bound dom element
        var domElement = $(this).get()[0];

        var args = $.makeArray(arguments);
        var suggestionBox = $.data(domElement, 'suggestionBox');

        if (suggestionBox) {
            suggestionBox.set(args[0], args[1]);
        } else {
            suggestionBox = new SuggestionBox(options, this);
            $.data(domElement, 'suggestionBox', suggestionBox);
        }

        return suggestionBox;
    };
}(jQuery));
