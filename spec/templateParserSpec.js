describe('TemplateParser', function() {


    it('should strip any outer divs', function() {
        var template = '<div>foo</div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getParsedTemplate()).toBe("foo");
    });

    it('should get the markup for a list item', function() {
        var template = '<div><ul id="suggestion-list"><li>foo</li></ul></div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getListItemMarkup()).toBe("foo");
    });

    it('should replace the markup for a list item with moustaches', function() {
        var template = '<div><ul id="suggestion-list"><li>foo</li></ul></div>';
        var templateParser = new TemplateParser(template);

        expect($(templateParser.getParsedTemplate()).html()).toBe("{{ suggestion_list }}");
    });

    it('should not get the markup for a list item when the ul id is not set to "suggestion-list"', function() {
        var template = '<div><ul><li>foo</li></ul></div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getListItemMarkup()).not.toBe("foo");
    });

    it('should not replace the markup for a list item with moustaches when the ul id is not set to "suggestion-list"', function() {
        var template = '<div><ul><li>foo</li></ul></div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getParsedTemplate()).toBe("<ul><li>foo</li></ul>");
    });

    it('should find all moustached items', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<div>{{heading}}<a href="{{url}}">{{suggestion}}</a></div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getTemplatedItems(template).length).toEqual(3);
        expect(templateParser.getTemplatedItems(template)).toEqual(['heading', 'url', 'suggestion']);
    });

    it('should replace all moustached items with the given name', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<li><a href="{{href}}">{{href}}</a></li>';
        var templateParser = new TemplateParser(template);

        var expected = '<li><a href="foo">foo</a></li>'
        expect(templateParser.replaceHandlebars(template, 'href', 'foo')).toEqual(expected);
    });

    it('should replace all moustached  items with leading "@" with the given name', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<li><a href="@{{href}}">@{{href}}</a></li>';
        var templateParser = new TemplateParser(template);

        var expected = '<li><a href="foo">foo</a></li>'
        expect(templateParser.replaceHandlebars(template, 'href', 'foo')).toEqual(expected);
    });

    it('should ignore spaces inside moustached items', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<li><a href="{{ href }}">{{ href}}</a></li>';
        var templateParser = new TemplateParser(template);

        var expected = '<li><a href="foo">foo</a></li>'
        expect(templateParser.replaceHandlebars(template, 'href', 'foo')).toEqual(expected);
    });

    it('should ignore spaces inside moustached items with leading "@"', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<li><a href="@{{ href }}">@{{ href}}</a></li>';
        var templateParser = new TemplateParser(template);

        var expected = '<li><a href="foo">foo</a></li>'
        expect(templateParser.replaceHandlebars(template, 'href', 'foo')).toEqual(expected);
    });

    it('should replace all moustached items with the given name but not those with different names', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<li><a href="{{href}}">{{name}} {{href}}</a></li>';
        var templateParser = new TemplateParser(template);

        var expected = '<li><a href="foo">{{name}} foo</a></li>'
        expect(templateParser.replaceHandlebars(template, 'href', 'foo')).toEqual(expected);
    });

    it('should find all conditional markup', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<div><ul id="suggestion-list"><li> <div sb-show="">FOO</div><div sb-show="">BAR</div></li></ul></div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getConditionals().length).toEqual(2);

    });

    it('should assign ids to conditional markup which does not have one', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<div><ul id="suggestion-list"><li> <div sb-show="">FOO</div><div sb-show="">BAR</div></li></ul></div>';
        var templateParser = new TemplateParser(template);


        expect(typeof templateParser.getConditionals()[0].id).toBe("string");
        expect(typeof templateParser.getConditionals()[1].id).toBe("string");
        expect(typeof templateParser.getConditionals()[0].id).not.toEqual(templateParser.getConditionals()[1].id);
        expect(templateParser.getListItemMarkup().match(templateParser.getConditionals()[0].id).length).toEqual(1);
        expect(templateParser.getListItemMarkup().match(templateParser.getConditionals()[1].id).length).toEqual(1);
    });

    it('should not assign new ids to conditional markup when one already exists', function() {
        // Some arbitrary markup to make sure it extracts all parts,.
        var template = '<div><ul id="suggestion-list"><li> <div sb-show="" id="foo">FOO</div><div sb-show="" id="bar">BAR</div></li></ul></div>';
        var templateParser = new TemplateParser(template);

        expect(templateParser.getConditionals()[0].id).toBe("foo");
        expect(templateParser.getConditionals()[1].id).toBe("bar");

        expect(templateParser.getListItemMarkup().match('id="foo"').length).toEqual(1);
        expect(templateParser.getListItemMarkup().match('id="bar"').length).toEqual(1);
    });

    it('should log an error when template does not have 1 root element and debug mode is true', function() {
        var template = '<div></div><div></div>';
        spyOn(console, 'log');

        var templateParser = new TemplateParser(template, template);
        expect(console.log).toHaveBeenCalled(); 
    });

    it('should warn when top level e when template does not have 1 root element and debug mode is true', function() {
        var template = '<div></div><div></div>';
        spyOn(console, 'log');

        var templateParser = new TemplateParser(template, template);
        expect(console.log).toHaveBeenCalled(); 
    });

});
