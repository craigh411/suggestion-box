import Dropdown from './Dropdown';
import Util from './util';

/*
 * @Class SuggestionList - builds the SuggestionList Dom object
 */

class SuggestionList extends Dropdown {

    constructor(inputEl, templateParser, options, typeahead, suggestions) {
        super(options);

        this.inputEl = inputEl;
        this.templateParser = templateParser;
        this.typeahead = typeahead;
        this.suggestions = suggestions;
        this.suggestionChosen = false;
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

    updatePosition(left, top) {
        this.$menu.css({
            'position': 'absolute',
            'zIndex': this.options.zIndex,
            'left': left,
            'top': top
        });
    }

    /*
     * Show the suggestion box
     */
    show() {

        // Don't reset if a suggestion is still available at the index it's annoying when trying to select while data is loading
        if (this.suggestions.getSuggestions().length < this.selectedLi) {
            this.selectedLi = -1;
        }

        this.renderSuggestionsList();
        // Reset selection after page loaded
        if (this.selectedLi > -1) {
            this.select(this.selectedLi);
        }

        if (this.$menu.css('display') === 'none') {
            this.$menu.fadeIn();
        }
    }


    /**
     * Sets the width of the suggestion box
     */
    setWidth(searchBoxWidth) {
        let width = {};
        width[this.options.widthType] = searchBoxWidth;
        this.$menu.css(width);
    }

    /*
     * Hide the suggestion list
     */
    hide() {
        this.selectedLi = -1;
        this.$menu.css('display', 'none');
        $.event.trigger(this.options.customEvents.close)
    }


    _buildMarkupForObjectList(templateItems, item, markup) {
        templateItems.forEach((templateItem) => {
            let itemVal = (this.options.highlightMatch && templateItem === this.options.searchBy) ? this.highlightMatches(item[templateItem]) : item[templateItem];
            markup = this.templateParser.replaceHandlebars(markup, templateItem, itemVal);
        });

        return markup;
    }

    _buildSuggestionListMarkup(markup, listMarkup) {
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

        return listMarkup;
    }

    _buildMarkup(listItemMarkup, item) {
        let markup = listItemMarkup;

        if (typeof item == "object") {
            let templateItems = this.templateParser.getTemplatedItems(listItemMarkup);
            markup = this._buildMarkupForObjectList(templateItems, item, markup);
        } else {
            let suggestion = (this.options.highlightMatch) ? this.highlightMatches(item) : item;
            markup = this.templateParser.replaceHandlebars(markup, this.options.searchBy, suggestion);
            markup = this.templateParser.replaceHandlebars(markup, "url", "#");
        }

        return markup;
    }

    renderSuggestionsList() {
        let suggestions = this.suggestions.getSuggestions().slice(0, this.options.results);

        var template = this.templateParser.getParsedTemplate();
        var listItemMarkup = this.templateParser.getListItemMarkup();
        var listMarkup = "";

        suggestions.forEach((item) => {
            let markup = this._buildMarkup(listItemMarkup, item);
            listMarkup = this._buildSuggestionListMarkup(markup, listMarkup)
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


    /*
     * Highlights parts of the suggestion that match the given input and pattern
     * @param string suggestion
     */
    highlightMatches(suggestion) {
        // Replace all 
        let filterPattern = this.templateParser.replaceHandlebars(this.options.filter, "INPUT", this.inputEl.val());
        return suggestion.replace(new RegExp(filterPattern, 'gi'), '<b>$&</b>');
    }

    /**
     * Selects the suggestion at the given position
     * @param int position
     * @param bool scroll
     */
    select(position, scroll) {
        super.select(position, scroll);

        let value = this.typeahead.getTypeahead(position);
        this.typeahead.updateTypeahead(value, this.suggestions.getSuggestions()[position]);
    }


    /**
     * Moves the selection down to the next suggestion
     * @param bool scroll
     */
    moveDown(scroll) {
        var listSize = this.$menu.find('#suggestion-list > li').length;

/*        if (!this.isOpen() && this.suggestions.getSuggestions().length > 0) {
            //this.show();
            console.log('show!')
        } else */if (this.selectedLi === (listSize - 1)) {
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
     * @param bool scroll
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
     * @param Event event
     */
    doClick(event) {
        super.doClick(event);

        let suggestion = this.suggestions.getSuggestions()[this.selectedLi];
        let selectedEl = this.$menu.find('#suggestion-list > li:eq(' + this.selectedLi + ')');

        let value = (typeof suggestion === "object") ? suggestion[this.options.searchBy] : suggestion;

        this.options.onClick(value, suggestion, event, this.inputEl, selectedEl);
        this.hide();

        // Set the isSuggestionChosen flag to true when a suggestion is selected
        this.setIsSuggestionChosen(true);

        this.typeahead.removeTypeahead();
    }

    /**
     * Returns true if a suggestion has been chosen, this flag is used during ajax calls so the menu
     *  isn't shown when new options are loaded from the server after the user has chosen an suggestion.
     */
    isSuggestionChosen() {
        return this.suggestionChosen;
    }

    /**
     * Set the suggestionChosen flag
     * @param bool suggestionChosen 
     */
    setIsSuggestionChosen(suggestionChosen) {
        this.suggestionChosen = suggestionChosen;
    }
}

export default SuggestionList;
