import $ from 'jQuery';
import Dropdown from './SuggestionListDropdown.js';
import Util from './util.js';
import keys from './constants/keys.js';
import Anubis from './Anubis.js';
import defaultOptions from './options.js';

class SuggestionBox {

    constructor(options, context) {
        this.context = context;

        this.search = this.context.val();
        this.suggestions = [];

        this.options = $.extend(defaultOptions, options);

        this.fetchRate = this.options.fetchAfter;
        // this.perpetualFetch = (this.options.fetchEvery != -1) ? true : false;
        // get loaddefault template into options 
        let template = (Util.isId(this.options.template)) ? $(this.options.template).html() : this.options.template;

        this.dropdown = new Dropdown(this.context, template, this.options);
        this.anubis = new Anubis(this.options.props.value, this.options.filter, this.options.sort);
        this.anubis.setData(this.options.data);


        this.context.on('keyup', this.keyupEvents.bind(this));
        this.context.on('blur', this.blurEvents.bind(this));
        this.context.on('focus', this.focusEvents.bind(this));
        this.context.on('keydown', this.keydownEvents.bind(this));
        this.context.on('paste', this.pasteEvents.bind(this))

        // Preload the loading image if it has been supplied so it loads faster!
        if (this.options.loadImage) {
            $('<img/>')[0].src = this.options.loadImage;
        }

    }

    getSuggestions() {
        this.dropdown.updateSuggestions(this.context.val());
    }

    keyupEvents(e) {
        if (!this._isReservedKey(e)) {
            this.getSuggestions();
        }
    }



    keydownEvents(e) {
        if (e.which == keys.DOWN_ARROW_KEY) {
            e.preventDefault();
            this.dropdown.moveDown(true);
        }
        if (this.dropdown.isOpen()) {
            if (e.which == keys.UP_ARROW_KEY) {
                e.preventDefault();
                this.dropdown.moveUp(true);
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
        this.getSuggestions(false);

        if (this.suggestions.length > 0) {
            this.dropdown.show();
        }
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
            this.context.keyup();
        }, 200);
    }

    _isReservedKey(e) {
        return Util.inObject(e.which, keys);
    }
}

export default SuggestionBox;
