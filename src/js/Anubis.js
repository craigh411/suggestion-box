import Util from './util.js';

class Anubis {

    constructor(searchBy, filter, sort, param, customParams, root, ajaxErrorEvent) {
        this.searchBy = searchBy;
        this.filter = filter;
        this.sort = sort;
        this.search = "";
        this.customParams = customParams || {};
        this.param = param || 'search';
        this.lastSearch = "";
        this.root = root || "";
        this.ajaxErrorEvent = ajaxErrorEvent || 'suggestion-box.ajax.error';
    }

    setDataRoot(root) {
        this.root = root;
    }

    getDataRoot() {
        return this.root;
    }

    setData(data) {
        if (this.root.length > 0) {
            let dataRoot = this.root.split(".");
            // Set the data at the given root
            for (var i = 0; i < dataRoot.length; i++) {
                data = (data[dataRoot[i]]) ? data[dataRoot[i]] : [];
            }
        }

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

    setCustomParams(params) {
        this.customParams = params;
    }

    getCustomParams() {
        return this.customParams;
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

    getSearchParam() {
        let searchBy = this.searchBy.split(".");
        return (typeof searchBy === "String") ? searchBy : searchBy[searchBy.length - 1];
    }



    filterData() {
        let filterPattern = this.filter.replace('{{INPUT}}', this.search);
        let regex = new RegExp(filterPattern, "i");
        let results = [];


        if (this.data && this.search.length > 0) {
            results = $.grep(this.data, item => {
                if (typeof item === "object") {
                    let searchData = Util.getValueByStringAttributes(this.searchBy, item);

                    for (var i = 0; i <= searchData.length; i++) {
                        if (regex.test(searchData[i])) {
                            return true;
                        }
                    }

                    return false;
                }

                return regex.test(item);
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
        let request = this.customParams;
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
