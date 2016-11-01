import Util from './util';
import $ from 'jQuery';

/*
/ @class SuggestionListDropdown - builds the SuggestionList Dom object
*/

class SuggestionListDropdown {

    constructor(inputEl) {
        this.inputEl = inputEl;
        this.topOffset = 0;
        this.leftOffset = 0;
        this.zIndex = 10000;
        this.setRandId();
        this._buildDom();
    }

    _buildDom() {
        this.$suggestionBox = $('<div id="' + this.randId + '" class="suggestion-box">FOOBAR!</div>').appendTo('body');
    }

    /* Update the position of the suggestionList */
    updatePosition() {
        // Calculates the vertical padding and broder for the input box so the list isn't placed over the top.
        let borders = Util.calculateVerticalBorderWidth(this.inputEl);
        let padding = Util.calculateVerticalPadding(this.inputEl);
        let offset = this.inputEl.offset();

        this.$suggestionBox.css({
            'position': 'absolute',
            'zIndex': this.zIndex,
            'left': (offset.left) + this.leftOffset,
            'top': (offset.top) + (this.inputEl.height() + borders + padding + this.topOffset)
        });
    }

    /*
     * Show the suggestion box
     */
    show() {
        this.updatePosition();
        this.setWidth();
        this.renderSuggestionsList();
        this.$suggestionBox.css('display', 'block');
    }

    /**
     * Sets the width of the suggestion box
     */
    setWidth() {
        let searchBoxWidth = this.getSearchBoxWidth() - Util.calculateHorizontalBorders(this.$suggestionBox);
        this.$suggestionBox.css({
            'min-width': searchBoxWidth
        });

        /*       let searchBoxWidth = this.getSearchBoxWidth() + options.widthAdjustment;

                if (options.menuWidth == 'auto') {
                    $suggestionBox.css({
                        'min-width': searchBoxWidth
                    });
                } else if (options.menuWidth == 'constrain') {
                    $suggestionBox.css({
                        'width': searchBoxWidth
                    });
                }*/
    }

    setSuggestions(suggestions) {
        this.suggestions = suggestions;
    }

    getSuggestions() {
        return this.suggestions;
    }

    /**
     * Returns the width of the search box
     * @returns {number}
     */
    getSearchBoxWidth() {
        return (
            this.inputEl.width() +
            Util.getCssValue(this.inputEl, 'border-left-width') +
            Util.getCssValue(this.inputEl, 'border-right-width') +
            Util.getCssValue(this.inputEl, 'padding-left') +
            Util.getCssValue(this.inputEl, 'padding-right')
        );
    }

    /*
     * Hide the suggestion box
     */
    hide() {
        this.$suggestionBox.css('display', 'none');;
    }

    renderSuggestionsList() {
    	var heading = 'Suggestions';

    	let suggestions = this.suggestions.slice(0, 1);

        var $suggestionMarkup = `<div class="suggestion-header">${heading}</div>` +
            '<ul class="suggestion-box-list">';
            suggestions.forEach((item) => {
               $suggestionMarkup += `<li><a href="#">${item.suggestion}</a></li>`;
            })

        $suggestionMarkup += '</ul>'

            this.$suggestionBox.html($suggestionMarkup);

    }

    getLeftOffset() {
        return this.leftOffset;
    }

    setLeftOffset(offset) {
        this.leftOffset = offset;
    }

    getTopOffset() {
        return this.topOffset;
    }

    setTopOffset(offset) {
        this.topOffset = offset;
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex;
    }

    getZIndex() {
        return this.zIndex;
    }

    getId() {
        return this.Id;
    }

    setId(id) {
        this.Id = id;
    }

    setRandId() {
        this.Id = 'suggestion-box-' + Math.floor(Math.random() * 10000000);
    }

}

export default SuggestionListDropdown;
