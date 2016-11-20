import Util from './util';
import TemplateParser from './TemplateParser'
import Anubis from './Anubis'

/*
/ @class SuggestionListDropdown - builds the SuggestionList Dom object
*/

class SuggestionList {

    constructor(inputEl, templateParser, options, anubis, typeahead, suggestions) {
        this.inputEl = inputEl;

        this.templateParser = templateParser;
        this.anubis = anubis;
        this.typeahead = typeahead;
        this.suggestions = suggestions;

        this.options = options;
        this.perpetualFetch = (this.options.fetchEvery !== -1) ? true : false;
        this.fetchRate = this.options.fetchAfter;
        this.endFetch = false;

        // Whether or not the scroll action was done progrmatically
        this.autoScrolled = false;


        this.radiusDefaults = {
            bottomLeft: Util.getCssValue(this.inputEl, 'border-bottom-right-radius'),
            bottomRight: Util.getCssValue(this.inputEl, 'border-bottom-right-radius')
        }

        this.selectedLi = -1; // Nothing selected
        this.setRandId();
        this.$suggestionBox = $('<div id="' + this.randId + '" class="suggestion-box"></div>').appendTo('body');
        this.buildDom();
    }

    /**
     * Reset the template by creating a new Template object, this is necassary because template
     * Parser automtically parses the node tree, so it doesn't have to be done multiple times.
     */
    setTemplate(templateParser) {
        this.templateParser = templateParser;
    }

    /*
     * Builds the HTML for the suggestion list and binds the events
     */
    buildDom() {
        if (this.options.height) {
            this.$suggestionBox.css('max-height', this.options.height);
        }

        if (this.options.scrollable) {
            this.$suggestionBox.css('overflow', 'auto');
        } else {
            this.$suggestionBox.css('overflow', 'hidden');
        }

        // Bind Events
        this.$suggestionBox.unbind();
        this.$suggestionBox.on('mousemove', this.mousemoveEvents.bind(this));
        this.$suggestionBox.on('mouseout', this.mouseoutEvents.bind(this));
        this.$suggestionBox.on('click', this.clickEvents.bind(this));
    }

    destroy() {
        $('#' + this.randId).remove();
        this.$suggestionBox.unbind();
    }

    setOptions(options) {
        this.options = options;
    }

    /*
     * Updates the suggestion list
     * @param search - The search string for finding suggestions
     * @param forceFetch -   set to true to fetch suggestions regardless of input (used internally for prefetching)
     */
    updateSuggestions(search, forceFetch) {
        this.anubis.setSearch(search);


        if (search == "" && !forceFetch) {
            this.anubis.clearLastSearch();
            this.hide();
        } else {
            if ((this.options.url.length > 0 && (!this.pending) && (this.anubis.getLastSearch().length > search.length || this.anubis.getLastSearch().length === 0) && !this.endFetch) || this.perpetualFetch) {

                this.anubis.setSearch(search);
                this.pending = true;
                this.inputEl.css('background', "url('" + this.options.loadImage + "') no-repeat 99% 50%");

                setTimeout(() => {
                    this.loadSuggestionData(forceFetch);
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

    /*
     * Returns the index for the currently selected/highlighted item 
     */
    getSelectedItemIndex() {
        return this.selectedLi;
    }

    /**
     * Clears the last suggestion and updates the suggestions list, useful for `ctrl+v` paste
     * when a user highlights the current text and pastes new text over the top.
     * @param search - The new search for the suggestion list
     */
    clearAndUpdate(search) {
        this.hide();
        this.anubis.clearLastSearch();
        this.updateSuggestions(search, false);
    }

    /*
     * loads the suggestion data from the server
     * @param forceFetch - set to true to force the fetch (used for prefetch when search value is empty)
     */
    loadSuggestionData(forceFetch) {
        // Don't bother fetching data we already have again
        if (this.anubis.getLastSearch() !== this.anubis.getSearch() || forceFetch) {
            this.anubis.fetchSuggestions(this.options.url, (data) => {
                this.anubis.setData(data);

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

    /* 
     * Update the position of the suggestionList 
     */
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
        this.suggestions.setSuggestions(this.anubis.getSuggestions());

        // Don't reset if a suggestion is still available at the index it's annoying when trying to select while data is loading
        if (this.suggestions.getSuggestions().length < this.selectedLi) {
            this.selectedLi = -1;
        }

        this.renderSuggestionsList();
        // Reset election after page loaded
        if (this.selectedLi > -1) {
            this.select(this.selectedLi);
        }

        if (this.suggestions.getSuggestions().length > 0) {

            this.updatePosition();
            this.setWidth();
            this.typeahead.updateTypeaheadPosition(this.inputEl);

            if (this.options.adjustBorderRadius) {
                this._applyBorderRadius(0, 0);
            }

            if (this.$suggestionBox.css('display') === 'none') {
                this.$suggestionBox.fadeIn();
            }
        } else if (this.options.showNoSuggestionsMessage) {
            // SHOW NO SUGGESTIONS FOUND MESSAGE
        } else {
            this.hide();

        }
    }

    /*
     * Applies the give border-radius to the search input, used when diosplaying suggestion list
     * with an input that has a border radius.
     */
    _applyBorderRadius(left, right) {
        this.inputEl.css('border-bottom-left-radius', left);
        this.inputEl.css('border-bottom-right-radius', right);
    }

    /**
     * Sets the width of the suggestion box
     */
    setWidth() {
        let searchBoxWidth = this.getSearchBoxWidth() + this.options.widthAdjustment;
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
        this._applyBorderRadius(this.radiusDefaults.bottomLeft, this.radiusDefaults.bottomRight);
        this.$suggestionBox.css('display', 'none');
        this.typeahead.removeTypeahead();
        this.$suggestionBox.css('display');
    }



    renderSuggestionsList() {
        let suggestions = this.suggestions.getSuggestions().slice(0, this.options.results);

        var template = this.templateParser.getParsedTemplate();
        template = this.templateParser.replaceHandlebars(template, "header", this.options.heading);

        var listItemMarkup = this.templateParser.getListItemMarkup();



        var listMarkup = "";

        suggestions.forEach((item) => {
            let markup = listItemMarkup;

            if (typeof item == "object") {
                let templateItems = this.templateParser.getTemplatedItems(listItemMarkup);

                templateItems.forEach((templateItem) => {
                    let itemVal = (this.options.highlightMatch && templateItem === this.options.searchBy) ? this.highlightMatches(item[templateItem]) : item[templateItem];
                    markup = this.templateParser.replaceHandlebars(markup, templateItem, itemVal);
                });
            } else {
                let suggestion = (this.options.highlightMatch) ? this.highlightMatches(item) : item;
                markup = this.templateParser.replaceHandlebars(markup, this.options.searchBy, suggestion);
                markup = this.templateParser.replaceHandlebars(markup, "url", "#");
            }

            var markupDom = $(markup);
            this.templateParser.getConditionals().forEach((conditional) => {
                let expression = markupDom.find('#' + conditional.id).attr('sb-show');

                if (!this.displayEl(expression)) {
                    markupDom.find('#' + conditional.id).css('display', 'none');
                }
            });


            listMarkup += "<li>";
            listMarkup += markupDom[0].outerHTML;
            listMarkup += "</li>";

        });



        var suggestionMarkup = this.templateParser.replaceHandlebars(template, "suggestion_list", listMarkup);

        this.$suggestionBox.html(suggestionMarkup);

    }

    displayEl(expression) {
        try {
            return new Function(("return " + expression + "? true : false"))();
        } catch (e) {
            console.log('%c[suggestion-box: warn]: Invalid "sb-show" expression in template. Remember to wrap any strings in quotes even if they are template items.', 'color: #f00');
        }
    }


    highlightMatches(suggestion) {
        // Replace all 
        let filterPattern = this.templateParser.replaceHandlebars(this.options.filter, "INPUT", this.anubis.getSearch());
        return suggestion.replace(new RegExp(filterPattern, 'gi'), '<b>$&</b>');
    }

    /**
     * Selects the suggestion at the given position
     * @param position
     * @param scroll
     */
    select(position, scroll) {
        this.selectedHref = this.$suggestionBox.find("#suggestion-list > li:eq(" + position + ") a").attr('href');
        this.$suggestionBox.find("#suggestion-list > li:eq(" + position + ")").addClass('selected');

        let value = this.typeahead.getTypeahead(position);
        this.typeahead.updateTypeahead(value, this.suggestions.getSuggestions()[position]);

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
            let selection = this.$suggestionBox.find('#suggestion-list > li:eq(' + this.selectedLi + ')').position();

            var pos = (selection) ? selection.top -
                this.$suggestionBox.find('#suggestion-list > li:eq(0)').position().top : 0;
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
        this.$suggestionBox.find("#suggestion-list > li:eq(" + position + ")").removeClass('selected');
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
        var listSize = this.$suggestionBox.find('#suggestion-list > li').length;

        if (!this.isOpen() && this.suggestions.getSuggestions().length > 0) {
            this.updateSuggestions(this.anubis.getSearch(), false);
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
            this.selectedLi = this.$suggestionBox.find('#suggestion-list > li').length - 1;
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

        let suggestion = this.suggestions.getSuggestions()[this.selectedLi];
        let selectedEl = this.$suggestionBox.find('#suggestion-list > li:eq(' + this.selectedLi + ')');

        // TODO: Make sure this callback works for non-object arrays!

        this.options.onClick(suggestion[this.options.searchBy], suggestion, e, this.inputEl, selectedEl);
        this.hide();

        this.typeahead.removeTypeahead();

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
        this.$suggestionBox.find('#suggestion-list > li').removeClass('selected');
    }

    setRandId() {
        this.Id = 'suggestion-box-' + Math.floor(Math.random() * 10000000);
    }

}

export default SuggestionList;
