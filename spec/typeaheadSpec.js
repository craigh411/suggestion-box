describe("Typeahead", function() {

    var suggestions;

    beforeEach(function() {
        suggestions = jasmine.createSpyObj('Suggestions', ['getSuggestions']);
        suggestions.getSuggestions.and.returnValue(['foo']);
    });

    it('should return the typeahead value', function() {

        var typeahead = new Typeahead(suggestions);
        typeahead.setCurrentInput('foo');
        
        var value = typeahead.getTypeahead(0);


        expect(suggestions.getSuggestions).toHaveBeenCalled();
        expect(value).toBe('foo');
    })

    it('should match the case of the input', function() {

        var typeahead = new Typeahead(suggestions);
        typeahead.setCurrentInput('FoO');

        var value = typeahead.getTypeahead(0);
        expect(value).toBe('FoO');
    })


    it('should get the typeahead when suggestions are objects', function() {
        var typeahead = new Typeahead(suggestions, 'suggestion');
        suggestions.getSuggestions.and.returnValue([{ 'suggestion': 'foo' }]);

        var value = typeahead.getTypeahead(0);
        expect(value).toBe('foo');
    });

});
