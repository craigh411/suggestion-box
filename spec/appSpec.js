describe("Suggestion Box", function () {

    var $ = jQuery;

    beforeEach(function () {
        $('body').remove('#search');
        $('body').append('<input type="text" id="search" />');
    });

    it("should inject the suggestion box in to the body of the web page", function () {
        $('#search').suggestionBox({url: '#'});
        expect($('#suggestion-box').length).toEqual(1);
    });

    it('should turn off autocomplete', function () {
        expect($('#search').attr('autocomplete')).toEqual('off');
    });

    it('should set the suggestion-box left position level with the search box', function () {
        var leftPosition = Math.round(Math.random() * (1000));
        var $search = $('#search');
        $search.css({
            'position': 'absolute',
            'left': leftPosition + 'px'
        });
        $search.suggestionBox({url: '#'});

        expect($('#suggestion-box').offset().left).toBe($search.offset().left);

    });

    it('should set the suggestion-box top position below the search box', function () {
        // generate random position
        var topPosition = Math.round(Math.random() * (1000));

        var $search = $('#search');
        $search.css({
            'position': 'absolute',
            'top': topPosition + 'px'
        });

        $search.suggestionBox({url: '#'});

        expectedPosition = ($search.offset().top) +
            $search.height() +
            parseInt($search.css('border-top-width').replace('px', '')) +
            parseInt($search.css('border-bottom-width').replace('px', '')) +
            parseInt($search.css('padding-top').replace('px', '')) +
            parseInt($search.css('padding-bottom').replace('px', ''));

        expect($('#suggestion-box').position().top).toBe(expectedPosition);
    });

    it('should fade In the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeIn');
        suggestionBox = $search.suggestionBox();
        suggestionBox.show();

        expect($suggestionBox.fadeIn).toHaveBeenCalled();
    });

    it('should not fade In the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeIn');

        suggestionBox = $search.suggestionBox({fadeIn: false});
        suggestionBox.show();

        expect($suggestionBox.fadeIn).not.toHaveBeenCalled();
    });


    it('should fade out the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeOut');

        suggestionBox = $search.suggestionBox({fadeOut: true});
        suggestionBox.show().hide();

        expect($suggestionBox.fadeOut).toHaveBeenCalled();
    });

    it('should not fade out the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeOut');

        suggestionBox = $search.suggestionBox();
        suggestionBox.show().hide();

        expect($suggestionBox.fadeOut).not.toHaveBeenCalled();
        expect($suggestionBox.css('display')).toBe('none');
    });


    it('should set the response', function () {
        var $search = $('#search');
        suggestionBox = $search.suggestionBox();
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');
        response = suggestionBox.showSuggestions(suggestions).response();
    });

    it('makes an ajax request to the given url', function () {
        spyOn($, 'ajax');
        suggestionBox.getSuggestions('suggestions.json');
        expect($.ajax.calls.mostRecent().args[0].url).toBe('suggestions.json');
    });

    describe('when suggestion box is displayed', function () {
        var $suggestionBox;
        var $search;
        var suggestionBox;

        beforeEach(function () {
            $('body').remove('#search');
            $('body').append('<input type="text" id="search" />');


            $suggestionBox = $('#suggestion-box');
            $search = $('#search');
            suggestionBox = $search.suggestionBox();
            jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
            var suggestions = getJSONFixture('suggestions.json');
            $search.focus();
            suggestionBox.showSuggestions(suggestions);
        });

        it('should display a list of suggestions', function () {
            expect($suggestionBox.find('ul > li').length).toEqual(5);
            expect($suggestionBox.css('display')).toBe('block');
        });

        it('should select the first suggestion', function () {
            suggestionBox.moveDown();
            expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeTruthy();

        });

        it('should select the last suggestion', function () {
            suggestionBox.moveUp();
            expect($suggestionBox.find('li:eq(4)').hasClass('selected')).toBeTruthy();

        });

        it('should  move down with the down arrow key', function () {
            var e = $.Event('keydown');
            e.which = 40;
            $search.trigger(e);
            expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeTruthy();
        });

        it('should move up with the up arrow key', function () {
            var e = $.Event('keydown');
            e.which = 38;
            $search.trigger(e);
            expect($suggestionBox.find('li:eq(4)').hasClass('selected')).toBeTruthy();
        });

        it('should hide the suggestion box with the escape button', function () {
            var e = $.Event('keydown');
            e.which = 27;
            $search.trigger(e);
            expect($suggestionBox.css('display')).toBe('none');
        });

        it('resets the suggestion box on hide', function () {
            suggestionBox.hide();
            expect(suggestionBox.selectedLink()).toBe('#');
            expect(suggestionBox.position()).toBe(-1);
        });
    });
});

