import Dropdown from './Dropdown';
import Util from './util';

/*
/ @class SuggestionListDropdown - builds the SuggestionList Dom object
*/

class SuggestionList extends Dropdown {

    constructor(inputEl, templateParser, options, anubis, typeahead, suggestions) {
        super(options);

        this.inputEl = inputEl;
        this.templateParser = templateParser;
        this.anubis = anubis;
        this.typeahead = typeahead;
        this.suggestions = suggestions;

        // Get the fatch options
        this.perpetualFetch = (this.options.fetchEvery !== -1) ? true : false;
        this.fetchRate = this.options.fetchAfter;
        this.endFetch = false;

        // Sets up the border radius defaults so we can change the border radius back when menu closes
        this.radiusDefaults = {
            bottomLeft: Util.getCssValue(this.inputEl, 'border-bottom-right-radius'),
            bottomRight: Util.getCssValue(this.inputEl, 'border-bottom-right-radius')
        }
    }

    /**
     * Reset the template by creating a new Template object, this is necassary because template
     * Parser automtically parses the node tree, so it doesn't have to be done multiple times.
     */
    setTemplate(templateParser) {
        this.templateParser = templateParser;
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
            this.anubis.fetchSuggestions(this.options.url, this._fetchSuggestionsCallback());
        } else {
            this.inputEl.css('background', "");
        }
    }

    /**
     * The actions to perform when data has been successfullt fetched from the server
     */
    _fetchSuggestionsCallback() {
        return (data) => {
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

        this.$menu.css({
            'position': 'absolute',
            'zIndex': this.options.zIndex,
            'left': (offset.left) + this.options.leftOffset,
            'top': (offset.top) + (this.inputEl.height() + borders + padding + this.options.topOffset)
        });
    }


    // This should be the show() method without actually displaying the box, which shoul dbe done from suggestionBox class
    setSuggestions(suggestions){

    }

    // This should be the hide() method without actually hiding the box, the dropdown shoul not be responsibnle for how it is displayed.
    reset(){}

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

            if (this.$menu.css('display') === 'none') {
                this.$menu.fadeIn();
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
        this.$menu.css(width);
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
     * Hide the suggestion list
     */
    hide() {
        this.selectedLi = -1;
        this._applyBorderRadius(this.radiusDefaults.bottomLeft, this.radiusDefaults.bottomRight);
        this.$menu.css('display', 'none');
        this.typeahead.removeTypeahead();
        this.$menu.css('display');
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

        this.$menu.html(suggestionMarkup);

    }

    displayEl(expression) {
        try {
            return new Function(("return " + expression + "? true : false"))();
        } catch (e) {
            Util.logger(this.options.debug, 'Invalid "sb-show" expression in template. Remember to wrap any strings in quotes even if they are template items.', 'warn');
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
        super.select(position, scroll);

        let value = this.typeahead.getTypeahead(position);
        this.typeahead.updateTypeahead(value, this.suggestions.getSuggestions()[position]);
    }


    /**
     * Moves the selection down to the next suggestion
     */
    moveDown(scroll) {
        var listSize = this.$menu.find('#suggestion-list > li').length;

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
            this.selectedLi = this.$menu.find('#suggestion-list > li').length - 1;
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
     * Events for when the mouse leaves the suggestion box
     * @param e
     */
    mouseoutEvents(e) {
        super.mouseoutEvents(e);

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
     * Performs the click action, this can be called for any event you want to recreate a click action for.
     * @param e
     */
    doClick(e) {
        super.doClick(e);

        let suggestion = this.suggestions.getSuggestions()[this.selectedLi];
        let selectedEl = this.$menu.find('#suggestion-list > li:eq(' + this.selectedLi + ')');

        // TODO: Make sure this callback works for non-object arrays!
        this.options.onClick(suggestion[this.options.searchBy], suggestion, e, this.inputEl, selectedEl);
        this.hide();

        this.typeahead.removeTypeahead();
    }
}

export default SuggestionList;
