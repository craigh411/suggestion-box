class Anubis {

    constructor(searchBy, filter, sort, param) {
        this.searchBy = searchBy;
        this.filter = filter;
        this.sort = sort;
        this.search = "";
        this.param = param || 'search';
        this.debug = false; // flag for showing debug messages from ajax call
        this.lastSearch = "";
    }

    setDebug(debug) {
        this.debug = debug;
    }

    getDebug() {
        return this.debug;
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

    // Fetches suggestions from the given url
    fetchSuggestions(url, callback) {
        this.lastSearch = this.search;

        this.killCurrentFetch();
        let request = {};
        request[this.param] = this.search;

        this.xhr = $.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            data: request,
            success: callback
        });


        if (this.xhr && this.debug) {
            $.trigger('anubis.ajax-error', data);
            
            this.xhr.fail((data) => {
                console.log('[Ajax Error]:');
                console.log(data);
            });
        }
    }

}

export default Anubis;
