import Util from './util.js'

class Typeahead {

    constructor(suggestions, searchBy) {
        this.suggestions = suggestions;
        this.searchBy = searchBy;
    }

    setCurrentInput(currentInput) {
        this.currentInput = currentInput;
    }

    getTypeahead(selectedItemIndex) {
        // If the suggestion box has an item selected get the item at that index instead.
        let index = (selectedItemIndex > -1) ? selectedItemIndex : 0;
        let suggestion = this.suggestions.getSuggestions()[index] || "";

        suggestion = (typeof suggestion == "object") ? suggestion[this.searchBy] : suggestion;

        let regex = new RegExp("^" + this.currentInput, "i");
        // Simply match the case of the typeahead to the case the user typed
        let typeahead = suggestion.replace(regex, this.currentInput);

        return typeahead;
    }


    removeTypeahead() {
        this.updateTypeahead("");
    }

    updateTypeaheadPosition(inputEl) {

        let top = Util.getCssValue(inputEl, 'padding-top') + Util.getCssValue(inputEl, 'border-top-width') + Util.getCssValue(inputEl, 'top');
        let left = Util.getCssValue(inputEl, 'padding-left') + Util.getCssValue(inputEl, 'border-left-width') + inputEl.position().left;

        $("#suggestion-box-dynamic-typeahead").html('#suggestion-box-typeahead::after{left:' + left + 'px;top:' + top + 'px;}');
    }

    updateTypeahead(value) {
        $("#suggestion-box-typeahead").attr('data-placeholder', value);
    }

    setSearchBy(searchBy) {
        this.searchBy = searchBy;
    }

}

export default Typeahead
