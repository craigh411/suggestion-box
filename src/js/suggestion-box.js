import Dropdown from './SuggestionListDropdown.js';
import Util from './util.js';
import keys from './constants/keys.js';
import Anubis from './Anubis.js';
import TypeAhead from './TypeAhead.js';
import defaultOptions from './options.js';
import defaultTemplate from './template.js';

class SuggestionBox {

    constructor(options, context) {
        this.context = context;

        this.search = this.context.val();
        this.suggestions = [];
        let defaultFilter = defaultOptions.filter;

        this.options = $.extend(defaultOptions, options);


        if (defaultFilter != this.options.filter && this.options.typeahead) {
            console.log('[suggestion-box: warn]: Using a custom filter pattern with the typeahed option can cause unexpected results');
        }

        this.fetchRate = this.options.fetchAfter;

        // load default template into options 
        let template = (Util.isId(this.options.template)) ? $(this.options.template).html() : this.options.template;
        template = (template === '') ? defaultTemplate : template;

        this._initAnubis();

        this.typeAhead = new TypeAhead(this.anubis, this.options.searchBy);
        this.dropdown = new Dropdown(this.context, template, this.options, this.anubis, this.typeAhead);

        this.context.on('keyup', this.keyupEvents.bind(this));
        this.context.on('blur', this.blurEvents.bind(this));
        this.context.on('focus', this.focusEvents.bind(this));
        this.context.on('keydown', this.keydownEvents.bind(this));
        this.context.on('paste', this.pasteEvents.bind(this))


        // Set up typeahead option
        this._initTypeAhead();

        this.context.attr('autocomplete', 'off');

        // Preload the loading image if it has been supplied so it loads faster!
        if (this.options.loadImage) {
            $('<img/>')[0].src = this.options.loadImage;
        }

        // If we are prefetching our data
        if(this.options.prefetch){
            this.dropdown.updateSuggestions(this.context.val(), true);
        }
    }

    _initAnubis(){
        this.anubis = new Anubis(this.options.searchBy, this.options.filter, this.options.sort);
        this.anubis.setData(this.options.data);
        this.anubis.setDebug(this.options.debug);
    }

    _initTypeAhead(){
        if (this.options.typeahead) {
            this.context.wrap('<div id="suggestion-box-typeahead" data-placeholder=""></div>');
            let top = Util.getCssValue(this.context, 'padding-top') + Util.getCssValue(this.context, 'border-top-width');
            let left = Util.getCssValue(this.context, 'padding-left') + Util.getCssValue(this.context, 'border-left-width');
            $('<style>#suggestion-box-typeahead::after{left:' + left + 'px;top:' + top + 'px;}</style>').appendTo('head');
        }
    }

    getSuggestions() {
        this.dropdown.updateSuggestions(this.context.val(), false);
    }

    updateTypeAhead() {
        let selectedIndex = this.dropdown.getSelectedItemIndex();
        this.typeAhead.updateTypeAhead(selectedIndex);
    }


    keyupEvents(e) {
        if (!this._isReservedKey(e)) {
            this.getSuggestions();
            this.updateTypeAhead();
        }
    }



    keydownEvents(e) {

        if (e.which == keys.DOWN_ARROW_KEY) {
            e.preventDefault();
            this.dropdown.moveDown(true);
            this.updateTypeAhead();
        }
        if (this.dropdown.isOpen()) {
            if (e.which == keys.UP_ARROW_KEY) {
                e.preventDefault();
                this.dropdown.moveUp(true);
                this.updateTypeAhead();
            }
            if (e.which === keys.ENTER_KEY) {
                e.preventDefault();
                this.dropdown.simulateClick();
            }
            if (e.which == keys.ESCAPE_KEY) {
                e.preventDefault();
                this.context.css('background', "");
                this.dropdown.hide();
            }
        }
    }

    /**
     * Events for when the search box is focused
     */
    focusEvents() {
        this.getSuggestions();
    }

    /**
     * Events for when the search box loses focus
     */
    blurEvents() {
        if (!this.dropdown.isHovering()) {
            this.context.css('background', "");
            this.dropdown.hide();
        }
    }

    /**
     * Events for when text is pasted in to the search box
     */
    pasteEvents() {
        // Simulate keyup after 200ms otherwise the value of the search box will not be available
        setTimeout(() => {
            this.dropdown.clearAndUpdate(this.context.val());
        }, 200);
    }

    _isReservedKey(e) {
        return Util.inObject(e.which, keys);
    }
}

export default SuggestionBox;
