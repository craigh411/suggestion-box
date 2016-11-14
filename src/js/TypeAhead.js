class TypeAhead {


    constructor(anubis, searchBy) {
      this.anubis = anubis;
      this.searchBy = searchBy;
    }


    updateTypeAhead(selectedItemIndex) {
        let currentInput =  this.anubis.getSearch();
        // If the suggestion box has an item selected get the item at that index instead.
        let index = (selectedItemIndex > -1) ? selectedItemIndex : 0;
        let suggestion = this.anubis.getSuggestions()[index] || "";

        suggestion = (typeof suggestion == "object") ? suggestion[this.searchBy] : suggestion;

        let regex = new RegExp("^" + currentInput, "i");
        // Simply match the case of the typeahead to the case the user typed
        let typeAhead = suggestion.replace(regex, currentInput);
        $("#suggestion-box-typeahead").attr('data-placeholder', typeAhead);

    }

    removeTypeahead() {
        $("#suggestion-box-typeahead").attr('data-placeholder', "");
    }

}

export default TypeAhead
