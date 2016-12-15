import SuggestionList from './SuggestionList.js';
import Util from './util.js';
import keys from './constants/keys.js';
import Anubis from './Anubis.js';
import TemplateParser from './TemplateParser.js';
import Typeahead from './Typeahead.js';
import Suggestions from './Suggestions.js';
import defaultOptions from './options.js';
import defaultTemplate from './template.js';

class SuggestionBox {

    constructor(options, context) {
        this.context = context;

        this.search = this.context.val();

        this._defaults = JSON.parse(JSON.stringify(defaultOptions))

        this.options = $.extend(defaultOptions, options);

        this.perpetualFetch = (this.options.fetchEvery !== -1) ? true : false;
        this.fetchRate = this.options.fetchAfter;
        this.endFetch = false;
        this.pending = false;

        this._checkFilterForTypeahead();
        // load default template into options 
        this.templateParser = this._buildTemplate();

        this._initAnubis();

        this.suggestions = new Suggestions();

        this.typeahead = new Typeahead(this.suggestions, this.options.searchBy);
        this.suggestionList = new SuggestionList(this.context, this.templateParser, this.options, this.typeahead, this.suggestions);


        this.context.on('keyup', this._keyupEvents.bind(this));
        this.context.on('blur', this._blurEvents.bind(this));
        this.context.on('focus', this._focusEvents.bind(this));
        this.context.on('keydown', this._keydownEvents.bind(this));
        this.context.on('paste', this._pasteEvents.bind(this))


        // Set up typeahead option
        this._initTypeahead();
        this.autocomplete = this.context.attr('autocomplete');

        this.context.attr('autocomplete', 'off');

        this.radiusDefaults = {
            bottomLeft: Util.getCssValue(this.context, 'border-bottom-right-radius'),
            bottomRight: Util.getCssValue(this.context, 'border-bottom-right-radius')
        }

        // Preload the loading image if it has been supplied so it loads faster!
        if (this.options.loadImage) {
            $('<img/>')[0].src = this.options.loadImage;
        }

        // If we are prefetching our data
        if (this.options.prefetch) {
            this.updateSuggestions(this.context.val(), true);
        }

        $(document).on('suggestion-list.close', () => {
            Util.applyBorderRadius(this.context, this.radiusDefaults.bottomLeft, this.radiusDefaults.bottomRight);
        });

        $(document).on(this.options.customEvents.loading, (e, status) => {
            if (status === true) { 
                this.context.css('background', "url('" + this.options.loadImage + "') no-repeat 99% 50%");
                this.context.css('backgroundColor', "#fff");
            } else {
                this.context.css('background', "");
            }
        });
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
            this.hideSuggestions();
        } else {
            if ((this.options.url.length > 0 && (!this.pending) && (this.anubis.getLastSearch().length > search.length || this.anubis.getLastSearch().length === 0) && !this.endFetch) || this.perpetualFetch) {

                this.anubis.setSearch(search);
                this.pending = true;
                //   this.context.css('background', "url('" + this.options.loadImage + "') no-repeat 99% 50%");
                $.event.trigger(this.options.customEvents.loading, true);
                setTimeout(() => {
                    this.loadSuggestionData(forceFetch);
                }, this.fetchRate);

                this.endFetch = this.options.fetchOnce;

                if (this.perpetualFetch) {
                    // make sure we continue to filter
                    this.showSuggestions();
                    this.fetchRate = this.options.fetchEvery;
                }

            } else {
                this.showSuggestions();
            }
        }
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
            this.context.css('background', "");
            this.pending = false;
        }
    }

    /*
     * Show the suggestions list
     */
    showSuggestions() {
        // Set the suggesation (SuggestionList holds a reference to this object)
        this.suggestions.setSuggestions(this.anubis.getSuggestions());

        // Don't show an empty list
        if (this.suggestions.getSuggestions().length > 0) {

            let borders = Util.calculateVerticalBorderWidth(this.context);
            let padding = Util.calculateVerticalPadding(this.context);
            let offset = this.context.offset();

            this.suggestionList.updatePosition((offset.left) + this.options.leftOffset, (offset.top) + (this.context.height() + borders + padding + this.options.topOffset));
            this.suggestionList.setWidth(this.getSearchBoxWidth() + this.options.widthAdjustment);

            this.typeahead.updateTypeaheadPosition(this.context);

            if (this.options.adjustBorderRadius) {
                Util.applyBorderRadius(this.context, 0, 0);
            }

            this.suggestionList.show();
        } else {
            $.event.trigger(this.options.customEvents.noSuggestions)
            this.hideSuggestions();
        }
    }

    /**
     * Returns the width of the search box
     * @returns {number}
     */
    getSearchBoxWidth() {
        return (
            this.context.width() +
            Util.getCssValue(this.context, 'border-left-width') +
            Util.getCssValue(this.context, 'border-right-width') +
            Util.getCssValue(this.context, 'padding-left') +
            Util.getCssValue(this.context, 'padding-right')
        );
    }

    /**
     * Hides the suggestion list
     */
    hideSuggestions() {
        this.typeahead.removeTypeahead();
        this.suggestionList.hide();
        this.suggestions.setSuggestions([]);
    }

    /**
     * The actions to perform when data has been successfully fetched from the server
     */
    _fetchSuggestionsCallback() {

        return (data) => {
            this.anubis.setData(data);
            let thedata = this.anubis.getData();

            // Only show if a selection was not made while wating for a response
            if (!this.suggestionList.isSuggestionChosen() && this.anubis.getSearch().length > 0) {
                this.showSuggestions();
            } else {
                this.hideSuggestions();
            }

            this.suggestionList.setIsSuggestionChosen(false);
            this.pending = false;

            $.event.trigger(this.options.customEvents.loading, [false]);
            $.event.trigger(this.options.customEvents.ajaxSuccess, [data]);
        }
    }

    /*
     * Applies the give border-radius to the search input, used when diosplaying suggestion list
     * with an input that has a border radius.
     */
    _applyBorderRadius(left, right) {
        this.context.css('border-bottom-left-radius', left);
        this.context.css('border-bottom-right-radius', right);
    }

    /*
     * Checks that the filter pattern is suitable for uisng typeahed and throw out a warning if it is not.
     */
    _checkFilterForTypeahead() {
        if (this.options.filter !== "^{{INPUT}}" && this.options.typeahead) {
            Util.logger(this.options.debug, 'Using a custom filter pattern with the typeahed option can cause unexpected results', 'warn');
        }
    }

    /**
     *  Destroy the suggestionBox
     */
    destroy() {
        // Remove reference to this suggestionBox instance from data
        $.removeData(this.context.get()[0], 'suggestionBox');

        // remove event handlers
        this.context.unbind('keyup');
        this.context.unbind('blur');
        this.context.unbind('focus');
        this.context.unbind('keydown');
        this.context.unbind('paste');

        // destroy the suggestionList
        this.suggestionList.destroy();

        // remove typeahead
        this.context.unwrap("#suggestion-box-typeahead");
        // remove injected typeahed css
        $("#suggestion-box-dynamic-typeahead").remove();

        // reset autocomplete to it's initial value
        this.context.attr('autocomplete', this.autocomplete);

        // delete class instances
        delete this.anubis;
        delete this.typeahead;
        delete this.suggestionList;

        // Remove the loading spinner
        this.context.css('background', "");

        // reset default options, $.extend overwrites defaultOptions which are global, 
        // so re-overwrite the ones set here to the orignal defaults.
        $.extend(defaultOptions, this._defaults);
    }

    /*
     * Returns the template as a string
     * @return {String}
     */
    _buildTemplate() {
        let template = (Util.isId(this.options.template)) ? $(this.options.template).html() : this.options.template;
        template = (!template) ? defaultTemplate : template;
        return new TemplateParser(template, this.options.debug);
    }

    /**
     * Returns the Anubis object
     * @return {Anubis}
     */
    getAnubis() {
        return this.anubis;
    }

    /**
     * Sets the Anubis object
     * @param {Anubis} anubis
     */
    setAnubis(anubis) {
        this.anubis = anubis;
    }

    getSuggestionList() {
        return this.suggestionList;
    }

    setSuggestionList(suggestionList) {
        this.suggestionList = suggestionList;
    }

    getTypeahead() {
        return this.typeahead;
    }

    setTypeahead(typeahead) {
        this.typeahead = typeahead;
    }

    getTemplateParser() {
        return this.templateParser;
    }

    setTemplateParser(templateParser) {
        this.templateParser = templateParser;
    }

    /**
     * Instantiates the Anubis object with basic setup.
     */
    _initAnubis() {
        this.anubis = new Anubis(this.options.searchBy, this.options.filter, this.options.sort, this.options.paramName, this.options.customParams, this.options.dataRoot,this.options.customEvents.ajaxError);
        this.anubis.setData(this.options.data);
    }

    /**
     * Creates the typeahead Markup and injects it into the page
     */
    _initTypeahead() {
        if (this.options.typeahead) {
            this.context.wrap('<div id="suggestion-box-typeahead" data-placeholder=""></div>');
            let top = Util.getCssValue(this.context, 'padding-top') + Util.getCssValue(this.context, 'border-top-width');
            let left = Util.getCssValue(this.context, 'padding-left') + Util.getCssValue(this.context, 'border-left-width');
            $("head").append('<style id="suggestion-box-dynamic-typeahead">#suggestion-box-typeahead::after{left:' + left + 'px;top:' + top + 'px;}</style>');
        }
    }

    /**
     * Clears the last suggestion and updates the suggestions list, useful for `ctrl+v` paste
     * when a user highlights the current text and pastes new text over the top.
     * @param search - The new search for the suggestion list
     */
    clearAndUpdate(search) {
        this.suggestions.setSuggestions([]);
        this.anubis.clearLastSearch();
        this.updateSuggestions(search, false);
    }

    /*
     * Updates the typeahead
     */
    updateTypeahead() {
        if (this.context.val() !== "") {
            let selectedIndex = this.suggestionList.getSelectedItemIndex();

            this.typeahead.setCurrentInput(this.context.val());
            let value = this.typeahead.getTypeahead(selectedIndex);

            this.typeahead.updateTypeahead(value, this.context.val());
        }
    }

    /**
     * Set method for setting data option (automagically called via set())
     */
    _setData(data) {
        this.options.data = data;
        this.anubis.setData(data);
        //this.getSuggestions();
    }

    /**
     * Set method for setting search option (automagically called via set())
     */
    _setSearchBy(searchBy) {
        this.options.searchBy = searchBy;
        this.anubis.setSearchBy(searchBy);

        this.typeahead.setSearchBy(searchBy)
    }

    /**
     * Set method for setting filter option (automagically called via set())
     */
    _setFilter(filter) {
        this.options.filter = filter;
        this.anubis.setFilter(filter);
        this._checkFilterForTypeahead();
    }

    /**
     * Set method for setting sort option (automagically called via set())
     */
    _setSort(sort) {
        this.options.sort = sort;
        this.anubis.setSort(sort);
    }

    /**
     * Set method for setting template option (automagically called via set())
     */
    _setTemplate(template) {
        this.options.template = template;
        this.templateParser = this._buildTemplate();
        this.suggestionList.setTemplate(this.templateParser);
    }

    /**
     * Set method for setting debug option (automagically called via set())
     */
    _setDebug(debug) {
        this.options.debug = debug;
        this.templateParser.setDebug(debug);
    }

    /**
     * The set method for setting options after SUggestionBox has been instantiated
     */
    set(name, value) {
        // check if a function exists to set this option, and map the request, otherwise just set it as normal
        let funcName = '_set' + name.charAt(0).toUpperCase() + name.slice(1);
        if (typeof this[funcName] === "function") {
            this[funcName].call(this, value);
        } else {
            this.options[name] = value;
            this.suggestionList.buildDom();
            this._checkFilterForTypeahead();
        }
    }

    /**
     * Returns the options object
     */
    getOptions() {
        return this.options;
    }

    _keyupEvents(e) {
        if (!this._isReservedKey(e)) {
            this.getSuggestions();
            this.updateTypeahead();
            this.suggestionList.setIsSuggestionChosen(false);
        }
    }

    _keydownEvents(e) {
        if (e.which == keys.DOWN_ARROW_KEY) {
            e.preventDefault();

            this.anubis.setSearch(this.context.val());

            this.suggestionList.moveDown(true);
            this.updateTypeahead();
            this.showSuggestions();
        }
        if (this.suggestionList.isOpen()) {
            if (e.which == keys.UP_ARROW_KEY) {
                e.preventDefault();
                this.suggestionList.moveUp(true);
                this.updateTypeahead();
            }
            if (e.which === keys.ENTER_KEY) {
                e.preventDefault();
                this.suggestionList.doClick(e);
            }
            if (e.which == keys.ESCAPE_KEY) {
                e.preventDefault();
                $.event.trigger(this.options.customEvents.loading, false);
                this.hideSuggestions();
            }
        }
    }

    getSuggestions() {
        this.updateSuggestions(this.context.val(), false);
    }

    /**
     * Events for when the search box is focused
     */
    _focusEvents() {
        this.anubis.setSearch(this.context.val());
        this.showSuggestions();

    }

    /**
     * Events for when the search box loses focus
     */
    _blurEvents() {
        if (!this.suggestionList.isHovering()) {
            $.event.trigger(this.options.customEvents.loading, false);
            this.hideSuggestions();
        }
    }

    /**
     * Events for when text is pasted in to the search box
     */
    _pasteEvents() {

        // Simulate keyup after 200ms otherwise the value of the search box will not be available
        setTimeout(() => {
            this.clearAndUpdate(this.context.val());
        }, 200);
    }

    _isReservedKey(e) {
        return Util.inObject(e.which, keys);
    }
}

export default SuggestionBox;
