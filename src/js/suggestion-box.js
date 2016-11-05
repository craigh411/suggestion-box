import $ from 'jQuery';
import Dropdown from './SuggestionListDropdown.js';
import Util from './util.js';
import keys from './constants/keys.js';
import Anubis from './Anubis.js';
import defaultOptions from './options.js';

class SuggestionBox {

    constructor(options, context) {
        this.context = context;
        this.active = false;
        this.mouseHover = false;
        this.search = this.context.val();
        this.suggestions = [];

        this.options = $.extend(defaultOptions, options);

        // get loaddefault template into options 
        let template = (Util.isId(this.options.template)) ? $(this.options.template).html() : this.options.template;

        this.dropdown = new Dropdown(this.context, template, this.options);
        this.anubis = new Anubis(this.options.props.value, this.options.filter, this.options.sort);
        this.anubis.setData(this.options.data);


        this.context.on('keyup', this.keyupEvents.bind(this));
        this.context.on('blur', this.blurEvents.bind(this));
        this.context.on('focus', this.focusEvents.bind(this));
        this.context.on('keydown', this.keydownEvents.bind(this));
    }

    getSuggestions() {
        this.search = this.context.val();
        this.anubis.setSearch(this.search);

        this.suggestions = this.anubis.getSuggestions();
        this.dropdown.setSuggestions(this.suggestions);
        this.dropdown.resetSelection();
        console.log('fetching');
    }

    keyupEvents(e) {

        if (!this._isReservedKey(e)) {
            this.getSuggestions();

            if (this.suggestions.length > 0) {
                this.dropdown.show();
            } else {
                this.dropdown.hide();
            }
            console.log(this.suggestions);
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
                this.getSuggestions();
            }
            if (e.which == keys.ESCAPE_KEY) {
                e.preventDefault();
                this.dropdown.hide();
            }
        }
    }

    /**
     * Events for when the search box is focused
     */
    focusEvents() {
        this.active = true;
        this.getSuggestions();

        if (this.suggestions.length > 0) {
            this.dropdown.show();
        }
    }

    /**
     * Events for when the search box loses focus
     */
    blurEvents() {
        this.active = false;
        if (!this.dropdown.isHovering()) {
            this.dropdown.hide();
        }
    }

    _isReservedKey(e) {
        return Util.inObject(e.which, keys);
    }
}

export default SuggestionBox;
