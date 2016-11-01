class Anubis {

    constructor(searchBy, regexPattern, sort) {
        this.searchBy = searchBy;
        this.regex = regexPattern;
        this.sort = sort;
        this.search = "";

        let data = [
            { suggestion: 'foo'},
            { suggestion: 'bar'},
            { suggestion: 'foobar'},
            { suggestion: 'qux'}
        ]

        this.setData(data);

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

    formatData() {

    }

    filterData() {
        let filterPattern = this.regex.replace('{{INPUT}}', this.search);
        let regex = new RegExp(filterPattern, "i");
        if (this.data && this.search.length > 0) {
            return $.grep(this.data, item => {
                return regex.test(item[this.searchBy]);
            });
        }

        return [];
    }

    sortData() {

    }

}

export default Anubis;
