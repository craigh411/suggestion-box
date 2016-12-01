describe('Anubis', function() {
    var anubis;
    var $ = jQuery;

    beforeEach(function() {
        var sort = function() {};
        anubis = new Anubis('suggestion', '^{{INPUT}}', sort, 'foo');
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should set the constructor parameters', function() {
        expect(anubis.getSearchBy()).toBe('suggestion');
        expect(anubis.getFilter()).toBe('^{{INPUT}}');
        expect(typeof anubis.getSort()).toBe('function');
        expect(anubis.getParam()).toBe('foo');
    });

    it('should set the data', function() {
        var data = ['foo', 'bar', 'baz', 'qux'];
        anubis.setData(data);
        expect(anubis.getData()).toEqual(data);
    });

    it('should set the search', function() {
        anubis.setSearch('foo');
        expect(anubis.getSearch()).toBe('foo');
    });

    it('should set the search', function() {
        anubis.setParam('foo');
        expect(anubis.getParam()).toBe('foo');
    });


    it('should escape regex when setting the search', function() {
        anubis.setSearch('^foo\/$');
        expect(anubis.getSearch()).toBe('\\^foo\\/\\$');
    });

    it('should escape backslashes when setting the search', function() {
        anubis.setSearch('\\foo');
        expect(anubis.getSearch()).toBe('\\\\foo');
    });

    it('should set the searchBy', function() {
        anubis.setSearchBy('foo');
        expect(anubis.getSearchBy()).toBe('foo');
    })

    it('should set the filter pattern', function() {
        anubis.setFilter('foo');
        expect(anubis.getFilter()).toBe('foo');
    })

    it('should set the sort', function() {
        anubis.setSort('foo');
        expect(anubis.getSort()).toBe('foo');
    });


    it('should filter the data by search', function() {
        var data = ['foo', 'bar', 'baz', 'qux'];
        anubis.setData(data);
        anubis.setSearch('baz');
        var filteredData = anubis.filterData();
        expect(filteredData[0]).toBe('baz');
        expect(filteredData.length).toEqual(1);
    });

    it('should filter the data by the given filter pattern', function() {
        var data = ['foo', 'bar', 'baz', 'qux'];
        anubis.setData(data);
        // Filter by last letter of the word
        anubis.setFilter("{{INPUT}}$");
        anubis.setSearch('z');
        var filteredData = anubis.filterData();
        expect(filteredData[0]).toBe('baz');
        expect(filteredData.length).toEqual(1);
    });

    it('should filter an array of objects by the given searchBy', function() {
        var data = [{ 'suggestion': 'foo' }, { 'suggestion': 'bar' }, { 'suggestion': 'baz' }, { 'suggestion': 'qux' }];
        anubis.setData(data);
        anubis.setSearch('baz');
        var filteredData = anubis.filterData();
        expect(filteredData[0].suggestion).toBe('baz');
        expect(filteredData.length).toEqual(1);
    });

    it('should sort the data by the given sort function', function() {
        var data = ['foo', 'bar', 'baz', 'qux'];
        anubis.setData(data);
        anubis.setSearch('b');

        // Sort in reverse order
        var sort = function(a, b) {
            return b.localeCompare(a);
        };

        anubis.setSort(sort);

        var filteredData = anubis.filterData();
        expect(filteredData[0]).toBe('baz');
        expect(filteredData[1]).toBe('bar');
        expect(filteredData.length).toEqual(2);
    });

    it('should sort the data by the given sort function when using objects', function() {
        var data = [{ 'suggestion': 'foo' }, { 'suggestion': 'bar' }, { 'suggestion': 'baz' }, { 'suggestion': 'qux' }];
        anubis.setData(data);
        anubis.setSearch('b');

        // Sort in reverse order
        var sort = function(a, b) {
            return b.suggestion.localeCompare(a.suggestion);
        };

        anubis.setSort(sort);

        var filteredData = anubis.filterData();
        expect(filteredData[0].suggestion).toBe('baz');
        expect(filteredData[1].suggestion).toBe('bar');
        expect(filteredData.length).toEqual(2);
    });

    it('should make an ajax call to the given url', function() {
        spyOn($, 'ajax');
        anubis.fetchSuggestions('/foo', function(data) {});
        expect($.ajax.calls.mostRecent().args[0].url).toBe('/foo');
    });

    it('should set the last search', function() {
        anubis.setSearch('foo');
        anubis.fetchSuggestions('/foo', function(data) {});
        expect(anubis.getLastSearch()).toBe('foo');
    });


    it('should clear the last search', function() {
        anubis.setSearch('foo');
        anubis.fetchSuggestions('/foo', function(data) {});
        anubis.clearLastSearch();
        expect(anubis.getLastSearch()).toBe('');
    });

});
