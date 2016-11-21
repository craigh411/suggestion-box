import Util from './util.js'
/*
 * Class to build the dropdown $menu
 */
class Dropdown {
    constructor(options, id) {
        this.id = id || this._getRandId();
        this.mouseHover = false;
        this.options = options;
        this.selectedLi = -1;
        this.autoScrolled = false; // Whether or not the scroll action was done progrmatically


        this.$menu = $('<div id="' + this.id + '" class="suggestion-box"></div>').appendTo('body');
        this.buildDom();
    }

    /*
     * Builds the HTML for the suggestion list and binds the events
     */
    buildDom() {
        if (this.options.height) {
            this.$menu.css('max-height', this.options.height);
        }

        if (this.options.scrollable) {
            this.$menu.css('overflow', 'auto');
        } else {
            this.$menu.css('overflow', 'hidden');
        }

        this._bindEvents();
    }

    _bindEvents() {
        this.$menu.unbind();
        this.$menu.on('mousemove', this.mousemoveEvents.bind(this));
        this.$menu.on('mouseout', this.mouseoutEvents.bind(this));
        this.$menu.on('click', this.clickEvents.bind(this));
    }


    /*
     * Destroys the dropdown $menu
     */
    destroy() {
        this.$menu.unbind();
        $('#' + this.id).remove();
    }


    /**
     *  Selects the item at the given position
     */
    select(position, scroll) {
        this.$menu.find("#suggestion-list > li:eq(" + position + ")").addClass('selected');

        if (scroll) {
            this.doScroll();
        }
    }

    /**
     *  Unselects the item at the given postion
     */
    unselect(position) {
        this.$menu.find("#suggestion-list > li:eq(" + position + ")").removeClass('selected');
    }

   
    /**
     * Events for when the mouse leaves the suggestion box
     */
    mouseoutEvents(event) {
        this.mouseHover = false;
    }

    /**
     * Events for clicks inside the suggestion box
     * @param e
     */
    clickEvents(event) {
        if (this.isSuggestion(event)) {
            event.preventDefault();
            this.doClick(event);
        }
    }

    /**
     * Performs the click action, this can be called for any event you want to recreate a click action for.
     * @param e
     */
    doClick(event) {
        event.preventDefault();
    }

    /**
     * Events for the mouse moving inside the suggestion box
     * @param e
     */
    mousemoveEvents(event) {
        if (this.isSuggestion(event) && !this.autoScrolled) {
            this.unselect(this.selectedLi);
            this.selectedLi = this.getSelectionMouseIsOver(event);
            this.select(this.selectedLi);
        }

        this.mouseHover = true;
        this.autoScrolled = false;
    }

    /**
     * Returns the index of the list item the mouse is currently hovering over
     * @param e
     * @returns {Number}
     */
    getSelectionMouseIsOver(e) {
        let $parentLi = $(e.target).parents('li');

        return $parentLi.parent().children().index($parentLi);
    }

    /**
     * Is the given event made on a suggestion (targets anchor tag)?
     * @param e
     * @returns {boolean}
     */
    isSuggestion(event) {
        return $(event.target).parents('a').length > 0 || event.target.nodeName === 'A';
    }

    simulateClick() {
        if (this.selectedLi > -1) {
            this.$menu.find('.selected a').click();
        }
    }

    resetSelection() {
        this.selectedLi = -1;
        // remove all selected on reset
        this.$menu.find('#suggestion-list > li').removeClass('selected');
    }

    getSelectedItemIndex() {
        return this.selectedLi;
    }

    /**
     * Scrolls the suggestion box to the given position
     * @param to
     */
    doScroll() {
        this.autoScrolled = true;

        if (this.selectedLi > -1) {
            let selection = this.$menu.find('#suggestion-list > li:eq(' + this.selectedLi + ')').position();

            var pos = (selection) ? selection.top -
                this.$menu.find('#suggestion-list > li:eq(0)').position().top : 0;
        }

        // find scroll position at to and set scroll bars to it
        let scrollTo = (this.selectedLi > -1) ? pos : 0;
        this.$menu.scrollTop(scrollTo);
    }

    isOpen() {
        return this.$menu.css('display') !== 'none';
    }

    /*
     * Returns true if the mouse is over the dropdown list
     */
    isHovering() {
        return this.mouseHover;
    }

    _getRandId() {
        return 'suggestion-box-' + Math.floor(Math.random() * 10000000);
    }

    getId(withHash){
    	return (withHash) ? '#'+this.id : this.id;
    }
}

export default Dropdown;
