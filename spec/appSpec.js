describe("Suggestion Box", function() {

    var $ = jQuery;
    var body;

    describe("setup", function() {
        var $search;
        var $suggestionBox;

        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');
            $suggestionBox = $('#search').suggestionBox();;
        });

        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
        });

        it('should inject the suggestion box in to the body of the web page', function() {
            expect($('body').find('.suggestion-box').length).toEqual(1);
        });

        it('should turn off autocomplete', function() {
            expect($search.attr('autocomplete')).toEqual('off');
        });

        it('should create an Anubis instance', function() {
            expect($suggestionBox.getAnubis().constructor.name).toBe('Anubis');
        })

        it('should create a SuggestionListD instance', function() {
            expect($suggestionBox.getSuggestionList().constructor.name).toBe('SuggestionList');
        })


        it('should not inject the typeahead html', function() {
            expect($('#suggestion-box-typeahead').length).toEqual(0);
        });

    });

    /**
     * test the setup when the typeahead option is set to true
     */
    describe("typeahead setup", function() {
        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');

            $suggestionBox = $('#search').suggestionBox({ data: ['foo'], typeahead: true });
            $search.blur();
        });

        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
            $suggestionBox.destroy();
        });

        it('should create a typeahead instance', function() {
            expect($suggestionBox.getTypeahead().constructor.name).toBe('Typeahead');
        })

        it('should inject the typeahead html', function() {
            expect($('#suggestion-box-typeahead').length).toEqual(1);
        })

        it('should inject the typeahead styles into the page head', function() {
            var head = $("head").html();
            var regex = new RegExp("#suggestion-box-typeahead");
            expect(regex.test(head)).toBeTruthy()
        });

        it('should set the typeahead left value match the input text left value', function() {
            var rand = Math.round(Math.random() * (500));

            $search.css({
                'position': 'absolute',
                'left': rand + 'px'
            });

            $search.val('f');
            $search.focus();


            var InputTextLeftPosition = (rand +
                parseInt($search.css('border-left-width').replace('px', '')) +
                parseInt($search.css('padding-left').replace('px', ''))
            );

            // We can't get the position of the typeahed as it is data-placeholder and uses css ::after, so
            // lets just see if the style updated correctly
            var regex = new RegExp("left:" + InputTextLeftPosition + "px");
            var test = regex.test($("#suggestion-box-dynamic-typeahead").html());
            expect(test).toBeTruthy();
        });


        it('should set the typeahead top value match the input text top value', function() {
            var $typeahead = $('#suggestion-box-typeahead').data('placeholder');

            var rand = Math.round(Math.random() * (500));

            $search.css({
                'position': 'absolute',
                'top': rand + 'px'
            });

            $search.val('f');
            $search.focus();


            var InputTextLeftPosition = (rand +
                parseInt($search.css('border-left-width').replace('px', '')) +
                parseInt($search.css('padding-left').replace('px', ''))
            );

            // We can't get the position of the typeahed as it is data-placeholder and uses css ::after, so
            // lets just see if the style updated correctly
            var regex = new RegExp("top:" + InputTextLeftPosition + "px");
            var test = regex.test($("#suggestion-box-dynamic-typeahead").html());
            expect(test).toBeTruthy();
        });

        it('should warn developer when using a custom filter pattern with typeahead', function() {
            spyOn(console, 'log');
            $suggestionBox.set('debug', true);
            $suggestionBox.set('filter', '{{INPUT}}');
            expect(console.log).toHaveBeenCalled();
        });
    });

    describe('set method', function() {
        var anubis;
        var typeahead;
        var suggestionList;
        var suggestionBox;
        var templateParser;

        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');
            suggestionBox = $search.suggestionBox();

            anubis = jasmine.createSpyObj('Anubis', ['setData', 'setSearchBy', 'setSort', 'setFilter']);
            suggestionList = jasmine.createSpyObj('SuggestionList', ['setTemplate', 'destroy', 'buildDom']);
            typeahead = jasmine.createSpyObj('Typeahead', ['setSearchBy']);
            templateParser = jasmine.createSpyObj('TemplateParser', ['setDebug']);

            suggestionBox.setAnubis(anubis);
            suggestionBox.setSuggestionList(suggestionList);
            suggestionBox.setTypeahead(typeahead);
            suggestionBox.setTemplateParser(templateParser);
        });

        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
            suggestionBox.destroy();
        });

        it('should set the data', function() {
            suggestionBox.set('data', ['foo']);
            expect(anubis.setData).toHaveBeenCalled();
            expect(suggestionBox.getOptions().data).toEqual(['foo']);
        });

        it('should set the template', function() {
            var template = 'foo';

            suggestionBox.set('template', template);
            expect(suggestionList.setTemplate).toHaveBeenCalled();
            expect(suggestionBox.getOptions().template).toEqual(template);
        });


        it('should set the searchBy option', function() {
            suggestionBox.set('searchBy', 'foo');
            expect(anubis.setSearchBy).toHaveBeenCalled();
            expect(typeahead.setSearchBy).toHaveBeenCalled();
            expect(suggestionBox.getOptions().searchBy).toEqual('foo');
        });

        it('should set the url option', function() {
            suggestionBox.set('url', 'foo');
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().url).toEqual('foo');
        });

        it('should set the sort option', function() {
            var func = function(a, b) {
                return a < b
            };
            suggestionBox.set('sort', func);
            expect(anubis.setSort).toHaveBeenCalled();
            expect(suggestionBox.getOptions().sort).toEqual(func);
        });

        it('should set the topOffset option', function() {
            suggestionBox.set('topOffset', 10);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().topOffset).toEqual(10);
        });

        it('should set the topOffset option', function() {
            suggestionBox.set('leftOffset', 10);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().leftOffset).toEqual(10);
        });

        it('should set the topOffset option', function() {
            suggestionBox.set('widthAdjustment', 10);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().widthAdjustment).toEqual(10);
        });

        it('should set the adjustBorderRadius option', function() {
            suggestionBox.set('adjustBorderRadius', 10);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().adjustBorderRadius).toEqual(10);
        });

        it('should set the zIndex option', function() {
            suggestionBox.set('zIndex', 10);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().zIndex).toEqual(10);
        });

        it('should set the hideOnExactMatchOption option', function() {
            suggestionBox.set('hideOnExactMatch', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().hideOnExactMatch).toBeTruthy();
        });

        it('should set the loadImage option', function() {
            suggestionBox.set('loadImage', 'foo');
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().loadImage).toBe('foo');
        });

        it('should set the fetchAfter option', function() {
            suggestionBox.set('fetchAfter', 0);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().fetchAfter).toEqual(0);
        });

        it('should set the fetchEvery option', function() {
            suggestionBox.set('fetchEvery', 0);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().fetchEvery).toEqual(0);
        });

        it('should set the fetchOnce option', function() {
            suggestionBox.set('fetchOnce', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().fetchOnce).toBeTruthy();
        });

        it('should set the prefetch option', function() {
            suggestionBox.set('prefetch', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().prefetch).toBeTruthy();
        });

        it('should set the results option', function() {
            suggestionBox.set('results', 100);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().results).toEqual(100);
        });

        it('should set the widthType option', function() {
            suggestionBox.set('widthType', 'min-width');
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().widthType).toBe('min-width');
        });

        it('should set the showNoSuggestionMessage option', function() {
            suggestionBox.set('showNoSuggestionMessage', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().showNoSuggestionMessage).toBeTruthy();
        });

        it('should set the noSuggestionMessage option', function() {
            suggestionBox.set('noSuggestionMessage', 'foo');
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().noSuggestionMessage).toBe('foo');
        });

        it('should set the filter option', function() {
            suggestionBox.set('filter', 'foo');
            expect(anubis.setFilter).toHaveBeenCalled();
            expect(suggestionBox.getOptions().filter).toEqual('foo');
        });

        it('should set the typeahead option', function() {
            suggestionBox.set('typeahead', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().typeahead).toBeTruthy();
        });

        it('should set the highlightMatch option', function() {
            suggestionBox.set('highlightMatch', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().highlightMatch).toBeTruthy();
        });

        it('should set the paramName option', function() {
            suggestionBox.set('paramName', 'foo');
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().paramName).toBe('foo');
        });

        it('should set the scrollable option', function() {
            suggestionBox.set('scrollable', true);
            expect(suggestionList.buildDom).toHaveBeenCalled();
            expect(suggestionBox.getOptions().scrollable).toBeTruthy();
        });

        it('should set the debug option', function() {
            suggestionBox.set('debug', true);
            expect(templateParser.setDebug).toHaveBeenCalled();
            expect(suggestionBox.getOptions().debug).toBeTruthy();
        });
    });

    describe('when suggestion is chosen', function() {

        var $suggestionBox;
        var $search;
        var suggestionBox;

        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');
            suggestionBox = $search.suggestionBox();

            $suggestionBox = $(".suggestion-box");

        });

        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
            suggestionBox.destroy();
        });

        it('should return the suggestion value', function() {
            spyOn(console, 'log')

            suggestionBox.set('data', ['foo', 'bar', 'baz'])
            suggestionBox.set('onClick', function(value) {
                console.log(value);
            });

            $search.val('f');
            $search.focus();
            suggestionBox.getSuggestionList().select(0);

            $suggestionBox.find('li:eq(0) > a').mousemove();
            $suggestionBox.find('li:eq(0) > a').click();

            expect(console.log).toHaveBeenCalledWith('foo');

        });


        it('should return the suggestion value when suggestion is an object', function() {
            spyOn(console, 'log')

            suggestionBox.set('data', [{ 'suggestion': 'foo' }])
            suggestionBox.set('onClick', function(value) {
                console.log(value);
            });

            $search.val('f');
            $search.focus();
            suggestionBox.getSuggestionList().select(0);

            $suggestionBox.find('li:eq(0) > a').mousemove();
            $suggestionBox.find('li:eq(0) > a').click();

            expect(console.log).toHaveBeenCalledWith('foo');
        });

        it('should return the suggestion as an object', function() {
            this.suggestion = "";
            var self = this;

            suggestionBox.set('data', [{ 'suggestion': 'foo' }])
            suggestionBox.set('onClick', function(value, suggestion) {
                self.suggestion = suggestion;
            });

            $search.val('f');
            $search.focus();
            suggestionBox.getSuggestionList().select(0);

            $suggestionBox.find('li:eq(0) > a').mousemove();
            $suggestionBox.find('li:eq(0) > a').click();

            expect(typeof this.suggestion).toBe('object');
            expect(this.suggestion.suggestion).toBe('foo');
        });

        it('should return the Event object', function() {
            this.event = "";
            var self = this;

            suggestionBox.set('data', [{ 'suggestion': 'foo' }])
            suggestionBox.set('onClick', function(value, suggestion, event) {
                self.event = event;
            });

            $search.val('f');
            $search.focus();
            suggestionBox.getSuggestionList().select(0);

            $suggestionBox.find('li:eq(0) > a').mousemove();
            $suggestionBox.find('li:eq(0) > a').click();

            expect(typeof this.event).toBe('object');
            expect(this.event.type).toBe('click');
        });

        it('should return the input element', function() {
            this.input = "";
            var self = this;

            suggestionBox.set('data', [{ 'suggestion': 'foo' }])
            suggestionBox.set('onClick', function(value, suggestion, event, input) {
                self.input = input;
            });

            $search.val('f');
            $search.focus();
            suggestionBox.getSuggestionList().select(0);

            $suggestionBox.find('li:eq(0) > a').mousemove();
            $suggestionBox.find('li:eq(0) > a').click();

            expect(this.input.attr('id')).toBe('search');
        });

        it('should return the selected element', function() {
            this.selected = "";
            var self = this;

            suggestionBox.set('data', [{ 'suggestion': 'foo' }])
            suggestionBox.set('onClick', function(value, suggestion, event, input, selected) {
                self.selected = selected;
            });

            $search.val('f');
            $search.focus();
            suggestionBox.getSuggestionList().select(0);

            $suggestionBox.find('li:eq(0) > a').mousemove();
            $suggestionBox.find('li:eq(0) > a').click();

            expect(this.selected.attr('class')).toBe('selected');

            //  console.log(suggestionBox._fetchSuggestionsCallback()('foobarbaz'));
        });

    });

    describe('has url set', function() {

        var $suggestionBox;
        var $search;
        var suggestionBox;

        beforeEach(function() {
            jasmine.clock().install();
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');


        });

        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
            suggestionBox.destroy();
            jasmine.clock().uninstall();
        });

        it('should prefetch data from the given url', function() {
            spyOn($, 'ajax');

            suggestionBox = $search.suggestionBox({
                url: "/foo",
                prefetch: true,
                fetchAfter: 0
            });

            jasmine.clock().tick(10);

            expect($.ajax.calls.mostRecent().args[0].url).toBe('/foo');
        });

        it('should fetch the data when search string length is less than previously search string', function() {
            spyOn($, 'ajax');

            suggestionBox = $search.suggestionBox({
                url: "/foobar",
                fetchAfter: 0
            });

            // initial search string
            $search.val('fo');
            $search.keyup();
            jasmine.clock().tick(10);
            // Just invoke this manually, suggestionBox does it internally after an ajax call, 
            // but jasmine doesn't invoke the callback even with async flag set 
            // there may be a cleaner solution, which is worth investigating later.
            suggestionBox._fetchSuggestionsCallback()();

            // remove one character (now it's less than previous search)
            $search.val('f');
            $search.keyup();
            jasmine.clock().tick(10);

            expect($.ajax.calls.count()).toEqual(2);
        });


        it('should not fetch the data when search string length is greater than previous search string', function() {
            spyOn($, 'ajax');

            suggestionBox = $search.suggestionBox({
                url: "/foobar",
                fetchAfter: 0
            });

            // initial search string
            $search.val('f');
            $search.keyup();
            jasmine.clock().tick(10);
            // Just invoke this manually, suggestionBox does it internally after an ajax call, 
            // but jasmine doesn't invoke the callback even with async flag set 
            // there may be a cleaner solution, which is worth investigating later.
            suggestionBox._fetchSuggestionsCallback()();

            // add one character (now it's greater than previous search)
            $search.val('fo');
            $search.keyup();
            jasmine.clock().tick(10);

            expect($.ajax.calls.count()).toEqual(1);
        });

        it('should use the internal filter when search string length is greater than previous search string', function() {
            var anubis = jasmine.createSpyObj('Anubis', ['fetchSuggestions', 'getSuggestions', 'getLastSearch', 'setSearch', 'getSearch', 'setData']);

            // How everything would be set internally after fetching data for "f"
            anubis.getLastSearch.and.returnValue('f');
            anubis.getSuggestions.and.returnValue(['foo']);
            // The current search, we are mocking the input "fo" which should trigger the filter
            anubis.getSearch.and.returnValue('fo');

            suggestionBox = $search.suggestionBox({
                url: "/foobar",
                fetchAfter: 0
            });
            suggestionBox.setAnubis(anubis);


            // add one character (now it's greater than previous search)
            $search.val('fo');
            $search.keyup();

            // getSuggestion() is simply an alias for filterData, which is what is called internally
            expect(anubis.getSuggestions).toHaveBeenCalled();
            expect(anubis.fetchSuggestions).not.toHaveBeenCalled();
        });


        it('should fetch the data once', function() {
            spyOn($, 'ajax');

            suggestionBox = $search.suggestionBox({
                url: "/foobar",
                fetchAfter: 0,
                fetchOnce: true
            });


            $search.val('fo');
            $search.keyup();
            jasmine.clock().tick(10);
            // Just invoke this manually, suggestionBox does it internally after an ajax call, 
            // but jasmine doesn't invoke the callback even with async flag set
            // there may be a cleaner solution, which is worth investigating later.
            suggestionBox._fetchSuggestionsCallback()();

            $search.val('f');
            $search.keyup();
            jasmine.clock().tick(10);

            expect($.ajax.calls.count()).toEqual(1);

        });

        it('should fetch the data everytime the user adds input', function() {
            spyOn($, 'ajax');

            suggestionBox = $search.suggestionBox({
                url: "/foobar",
                fetchAfter: 0,
                fetchEvery: 5
            });


            $search.val('f');
            $search.keyup();
            jasmine.clock().tick(10);
            suggestionBox._fetchSuggestionsCallback()();

            $search.val('fo');
            $search.keyup();
            jasmine.clock().tick(10);

            $search.val('foo');
            $search.keyup();
            jasmine.clock().tick(10);

            expect($.ajax.calls.count()).toEqual(3);

        });
    });

    describe('is open', function() {
        var $search;
        var data;

        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');
            data = ['foo', 'foobar'];

            $search.suggestionBox({ data: data });
            $search.val('f');
            $search.focus();
        });

        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
        });

        it('should show suggestion menu', function() {
            expect($('.suggestion-box').css('display')).toBe('block');
        });

        it('should show suggestions', function() {
            expect($('.suggestion-box').find('li:eq(0)').text()).toBe('foo');
            expect($('.suggestion-box').find('li:eq(1)').text()).toBe('foobar');
        });
    });


    beforeEach(function() {
        $body = $('body');
        $body.append('<input type="text" id="search" />');
    });

    afterEach(function() {
        $(".suggestion-box").remove();
        $('#search').remove();
    });


    describe('on user keyed input', function() {
        var $search;
        var data;
        var suggestionBox;

        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');
            data = ['foo', 'bar', 'baz'];

            suggestionBox = $search.suggestionBox({ data: data });
            $search.val('f');
            $search.focus();

        });


        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
            delete suggestionBox;
            delete $search;
        });

        var type = function(letter) {
            var letters = "abcdefghijklmnopqrstuvwxyz"
            var key = letters.indexOf(letter) + 65;

            var e = $.Event('keyup');
            e.which = key;
            $search.focus();
            $search.val(letter);

            $search.trigger(e);


        };

        it('should filter suggestions', function() {
            expect($('.suggestion-box').find('li:eq(0)').text()).toBe('foo');
            expect($('.suggestion-box').find('ul > li').length).toEqual(1);

            type('b');

            expect($('.suggestion-box').find('li:eq(0)').text()).toBe('bar');
            expect($('.suggestion-box').find('li:eq(1)').text()).toBe('baz');
            expect($('.suggestion-box').find('ul > li').length).toEqual(2);

            type('baz');

            expect($('.suggestion-box').find('li:eq(0)').text()).toBe('baz');
            expect($('.suggestion-box').find('ul > li').length).toEqual(1);
        });

        it('should update the typeahead', function() {
            type('b');
            // The typeahead functions regardless of whether or not it is displayed, so there is
            // no need set the typeahead option
            var typeahead = suggestionBox.getTypeahead();
            expect(typeahead.getTypeahead()).toBe('bar');
        });

        it('should hide the suggestion list when no suggestions have been found', function() {
            type('qux');
            expect($('.suggestion-box').css('display')).toBe('none');
        });

        it('should filter an array of objects', function() {
            data = [{ 'suggestion': 'foo' }, { 'suggestion': 'bar' }, { 'suggestion': 'baz' }];
            suggestionBox.set("data", data);

            type('b');

            expect($('.suggestion-box').find('li:eq(0)').text()).toBe('bar');
            expect($('.suggestion-box').find('li:eq(1)').text()).toBe('baz');
            expect($('.suggestion-box').find('ul > li').length).toEqual(2);

            type('baz');

            expect($('.suggestion-box').find('li:eq(0)').text()).toBe('baz');
            expect($('.suggestion-box').find('ul > li').length).toEqual(1);
        });

        it('should filter an array of objects that have a custom searchBy option', function() {
            data = [{ 'name': 'foo' }, { 'name': 'bar' }, { 'name': 'baz' }];
            suggestionBox.set("data", data);
            suggestionBox.set("searchBy", 'name');

            type('b');

            // we would need a new template to check the markup and we are not testing that here, 
            // so let's see what anubis has filtered for us:
            expect(suggestionBox.getAnubis().filterData()[0].name).toBe('bar');
            expect(suggestionBox.getAnubis().filterData()[1].name).toBe('baz');

        });
    });

    describe('template', function() {

    })



    describe('drodown menu', function() {
        var suggestionBox;

        beforeEach(function() {
            $body = $('body');
            $body.append('<input type="text" id="search" />');
            $search = $('#search');
            data = ['foo', 'bar', 'baz'];

        });


        afterEach(function() {
            $(".suggestion-box").remove();
            $('#search').remove();
            $search.blur();
            suggestionBox.destroy();
        });



        it('should set the suggestion-box left position level with the search box', function() {
            var leftPosition = Math.round(Math.random() * (500));
            var $search = $('#search');
            $search.css({
                'position': 'absolute',
                'left': leftPosition + 'px'
            });
            var data = ['foo'];
            suggestionBox = $search.suggestionBox({ data: data });
            $search.val('f');
            $search.focus();

            expect($('.suggestion-box').offset().left).toBe($search.offset().left);
        });


        it('should set the suggestion-box top position below the search box', function() {
            var topPosition = Math.round(Math.random() * (500));
            var $search = $('#search');
            $search.css({
                'position': 'absolute',
                'top': topPosition + 'px'
            });

            var data = ['foo'];
            suggestionBox = $search.suggestionBox({ data: data });
            $search.val('f');
            $search.focus();

            expectedPosition = ($search.offset().top) +
                $search.height() +
                parseInt($search.css('border-top-width').replace('px', '')) +
                parseInt($search.css('border-bottom-width').replace('px', '')) +
                parseInt($search.css('padding-top').replace('px', '')) +
                parseInt($search.css('padding-bottom').replace('px', ''));

            expect($('.suggestion-box').offset().top).toBe(expectedPosition);

        });

        it('should set the suggestion box width to the size of the search box', function() {
            var width = Math.round(Math.random() * (1000));

            var $search = $('#search');
            $search.css({
                width: width
            });

            width += (
                parseInt($search.css('border-left-width').replace('px', '')) +
                parseInt($search.css('border-right-width').replace('px', '')) +
                parseInt($search.css('padding-left').replace('px', '')) +
                parseInt($search.css('padding-right').replace('px', ''))
            );

            var data = ['foo'];
            suggestionBox = $search.suggestionBox({ data: data });
            $search.val('f');
            $search.focus();

            expect($('.suggestion-box').css('width')).toBe(width + 'px');

        });

        it('should fade In the suggestion box', function() {
            var $search = $('#search');

            spyOn($.fn, 'fadeIn');

            var data = ['foo'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.blur();
            $search.val('f');
            $search.focus();

            expect($(suggestionBox).fadeIn).toHaveBeenCalled();

        });

        it('should hide the suggestion box on blur', function() {
            var $search = $('#search');

            var data = ['foo'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            expect($('.suggestion-box').css('display')).toBe('block');
            $search.blur();
            expect($('.suggestion-box').css('display')).toBe('none');
        });


        it('should not display when suggestions are not available', function() {
            var $search = $('#search');

            var data = [];
            suggestionBox = $search.suggestionBox({ data: data })

            $search.val('f');
            $search.focus();

            expect($('.suggestion-box').css('display')).toBe('none');

        });

        it('should highlight the suggestion on mouseover', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            $suggestionBox = $('.suggestion-box');
            $suggestionBox.find('li:eq(0) a').mousemove();
            expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeTruthy();

            $suggestionBox.find('li:eq(1) a').mousemove();
            expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeTruthy();
            expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeFalsy();
        });


        it('should move down with the down arrow key', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);
            expect($('.suggestion-box').find('li:eq(0)').hasClass('selected')).toBeTruthy();
        });

        it('should move down with the down arrow key', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            // down, down arrow
            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);
            $search.trigger(e);

            // up arrow
            e.which = 38;
            $search.trigger(e);

            expect($('.suggestion-box').find('li:eq(0)').hasClass('selected')).toBeTruthy();
        });

        it('should allow the user to switch from mouse to keys without loss of selection', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar', 'fun', 'far'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            $suggestionBox = $('.suggestion-box');
            $suggestionBox.find('li:eq(1) a').mousemove();

            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);

            expect($('.suggestion-box').find('li:eq(2)').hasClass('selected')).toBeTruthy();
        });

        it('should reset the selection on down arrow at end of list and restart at top', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar', 'fun', 'far'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            $suggestionBox = $('.suggestion-box');
            $suggestionBox.find('li:eq(3) a').mousemove();

            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);

            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);

            expect($('.suggestion-box').find('li:eq(0)').hasClass('selected')).toBeTruthy();
        });

        it('should reset the selection on up arrow at end of list and restart at end of list', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar', 'fun', 'far'];
            suggestionBox = $search.suggestionBox({ data: data });

            $search.val('f');
            $search.focus();

            $suggestionBox = $('.suggestion-box');
            $suggestionBox.find('li:eq(0) a').mousemove();

            var e = $.Event('keydown');
            e.which = 38;
            $search.trigger(e);

            var e = $.Event('keydown');
            e.which = 38;
            $search.trigger(e);

            expect($('.suggestion-box').find('li:eq(3)').hasClass('selected')).toBeTruthy();
        });


        it('should scroll with the arrow keys', function() {
            var $search = $('#search');
            var data = ['foo', 'foobar', 'fun', 'far'];
            suggestionBox = $search.suggestionBox({
                data: data,
                height: 10,
                scrollable: true
            });


            $search.val('f');
            $search.focus();

            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);
            $search.trigger(e);

            var $suggestionBox = $(".suggestion-box");
            expect($suggestionBox.scrollTop() > 0).toBeTruthy();

            e.which = 38;
            $search.trigger(e);
            $search.trigger(e);

            expect($suggestionBox.scrollTop() === 0).toBeTruthy();
        });
    });
});
