module.exports = function(e, options) {

    // Is the mouse hovering over the suggestion box?
    var mouseHover = false;
    // Whether or not the scroll action was done pragmatically
    var autoScrolled = false;

    // Default values for selected list item
    var selectedLi = -1;
    var selectedHref = '#';

    /**
     * Events for the mouse moving inside the suggestion box
     * @param e
     */
    function mousemoveEvents(e) {
        if (isSuggestion(e) && !autoScrolled) {
            unselect(selectedLi);
            selectedLi = getSelectionMouseIsOver(e);
            select(selectedLi);
        }

        mouseHover = true;
        autoScrolled = false;
    }

    /**
     * Events for when the mouse leaves the suggestion box
     * @param e
     */
    function mouseoutEvents(e) {
        if (isSuggestion(e) && !autoScrolled) {
            unselect(selectedLi);
            resetSelection();
        } else if ($(':focus').attr('id') !== context.attr('id')) {
            // We're out of the suggestion box so re-focus on search
            context.focus();
        }
        mouseHover = false;
    }

    /**
     * Events for clicks inside the suggestion box
     * @param e
     */
    function clickEvents(e) {
        if (isSuggestion(e)) {
            doClick(e);
        }
    }

    /**
     * Is the given event made on a suggestion?
     * @param e
     * @returns {boolean}
     */
    function isSuggestion(e) {
        return $(e.target).parents('a').length > 0 || e.target.nodeName === 'A';
    }


    /**
     * Performs the click action, this can be called for any event you want to recreate a click action for.
     * @param e
     */
    function doClick(e) {
        e.preventDefault();
        options.onClick(e);
    }

    /**
     * Resets any selected suggestions
     */
    function resetSelection() {
        selectedHref = '#';
        selectedLi = -1;
        // remove all selected on reset
        $suggestionBox.find('li').removeClass('selected');
    }

            /**
         * Unselects the suggestion at the given position
         * @param position
         */
        function unselect(position) {
            $suggestionBox.find("li:eq(" + position + ")").removeClass('selected');
        }

                /**
         * Scrolls the suggestion box to the given position
         * @param to
         */
        function doScroll(to) {
            autoScrolled = true;

            if (to > -1) {
                var pos = $suggestionBox.find('li:eq(' + to + ')').position().top -
                    $suggestionBox.find('li:eq(0)').position().top;
            }

            // find scroll position at to and set scroll bars to it
            var scrollTo = (to > -1) ? pos : 0;
            $suggestionBox.scrollTop(scrollTo);
        }

        /**
         * Moves the selection down to the next suggestion
         */
        function moveDown(scroll) {
            var listSize = $suggestionBox.find('li').length;

            if ($suggestionBox.css('display') === 'none') {
                showSuggestions();
            } else if (selectedLi === (listSize - 1)) {
                unselect(selectedLi);
                resetSelection();
            } else {
                unselect(selectedLi);
                selectedLi++;
                select(selectedLi);
            }

            if (scroll) {
                doScroll(selectedLi);
            }
        }

        /**
         * Moves the selection up to the previous suggestions
         */
        function moveUp(scroll) {
            if (selectedLi > 0) {
                unselect(selectedLi);
                selectedLi--;
                select(selectedLi);
            } else if (selectedLi == -1) {
                unselect(selectedLi);
                selectedLi = $suggestionBox.find('li').length - 1;
                select(selectedLi);
            } else {
                unselect(0);
                resetSelection();
            }

            if (scroll) {
                doScroll(selectedLi);
            }
        }
};
