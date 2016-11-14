import Util from './util';
import TemplateParser from './TemplateParser'
import Anubis from './Anubis'
import $ from 'jQuery';
/*
/ @class SuggestionListDropdown - builds the SuggestionList Dom object
*/

class SuggestionListDropdown {

    constructor(inputEl, template, options, anubis, typeAhead) {
        this.inputEl = inputEl;
        this.template = template;

        this.templateParser = new TemplateParser(template);
        this.anubis = anubis;
        this.typeAhead = typeAhead;

        this.options = options;
        this.perpetualFetch = (this.options.fetchEvery !== -1) ? true : false;
        this.fetchRate = this.options.fetchAfter;
        this.endFetch = false;

        // Whether or not the scroll action was done pragmatically
        this.autoScrolled = false;


        this.radiusDefaults = {
            bottomLeft: Util.getCssValue(this.inputEl, 'border-bottom-right-radius'),
            bottomRight: Util.getCssValue(this.inputEl, 'border-bottom-right-radius')
        }

        this.selectedLi = -1; // Nothing selected
        this.setRandId();
        this._buildDom();

        // Bind Events
        this.$suggestionBox.on('mousemove', this.mousemoveEvents.bind(this));
        this.$suggestionBox.on('mouseout', this.mouseoutEvents.bind(this));
        this.$suggestionBox.on('click', this.clickEvents.bind(this));
    }

    _buildDom() {
        this.$suggestionBox = $('<div id="' + this.randId + '" class="suggestion-box"></div>').appendTo('body');
        if (this.options.height) {
            this.$suggestionBox.css('max-height', this.options.height);
        }

        if (this.options.scrollable) {
            this.$suggestionBox.css('overflow', 'auto');
        }
    }

    updateSuggestions(search) {
        this.anubis.setSearch(search);


        if (search == "") {
            this.anubis.clearLastSearch();
            this.hide();
        } else {
            console.log('choose');
            if ((this.options.url && (!this.pending) && (this.anubis.getLastSearch().length > search.length || this.anubis.getLastSearch().length === 0) && !this.endFetch) || this.perpetualFetch) {
                this.anubis.setSearch(search);
                this.pending = true;
                this.inputEl.css('background', "url('" + this.options.loadImage + "') no-repeat 99% 50%");

                setTimeout(() => {
                    this.loadSuggestionData();
                }, this.fetchRate);

                this.endFetch = this.options.fetchOnce;

                if (this.perpetualFetch) {
                    // make sure we continue to filter
                    this.show();
                    this.fetchRate = this.options.fetchEvery;
                }

            } else {
                this.show();
            }
        }

    }

    getSelectedItemIndex() {
        return this.selectedLi;
    }

    getSuggestionAt(index) {
        return this.anubis.getSuggestions()[index];
    }

    /**
     * Clears the last suggestions and updates the suggestions, useful for `ctrl+v` paste
     */
    clearAndUpdate(search) {
        this.hide();
        this.anubis.clearLastSearch();
        this.updateSuggestions(search);
    }

    loadSuggestionData() {
        // Don't bother fetching data we already have again
        if (this.anubis.getLastSearch() !== this.anubis.getSearch()) {
            this.anubis.fetchSuggestions(this.options.url, (data) => {
                this.anubis.setData(data);
                console.log(this.selectionMade);
                // Only show if a selection was not made while wating for a response
                if (!this.selectionMade && this.anubis.getSearch().length > 0) {
                    this.show();
                } else {
                    this.hide();
                }

                this.selectionMade = false;
                this.pending = false;

                this.inputEl.css('background', "");
            });
        } else {
            this.inputEl.css('background', "");
        }
    }

    /* Update the position of the suggestionList */
    updatePosition() {
        // Calculates the vertical padding and broder for the input box so the list isn't placed over the top.
        let borders = Util.calculateVerticalBorderWidth(this.inputEl);
        let padding = Util.calculateVerticalPadding(this.inputEl);
        let offset = this.inputEl.offset();

        this.$suggestionBox.css({
            'position': 'absolute',
            'zIndex': this.options.zIndex,
            'left': (offset.left) + this.options.leftOffset,
            'top': (offset.top) + (this.inputEl.height() + borders + padding + this.options.topOffset)
        });
    }


    /*
     * Show the suggestion box
     */
    show() {

        // Don't reset if a suggestion is still available at the index it's annoying when trying to select while data is loading
        if (this.anubis.getSuggestions().length < this.selectedLi) {
            this.selectedLi = -1;
        }

        this.renderSuggestionsList();
        // Reset election after page loaded
        if (this.selectedLi > -1) {
            this.select(this.selectedLi);
        }

        if (this.anubis.getSuggestions().length > 0) {
            this.updatePosition();
            this.setWidth();


            if (this.options.adjustBorderRadius) {
                this._applyBorderRadius(0, 0);
            }

            this.$suggestionBox.fadeIn();
        } else if (this.options.showNoSuggestionsMessage) {
            // SHOW NO SUGGESTIONS FOUND MESSAGE
        } else {
            this.hide();
        }
    }

    _applyBorderRadius(left, right) {
        this.inputEl.css('border-bottom-left-radius', left);
        this.inputEl.css('border-bottom-right-radius', right);
    }

    /**
     * Sets the width of the suggestion box
     */
    setWidth() {
        let searchBoxWidth = this.getSearchBoxWidth();
        let width = {};
        width[this.options.widthType] = searchBoxWidth;
        this.$suggestionBox.css(width);
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
        this.selectedLi = -1;
        console.log('hide');
        this._applyBorderRadius(this.radiusDefaults.bottomLeft, this.radiusDefaults.bottomRight);
        this.$suggestionBox.css('display', 'none');
        this.typeAhead.removeTypeahead();
    }



    renderSuggestionsList() {
        let suggestions = this.anubis.getSuggestions().slice(0, this.options.results);

        var template = this.templateParser.getParsedTemplate();
        template = this.templateParser.replaceHandlebars(template, "header", this.options.heading);

        var listItemMarkup = this.templateParser.getListItemMarkup();


        var listMarkup = "";

        suggestions.forEach((item) => {
            let markup = listItemMarkup;

            if (typeof item == "object") {
                let templateItems = this.templateParser.getTemplatedItems(listItemMarkup);
                templateItems.forEach((templateItem) => {
                    let itemVal = (this.options.highlightMatch && templateItem === this.options.props.value) ? this.highlightMatches(item[templateItem]) : item[templateItem];
                    markup = this.templateParser.replaceHandlebars(markup, templateItem, itemVal);
                });
            } else {
                let suggestion = (this.options.highlightMatch) ? this.highlightMatches(item) : item;
                markup = this.templateParser.replaceHandlebars(markup, this.options.props.value, suggestion);
                markup = this.templateParser.replaceHandlebars(markup, "url", "#");
            }

            listMarkup += "<li>";
            listMarkup += markup;
            listMarkup += "</li>";

        });




        var suggestionMarkup = this.templateParser.replaceHandlebars(template, "suggestion_list", listMarkup);

        this.$suggestionBox.html(suggestionMarkup);

    }

    highlightMatches(suggestion) {
        // Replace all 
        let filterPattern = this.templateParser.replaceHandlebars(this.options.filter, "INPUT", this.inputEl.val());
        return suggestion.replace(new RegExp(filterPattern, 'gi'), '<b>$&</b>');
    }

    /**
     * Selects the suggestion at the given position
     * @param position
     * @param scroll
     */
    select(position, scroll) {
        this.selectedHref = this.$suggestionBox.find("li:eq(" + position + ") a").attr('href');
        this.$suggestionBox.find("li:eq(" + position + ")").addClass('selected');
        this.typeAhead.updateTypeAhead(position);

        if (scroll) {
            this.doScroll();
        }
    }

    isOpen() {
        return this.$suggestionBox.css('display') !== 'none';
    }

    /**
     * Scrolls the suggestion box to the given position
     * @param to
     */
    doScroll() {
        this.autoScrolled = true;

        if (this.selectedLi > -1) {
            let selection = this.$suggestionBox.find('li:eq(' + this.selectedLi + ')').position();

            var pos = (selection) ? selection.top -
                this.$suggestionBox.find('li:eq(0)').position().top : 0;
        }

        // find scroll position at to and set scroll bars to it
        let scrollTo = (this.selectedLi > -1) ? pos : 0;
        this.$suggestionBox.scrollTop(scrollTo);
    }

    /**
     * Unselects the suggestion at the given position
     * @param position
     */
    unselect(position) {
        this.$suggestionBox.find("li:eq(" + position + ")").removeClass('selected');
    }

    /**
     * Events for the mouse moving inside the suggestion box
     * @param e
     */
    mousemoveEvents(e) {
        if (this.isSuggestion(e) && !this.autoScrolled) {
            this.unselect(this.selectedLi);
            this.selectedLi = this.getSelectionMouseIsOver(e);
            this.select(this.selectedLi);
        }

        this.mouseHover = true;
        this.autoScrolled = false;
    }

    /**
     * Moves the selection down to the next suggestion
     */
    moveDown(scroll) {
        var listSize = this.$suggestionBox.find('li').length;

        if (!this.isOpen() && this.anubis.getSuggestions().length > 0) {
            this.updateSuggestions(this.inputEl.val());
            this.show();
        } else if (this.selectedLi === (listSize - 1)) {
            this.unselect(this.selectedLi);
            this.resetSelection();
        } else {
            this.unselect(this.selectedLi);
            this.selectedLi++;
            this.select(this.selectedLi);
        }

        if (scroll) {
            this.doScroll();
        }


    }

    /**
     * Moves the selection up to the previous suggestions
     */
    moveUp(scroll) {
        if (this.selectedLi > 0) {
            this.unselect(this.selectedLi);
            this.selectedLi--;
            this.select(this.selectedLi);
        } else if (this.selectedLi == -1) {
            this.unselect(this.selectedLi);
            this.selectedLi = this.$suggestionBox.find('li').length - 1;
            this.select(this.selectedLi);
        } else {
            this.unselect(0);
            this.resetSelection();
        }

        if (scroll) {
            this.doScroll();
        }
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
     * Events for when the mouse leaves the suggestion box
     * @param e
     */
    mouseoutEvents(e) {
        if (this.isSuggestion(e) && !this.autoScrolled) {
            this.unselect(this.selectedLi);
            this.resetSelection();
        } else if ($(':focus').attr('id') !== this.inputEl.attr('id')) {
            // We're out of the suggestion box so re-focus on search
            this.inputEl.focus();
        }
        this.mouseHover = false;
    }


    /**
     * Events for clicks inside the suggestion box
     * @param e
     */
    clickEvents(e) {
        if (this.isSuggestion(e)) {
            e.preventDefault();
            this.doClick(e);
        }
    }

    /*
     * Returns true if the mouse is over the dropdown list
     */
    isHovering() {
        return this.mouseHover;
    }

    /**
     * Performs the click action, this can be called for any event you want to recreate a click action for.
     * @param e
     */
    doClick(e) {
        e.preventDefault();

        if (this.pending) {
            this.selectionMade = true;
        }

        if (this.perpetualFetch) {
            //this.getSuggestions();
        }

        let selectionText = this.$suggestionBox.find('li:eq(' + this.selectedLi + ')').text();
        this.options.onClick(e, selectionText, this.selectedHref, this.inputEl);
        this.hide();

        this.typeAhead.removeTypeahead();

    }

    simulateClick() {
        if (this.selectedLi > -1) {
            this.$suggestionBox.find('.selected a').click();
        }
    }


    /**
     * Is the given event made on a suggestion?
     * @param e
     * @returns {boolean}
     */
    isSuggestion(e) {
        return $(e.target).parents('a').length > 0 || e.target.nodeName === 'A';
    }

    /**
     * Resets any selected suggestions
     */
    resetSelection() {
        this.selectedHref = '#';
        this.selectedLi = -1;
        // remove all selected on reset
        this.$suggestionBox.find('li').removeClass('selected');
    }

    setRandId() {
        this.Id = 'suggestion-box-' + Math.floor(Math.random() * 10000000);
    }

}

export default SuggestionListDropdown;
