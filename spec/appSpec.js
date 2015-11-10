describe("Suggestion Box", function () {

    var $ = jQuery;

    beforeEach(function () {
        var $body = $('body');
        $body.remove('#search');
        $body.append('<input type="text" id="search" />');
    });

    afterEach(function(){
        $("suggestion-box").remove();
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
        suggestionBox.destroy();
    });

    it('should not fade In the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeIn');

        suggestionBox = $search.suggestionBox({fadeIn: false});
        suggestionBox.show();

        expect($suggestionBox.fadeIn).not.toHaveBeenCalled();
        suggestionBox.destroy();
    });


    it('should fade out the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeOut');

        suggestionBox = $search.suggestionBox({fadeOut: true});
        suggestionBox.show().hide();

        expect($suggestionBox.fadeOut).toHaveBeenCalled();
        suggestionBox.destroy();
    });

    it('should not fade out the suggestion box', function () {
        var $suggestionBox = $('#suggestion-box');
        var $search = $('#search');
        spyOn($.fn, 'fadeOut');

        suggestionBox = $search.suggestionBox();
        suggestionBox.show().hide();

        expect($suggestionBox.fadeOut).not.toHaveBeenCalled();
        expect($suggestionBox.css('display')).toBe('none');
        suggestionBox.destroy();
    });

    it('makes an ajax request to the given url', function () {
        var $search = $('#search');
        suggestionBox = $search.suggestionBox();

        spyOn($, 'ajax');
        suggestionBox.getSuggestions('suggestions.json');
        expect($.ajax.calls.mostRecent().args[0].url).toBe('suggestions.json');
        suggestionBox.destroy();
    });

    it('sets the heading', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox({heading: 'foobar'});
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');
        suggestionBox.showSuggestions(suggestions);
        expect($('#suggestion-header').text()).toBe('foobar');
        suggestionBox.destroy();
    });

    it('shows only 2 results', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox({results: 2});
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');
        suggestionBox.showSuggestions(suggestions);

        expect($('#suggestion-box').find('li').size()).toBe(2);
        suggestionBox.destroy();
    });


    it('should display no suggestions message when suggestions are not available', function () {
        var $search = $('#search');
        suggestionBox = $search.suggestionBox({
            showNoSuggestionsMessage: true,
            noSuggestionsMessage: 'No Suggestions'
        });

        suggestionBox.showSuggestions(JSON.stringify({}));

        expect($('#suggestion-box').css('display')).toBe('block');
        expect($('#no-suggestions').text()).toBe('No Suggestions');
        suggestionBox.destroy();

    });


    it('should not display when suggestions are not available', function () {
        var $search = $('#search');
        suggestionBox = $search.suggestionBox();
        suggestionBox.showSuggestions(JSON.stringify({}));

        expect($('#suggestion-box').css('display')).toBe('none');
        suggestionBox.destroy();
    });

    describe('when displayed', function () {
        var $suggestionBox;
        var $search;
        var suggestionBox;

        beforeEach(function () {
            var $body = $('body');
            $body.remove('#search');
            $body.append('<input type="text" id="search" />');

            $suggestionBox = $('#suggestion-box');
            $search = $('#search');
            suggestionBox = $search.suggestionBox();

            jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
            var suggestions = getJSONFixture('suggestions.json');
            $search.focus();
            suggestionBox.showSuggestions(suggestions);
        });

        afterEach(function () {
            suggestionBox.destroy();
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

        it('should return the selected suggestion text', function () {
            suggestionBox.moveDown();
            expect(suggestionBox.selectedSuggestion()).toBe('Suggestion 1');
        });

        it('should return the selected url', function () {
            suggestionBox.moveDown();
            expect(suggestionBox.selectedUrl()).toBe('suggestion1.html');
        });

        it('should select the suggestion at the given position', function () {
            suggestionBox.select(2);
            expect(suggestionBox.position()).toBe(2);
        });

        it('should apply the selected class to the selected suggestion', function () {
            suggestionBox.select(1);
            expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeTruthy();
        });

        it('should apply the selected class ONLY to the selected suggestion', function () {
            suggestionBox.select(1);
            suggestionBox.select(2);
            expect($suggestionBox.find('li:eq(2)').hasClass('selected')).toBeTruthy();
            expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeFalsy();
        });

        it('should return the position of the selected suggestion', function () {
            suggestionBox.moveDown();
            expect(suggestionBox.position()).toBe(0);
            suggestionBox.moveDown();
            expect(suggestionBox.position()).toBe(1);
        });

        it('should reset the selection', function () {
            suggestionBox.select(2);
            suggestionBox.reset();
            expect(suggestionBox.selectedUrl()).toBe('#');
            expect(suggestionBox.position()).toBe(-1);

        });

        it('should keep the suggestion box displayed upon reset', function () {
            suggestionBox.select(2);
            suggestionBox.reset();
            expect($suggestionBox.css('display')).toBe('block');
        });

        it('should remove the selected class upon reset', function () {
            suggestionBox.select(2);
            suggestionBox.reset();
            expect($suggestionBox.find('li:eq(2)').hasClass('selected')).toBeFalsy();
        });

        it('should hide the suggestion box with the escape button', function () {
            var e = $.Event('keydown');
            e.which = 27;
            $search.trigger(e);
            expect($suggestionBox.css('display')).toBe('none');
        });

        it('resets the suggestion box on hide', function () {
            suggestionBox.hide();
            expect(suggestionBox.selectedUrl()).toBe('#');
            expect(suggestionBox.position()).toBe(-1);
        });

        it('selects the suggestion mouse if over on mousemove', function () {
            suggestionBox.select(3);
            $suggestionBox.find('li:eq(0) a').mousemove();

            expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeTruthy();
            expect($suggestionBox.find('li:eq(3)').hasClass('selected')).toBeFalsy();
        });

        it('should move down from the selected mouse position', function () {
            $suggestionBox.find('li:eq(1) a').mousemove();
            suggestionBox.moveDown();

            expect(suggestionBox.position()).toBe(2);
            expect($suggestionBox.find('li:eq(2)').hasClass('selected')).toBeTruthy();
            expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeFalsy();
        });

        it('should move up from the selected mouse position', function () {
            $suggestionBox.find('li:eq(1) a').mousemove();
            suggestionBox.moveUp();

            expect(suggestionBox.position()).toBe(0);
            expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeTruthy();
            expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeFalsy();
        });

        it('should reset on mouseout', function () {
            $suggestionBox.find('li:eq(1) a').mousemove();
            $suggestionBox.find('li:eq(1) a').mouseout();

            expect(suggestionBox.selectedUrl()).toBe('#');
            expect(suggestionBox.position()).toBe(-1);
            expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeFalsy();
        });
    });

    // filtering
    it('should add json', function(){
        var json = JSON.stringify({"results": [{"suggestion": "Suggestion 1", "url": "suggestion1.html"}]});
        suggestionBox.addSuggestions(json);
        expect(suggestionBox.jsonData()).toBe(json);
        suggestionBox.destroy();
    });

    it('should make an ajax call to a json file', function(){
        spyOn($, 'ajax');
        suggestionBox.loadSuggestions('suggestions.json');
        expect($.ajax.calls.mostRecent().args[0].url).toBe('suggestions.json');
        suggestionBox.destroy();
    });


    it('should filter results', function(){
        $suggestionBox = $('#suggestion-box');
        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({filter: true}).addSuggestions(suggestions);

        $search.focus();
        $search.val('Suggestion 1');
        suggestionBox.showSuggestions();
        expect($suggestionBox.find('li').size()).toBe(1);
        suggestionBox.destroy();
    });

    it('should filter results by given regex pattern', function(){
        $suggestionBox = $('#suggestion-box');
        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({filter: true, filterPattern: "^{INPUT}$"}).addSuggestions(suggestions);
        $search.val('suggestion');
        suggestionBox.showSuggestions();
        expect($suggestionBox.find('li').size()).toBe(0);

        suggestionBox.destroy();
    });

});

