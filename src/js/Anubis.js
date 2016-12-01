class Anubis {

    constructor(searchBy, filter, sort, param, ajaxErrorEvent) {
        this.searchBy = searchBy;
        this.filter = filter;
        this.sort = sort;
        this.search = "";
        this.param = param || 'search';
        this.lastSearch = "";
        this.ajaxErrorEvent = ajaxErrorEvent || 'suggestion-box.ajax.error';
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setSearchBy(searchBy) {
        this.searchBy = searchBy;
    }

    getSearchBy() {
        return this.searchBy;
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

    setFilter(filter) {
        this.filter = filter;
    }

    getFilter() {
        return this.filter;
    }

    setSort(sort) {
        this.sort = sort;
    }

    getSort() {
        return this.sort;
    }

    filterData() {
        let filterPattern = this.filter.replace('{{INPUT}}', this.search);
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

    getParam() {
        return this.param;
    }

    setParam(param) {
        this.param = param;
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

    /* 
     * Fetches suggestions from the given url
     * @param {string} url - The url to retrieve suggestion data from
     * @param {function} callback - The actions to perform on successfull fetch
     */
    fetchSuggestions(url, callback) {
        this.lastSearch = this.search;

        // Kill any current ajax connections.
        this.killCurrentFetch();
        // Set up the search param
        let request = {};
        request[this.param] = this.search;

        this.xhr = $.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            data: request,
            success: callback
        });


        if (this.xhr) {
            this.xhr.fail((data) => {
                // fire an ajax error event on failure with the error data
                $.event.trigger(this.ajaxErrorEvent, data);
            });
        }
    }
}

export default Anubis;
