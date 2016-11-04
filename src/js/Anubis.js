class Anubis {

    constructor(searchBy, regexPattern, sort) {
        this.searchBy = searchBy;
        this.regex = regexPattern;
        this.sort = sort;
        this.search = "";

        console.log(this.regex);
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
        let results = [];

        if (this.data && this.search.length > 0) {
            results = $.grep(this.data, item => {
                return (typeof item === "object") ?  regex.test(item[this.searchBy]) : regex.test(item);
            });
        }

        this.sortData(results)

        return results;
    }

    sortData(data) {
      data.sort(this.sort);
    }

}

export default Anubis;
