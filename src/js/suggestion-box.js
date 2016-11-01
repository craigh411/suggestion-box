import $ from 'jQuery';
import Dropdown from './SuggestionListDropdown.js';
import Util from './util.js';
import keys from './constants/keys.js';
import Anubis from './Anubis.js';

class SuggestionBox {

    constructor(options, context) {
        this.context = context;
        this.active = false;
        this.mouseHover = false;
        this.search = this.context.val();
        this.suggestions = [];

        this.dropdown = new Dropdown(this.context);
        this.anubis = Anubis.factory();

        this.context.on('keyup', this.keyupEvents.bind(this));
        this.context.on('blur', this.blurEvents.bind(this));
        this.context.on('focus', this.focusEvents.bind(this));
    }

    keyupEvents(e) {
        this.search = this.context.val();
        if (!this._isReservedKey(e)) {

            this.anubis.setSearch(this.search);

            this.suggestions = this.anubis.getSuggestions();

            if (this.suggestions.length > 0) {
                this.dropdown.setSuggestions(this.suggestions);
                this.dropdown.show();
            }else{
                this.dropdown.hide();
            }
        console.log(this.suggestions);
        }
    }

    /**
     * Events for when the search box is focused
     */
    focusEvents() {
        this.active = true;
        console.log(this.active);
        if (this.suggestions.length > 0) {
            this.dropdown.setSuggestions(this.suggestions);
            this.dropdown.show();
        }
    }

    /**
     * Events for when the search box loses focus
     */
    blurEvents() {
        this.active = false;
        if (!this.mouseHover) {
            this.dropdown.hide();
        }
    }

    _isReservedKey(e) {
        return Util.inObject(e.which, keys);
    }
}

export default SuggestionBox;
