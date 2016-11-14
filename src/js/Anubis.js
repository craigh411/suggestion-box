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

    setData(data) {
        this.data = data;
    }

    getSuggestions() {
        return this.filterData();
    }

    setSearch(search) {
        // Escape any regex patterns as search string
        let santizedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        this.search = santizedSearch;
    }

    getSearch() {
        return this.search;
    }

    /**
     * Returns the first result that matches the filter
     */
    findFirst(filter) {
        let regex = new RegExp(filter);
        retun
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

        results = this.sortData(results)

        return results;
    }

    sortData(data) {
        return data.sort(this.sort);
    }


    getLastSearch() {
        return this.lastSearch;
    }

    clearLastSearch() {
        this.lastSearch = "";
    }

    killCurrentFetch() {
        if (this.xhr != undefined) {
            this.xhr.abort();
        }
    }

    // Fetches suggestions from the given url
    fetchSuggestions(url, callback) {
        this.lastSearch = this.search;

        console.log('searching for ' + this.search);

        this.killCurrentFetch();

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
