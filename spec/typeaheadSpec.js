describe("Typeahead", function() {

    var anubis;

    beforeEach(function() {
        anubis = jasmine.createSpyObj('Anubis', ['getSearch', 'getSuggestions']);
        anubis.getSuggestions.and.returnValue(['foo']);
    });

    it('should return the typeahead value', function() {

        var typeahead = new Typeahead(anubis);
        var value = typeahead.getTypeahead(0);

        expect(anubis.getSearch).toHaveBeenCalled();
        expect(anubis.getSuggestions).toHaveBeenCalled();
        expect(value).toBe('foo');
    })

    it('should match the case of the input', function() {
        var typeahead = new Typeahead(anubis);
        // The typeahead gets the user input from anubis getSearch() method, so let's just mock that
        anubis.getSearch.and.returnValue(['FoO']);

        var value = typeahead.getTypeahead(0);
        expect(value).toBe('FoO');
    })


    it('should get the typeahead when suggestions are objects', function() {
        var typeahead = new Typeahead(anubis, 'suggestion');
        anubis.getSuggestions.and.returnValue([{ 'suggestion': 'foo' }]);

        var value = typeahead.getTypeahead(0);
        expect(value).toBe('foo');
    });

});
