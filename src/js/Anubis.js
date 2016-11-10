class Anubis {

    constructor(searchBy, regexPattern, sort) {
        this.searchBy = searchBy;
        this.regex = regexPattern;
        this.sort = sort;
        this.search = "";
        this.debug = false; // flag for showing debug messages from ajax call
        this.lastSearch = "";
        console.log(this.regex);
    }

    setDebug(debug) {
        this.debug = debug;
    }

    static factory() {
        return new Anubis('suggestion', '{{INPUT}}');
    }

    setData(data) {
        this.data = data;
    }

    getSuggestions() {
        return this.filterData();
    }

    setSearch(search) {
        // Escape any regex patterns is search string
        let santizedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        this.search = santizedSearch;
    }


    filterData() {
        let filterPattern = this.regex.replace('{{INPUT}}', this.search);
        let regex = new RegExp(filterPattern, "i");
        let results = [];


        if (this.data && this.search.length > 0) {
            results = $.grep(this.data, item => {
                return (typeof item === "object") ? regex.test(item[this.searchBy]) : regex.test(item);
            });
        }

        // results = this.sortData(results)

        return results;
    }

    sortData(data) {
        if (typeof item === "object") {
            return data;
        }
        return data.sort(this.sort);
    }


    /*            if (context.val() != "") {
                    ajaxCalledVal = context.val();

                    console.log('calling bg');

                    if (options.loadImage != null) {
                        context.css('background', "url('"+options.loadImage+"') no-repeat 99% 50%");
                    }

                    $.ajax({
                        url: url,
                        data: request,
                        dataType: 'json',
                        success: function(data) {
                            var selectionHasChanged = true;
                            var currentLi = selectedLi;

                            if (jsonData.suggestions && data.suggestions) {
                                selectionHasChanged = (JSON.stringify(jsonData.suggestions[selectedLi]) !== JSON.stringify(data.suggestions[selectedLi]))
                            }

                            setJsonData(data);
                            showSuggestions();

                            // Keep selection if no new information has been entered since ajax was called and the selection is the same.
                            // This prevents the flick back effect when menu has the same data but the ajax hasn't finished.
                            if (currentLi > -1 && (context.val() === ajaxCalledVal) && !selectionHasChanged) {
                                selectedLi = currentLi;
                                select(selectedLi);
                            }

                            setTimeout(function(){
                               context.css('background', "");
                           },500);

                            options.ajaxSuccess(data);
                        },
                        error: function(e) {
                            options.ajaxError(e);
                        }
                    });*/

    getLastSearch() {
        return this.lastSearch;
    }

    clearLastSearch() {
        this.lastSearch = "";
    }

    // Fetches suggestions from the given url
    fetchSuggestions(url, callback) {
        // Don't maka a call for an empty search string or while another request is still processing

        this.lastSearch = this.search;
        console.log('searching for ' + this.search);

        if (this.xhr != undefined) {
            this.xhr.abort();
        }

        this.xhr = $.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            data: { search: this.search }
        }).done(callback).fail((data) => {
            if (this.debug) {
                console.log('[Ajax Error]:' + data);
            }
        });
    }

}

export default Anubis;
