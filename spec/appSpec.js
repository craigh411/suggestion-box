describe("Suggestion Box", function () {

    var $ = jQuery;

    beforeEach(function () {
        var $body = $('body');

        $body.append('<input type="text" id="search" />');
    });

    afterEach(function () {
        $(".suggestion-box").remove();
        $('#search').remove();
    });

    it("should inject the suggestion box in to the body of the web page", function () {
        $('#search').suggestionBox({url: '#'});
        expect($('body').find('.suggestion-box').length).toEqual(1);
    });

    it('should return the suggestion box id without the hash', function () {
        var suggestionBox = $('#search').suggestionBox();
        expect(suggestionBox.getId()).toBeDefined();
        expect(suggestionBox.getId().match(/^#/g)).toBeFalsy();
    });

    it('should return the suggestion box id with the hash', function () {
        var suggestionBox = $('#search').suggestionBox();

        expect(suggestionBox.getId(true)).toBeDefined();
        expect(suggestionBox.getId(true).match(/^#/g)).toBeTruthy();
    });

    it('should turn off autocomplete', function () {
        var $search = $('#search');
        $search.suggestionBox();
        expect($search.attr('autocomplete')).toEqual('off');
    });

    it('should set the suggestion-box left position level with the search box', function () {
        var leftPosition = Math.round(Math.random() * (1000));
        var $search = $('#search');
        $search.css({
            'position': 'absolute',
            'left': leftPosition + 'px'
        });
        var suggestionBox = $search.suggestionBox({url: '#'});
        var id = suggestionBox.getId(true);

        expect($(id).offset().left).toBe($search.offset().left);
        suggestionBox.destroy();
    });


    it('should set the suggestion-box top position below the search box', function () {
        // generate random position
        var topPosition = Math.round(Math.random() * (1000));

        var $search = $('#search');
        $search.css({
            'position': 'absolute',
            'top': topPosition + 'px'
        });

        var suggestionBox = $search.suggestionBox({url: '#'});

        expectedPosition = ($search.offset().top) +
            $search.height() +
            parseInt($search.css('border-top-width').replace('px', '')) +
            parseInt($search.css('border-bottom-width').replace('px', '')) +
            parseInt($search.css('padding-top').replace('px', '')) +
            parseInt($search.css('padding-bottom').replace('px', ''));

        var id = suggestionBox.getId(true);
        expect($(id).position().top).toBe(expectedPosition);
        suggestionBox.destroy();
    });

    it('should set the suggestion box width to the size of the search box', function () {
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

        var suggestionBox = $search.suggestionBox({menuWidth: 'constrain'}).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true);

        var id = suggestionBox.getId(true);
        expect($(id).width()).toBe(width);
        suggestionBox.destroy();
    });


    it('should fade In the suggestion box', function () {
        var $search = $('#search');
        spyOn($.fn, 'fadeIn');

        var suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true);

        var $suggestionBox = $(suggestionBox.getId(true));

        expect($suggestionBox.fadeIn).toHaveBeenCalled();
        suggestionBox.destroy();
    });

    it('should not fade In the suggestion box', function () {
        var $search = $('#search');
        spyOn($.fn, 'fadeIn');

        suggestionBox = $search.suggestionBox({fadeIn: false}).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true);

        var $suggestionBox = $(suggestionBox.getId(true));

        expect($suggestionBox.fadeIn).not.toHaveBeenCalled();
        suggestionBox.destroy();
    });


    it('should fade out the suggestion box', function () {
        var $search = $('#search');
        spyOn($.fn, 'fadeOut');

        suggestionBox = $search.suggestionBox({fadeOut: true}).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true).hide();

        var $suggestionBox = $(suggestionBox.getId(true));
        expect($suggestionBox.fadeOut).toHaveBeenCalled();
        suggestionBox.destroy();
    });

    it('should not fade out the suggestion box', function () {
        var $search = $('#search');
        spyOn($.fn, 'fadeOut');

        suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true).hide();

        var $suggestionBox = $(suggestionBox.getId(true));
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

        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');
        var suggestionBox = $search.suggestionBox({heading: 'foobar'}).addSuggestions(suggestions).show(true);

        var id = suggestionBox.getId(true);
        expect($(id).find('.suggestion-header').text()).toBe('foobar');
        suggestionBox.destroy();
    });

    it('shows only 2 results', function () {
        var $search = $('#search');

        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');
        var suggestionBox = $search.suggestionBox({results: 2}).addSuggestions(suggestions).show(true);

        var id = suggestionBox.getId(true);

        expect($(id).find('li').size()).toBe(2);
        suggestionBox.destroy();
    });


    it('should display no suggestions message when suggestions are not available', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox({
            showNoSuggestionsMessage: true,
            noSuggestionsMessage: 'No Suggestions'
        });

        $search.val('foo');
        suggestionBox.addSuggestions(JSON.stringify({})).show(true);

        var id = suggestionBox.getId(true);

        expect($(id).css('display')).toBe('block');
        expect($(id).text()).toBe('No Suggestions');
        suggestionBox.destroy();

    });


    it('should not display when suggestions are not available', function () {
        var $search = $('#search');

        var suggestionBox = $search.suggestionBox().addSuggestions({"suggestions": []}).show();

        var id = suggestionBox.getId(true);

        expect($(id).css('display')).toBe('none');
        suggestionBox.destroy();
    });


    it('should close hide the menu when the enter button is pressed on a selection', function () {
        var $search = $('#search');

        suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show();

        $search.focus();
        suggestionBox.select(0);
        var e = $.Event('keydown');
        e.which = 13;
        $search.trigger(e);

        var id = suggestionBox.getId(true);
        expect($(id).css('display')).toBe('none');
        suggestionBox.destroy();
    });

    it('should add an attribute to the anchor tag', function () {
        var $search = $('#search');

        suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#", "attr": [{"class": "foo"}]}
            ]
        })).show(true);

        var id = suggestionBox.getId(true);
        expect($(id).find('.foo').length).toBe(1);
        suggestionBox.destroy();
    });

    it('should adds multiple attributes to the anchor tag', function () {
        var $search = $('#search');

        suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#", "attr": [{"class": "foo", "id": "bar"}]}
            ]
        })).show(true);

        var id = suggestionBox.getId(true);
        $suggestionBox = $(id);
        expect($suggestionBox.find('.foo').length).toBe(1);
        expect($suggestionBox.find('#bar').length).toBe(1);
        suggestionBox.destroy();
    });

    it('override the enter key function', function () {
        var $search = $('#search');
        spyOn(console, 'log');

        suggestionBox = $search.suggestionBox({
            onClick: function () {
                console.log('foo')
            }
        }).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true);


        $search.focus();
        suggestionBox.select(0);
        var e = $.Event('keydown');
        e.which = 13;
        $search.trigger(e);

        expect(console.log).toHaveBeenCalled();
        suggestionBox.destroy();

    });

    it('overrides the enter key function with the onClick event', function () {
        var $search = $('#search');
        spyOn(console, 'log');

        suggestionBox = $search.suggestionBox({
            onClick: function () {
                console.log('foo');
            }
        }).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]

        })).show(true);

        $search.focus();
        suggestionBox.select(0);
        var e = $.Event('keydown');
        e.which = 13;
        $search.trigger(e);

        expect(console.log).toHaveBeenCalled();
        suggestionBox.destroy();

    });

    it('should not prevent enter key default when nothing is selected', function () {
        var $search = $('#search');
        spyOn(console, 'log');

        suggestionBox = $search.suggestionBox({
            enterKeyAction: function () {
                console.log('foo')
            }
        }).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        })).show(true);


        $search.focus();
        var e = $.Event('keydown');
        e.which = 13;
        $search.trigger(e);

        expect(console.log).not.toHaveBeenCalled();
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


            $search = $('#search');
            suggestionBox = $search.suggestionBox();
            $suggestionBox = $(suggestionBox.getId(true));

            jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
            var suggestions = getJSONFixture('suggestions.json');
            $search.focus();
            suggestionBox.addSuggestions(suggestions).show(true);
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
            suggestionBox.resetSelection();
            expect(suggestionBox.selectedUrl()).toBe('#');
            expect(suggestionBox.position()).toBe(-1);

        });

        it('should keep the suggestion box displayed upon reset', function () {
            suggestionBox.select(2);
            suggestionBox.resetSelection();
            expect($suggestionBox.css('display')).toBe('block');
        });

        it('should remove the selected class upon reset', function () {
            suggestionBox.select(2);
            suggestionBox.resetSelection();
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

        it('selects the suggestion if mouse over when the mouse moves', function () {
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
    it('should add json', function () {
        var json = JSON.stringify({"suggestions": [{"suggestion": "Suggestion 1", "url": "suggestion1.html"}]});
        suggestionBox.addSuggestions(json);
        expect(suggestionBox.getJson()).toBe(json);
        suggestionBox.destroy();
    });

    it('should make an ajax call to a json file', function () {
        spyOn($, 'ajax');
        suggestionBox.loadSuggestions('suggestions.json');
        expect($.ajax.calls.mostRecent().args[0].url).toBe('suggestions.json');
        suggestionBox.destroy();
    });


    it('should filter results', function () {
        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        var suggestionBox = $search.suggestionBox({filter: true}).addSuggestions(suggestions);
        var $suggestionBox = $(suggestionBox.getId(true));

        $search.focus();
        $search.val('Suggestion 1');
        suggestionBox.show(true);

        expect($suggestionBox.find('li').size()).toBe(1);
        suggestionBox.destroy();
    });

    it('should filter results by given regex pattern', function () {

        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({filter: true, filterPattern: "^{INPUT}$"}).addSuggestions(suggestions);
        $suggestionBox = $(suggestionBox.getId(true));
        $search.val('suggestion');
        suggestionBox.show();
        expect($suggestionBox.find('li').size()).toBe(0);

        suggestionBox.destroy();
    });

    it('should sanitize regex characters when filtering', function () {

        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({filter: true, filterPattern: "^{INPUT}$"}).addSuggestions(suggestions);
        $suggestionBox = $(suggestionBox.getId(true));

        // regex for everything
        $search.val('.');
        suggestionBox.show();
        expect($suggestionBox.find('li').size()).toBe(0);

        suggestionBox.destroy();
    });

    it('should remove bottom border radius when suggestions are shown and add them back when hidden', function () {
        $search = $('#search');

        $search.css({
            'border-bottom-right-radius': 5,
            'border-bottom-left-radius': 5
        });

        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox().addSuggestions(suggestions);
        suggestionBox.show(true);

        expect($search.css('border-bottom-right-radius')).toBe('0px');
        expect($search.css('border-bottom-left-radius')).toBe('0px');
        suggestionBox.hide();
        expect($search.css('border-bottom-right-radius')).toBe('5px');
        expect($search.css('border-bottom-left-radius')).toBe('5px');
    });


    it('should not change the border-radius when suggestions are shown', function () {
        $search = $('#search');

        $search.css({
            'border-bottom-right-radius': 5,
            'border-bottom-left-radius': 5
        });

        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({adjustBorderRadius: false}).addSuggestions(suggestions);
        suggestionBox.show(true);

        expect($search.css('border-bottom-right-radius')).toBe('5px');
        expect($search.css('border-bottom-left-radius')).toBe('5px');
    });

    it('should add scrollbars to the suggestion box', function () {
        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({height: 10, scrollable: true}).addSuggestions(suggestions);
        $search.val('s');
        suggestionBox.show(true);

        $suggestionBox = $(suggestionBox.getId(true));

        expect(
            $suggestionBox.css('overflow') === 'auto' &&
            $suggestionBox.get(0).scrollHeight > $suggestionBox.innerHeight()
        ).toBeTruthy();
    });

    it('should scroll with the arrow keys', function () {
        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({height: 10, scrollable: true}).addSuggestions(suggestions);
        $search.val('s');
        suggestionBox.show(true);

        $suggestionBox = $(suggestionBox.getId(true));
        var e = $.Event('keydown');
        e.which = 40;
        $search.trigger(e);
        $search.trigger(e);

        expect($suggestionBox.scrollTop() > 0).toBeTruthy();

        e.which = 38;
        $search.trigger(e);
        $search.trigger(e);

        expect($suggestionBox.scrollTop() === 0).toBeTruthy();
    });

    it('should scroll to position when set', function () {
        $search = $('#search');
        jasmine.getJSONFixtures().fixturesPath = 'base/spec/support';
        var suggestions = getJSONFixture('suggestions.json');

        suggestionBox = $search.suggestionBox({height: 10, scrollable: true}).addSuggestions(suggestions);
        $search.val('s');
        suggestionBox.show(true);
        suggestionBox.select(1);

        $suggestionBox = $(suggestionBox.getId(true));
        expect($suggestionBox.scrollTop() > 0).toBeTruthy();
    });

    it('should add a custom value to each suggestion', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox({customData: ['custom']}).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#", "custom": " foo"}
            ]
        })).show(true);


        $suggestionBox = $(suggestionBox.getId(true));
        expect(suggestionBox.selectedSuggestion()).toBe("suggestion foo");
    });

    it('should add multiple custom values to each suggestion', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox({customData: ['custom1', 'custom2']}).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#", "custom1": " foo", "custom2": "bar"}
            ]
        })).show(true);

        $suggestionBox = $(suggestionBox.getId(true));
        expect(suggestionBox.selectedSuggestion()).toBe("suggestion foobar");
    });

    it('should get the jQuery object', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox();

        expect(suggestionBox.el() instanceof jQuery).toBeTruthy();
    });

    it('should return a jQuery object', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox();

        expect(suggestionBox instanceof jQuery).toBeTruthy();
    });

    it('should not return a jQuery object', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox({noConflict: true});

        expect(suggestionBox instanceof jQuery).toBeFalsy();
    });

    it('should clear the suggestions list', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#"}
            ]
        }));

        expect(suggestionBox.getJson()).not.toBe('{}');
        suggestionBox.clearSuggestions();
        expect(suggestionBox.getJson()).toBe('{}');

    });

    it('adds an image to the suggestion list', function () {
        var $search = $('#search');
        var suggestionBox = $search.suggestionBox().addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#", "image": "foo.jpg"}
            ]
        })).show(true);

        expect($(suggestionBox.getId(true)).find('img').length > 0).toBeTruthy();
    });

    it('highlights the pattern match', function () {
        var $search = $('#search');
        $search.val('s');
        var suggestionBox = $search.suggestionBox({highlightMatch: true}).addSuggestions(JSON.stringify({
            "suggestions": [
                {"suggestion": "suggestion", "url": "#", "image": "foo.jpg"}
            ]
        })).show(true);


        expect($(suggestionBox.getId(true)).find('b').length > 0).toBeTruthy();
    });
});

