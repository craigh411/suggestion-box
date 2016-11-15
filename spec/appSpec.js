describe("Suggestion Box", function() {

    var $ = jQuery;
    var body;


    beforeEach(function() {
        $body = $('body');
        $body.append('<input type="text" id="search" />');
    });

    afterEach(function() {
        $(".suggestion-box").remove();
        $('#search').remove();
    });

    it('should inject the suggestion box in to the body of the web page', function() {
        $('#search').suggestionBox();
        expect($('body').find('.suggestion-box').length).toEqual(1);
    });


    it('should turn off autocomplete', function() {
        var $search = $('#search');
        $search.suggestionBox();
        expect($search.attr('autocomplete')).toEqual('off');
    });

    it('should show suggestion menu on focus', function() {
        var $search = $('#search');
        var data = ['foo'];
        $search.suggestionBox({ data: data });
        $search.val('f');
        $search.focus();
        expect($('.suggestion-box').css('display')).toBe('block');

    });

    it('should show suggestions', function() {
        var $search = $('#search');
        var data = ['foo', 'foobar'];
        $search.suggestionBox({ data: data });
        $search.val('f');
        $search.focus();
        expect($('.suggestion-box').find('li:eq(0)').text()).toBe('foo');
        expect($('.suggestion-box').find('li:eq(1)').text()).toBe('foobar');
    });


    it('should filter suggestions', function() {
        var $search = $('#search');
        var data = ['foo', 'bar'];
        $search.suggestionBox({ data: data });
        $search.val('f');
        $search.focus();
        expect($('.suggestion-box').find('li:eq(0)').text()).toBe('foo');
        expect($('.suggestion-box').find('ul').length).toEqual(1);

        $search.val('b');
        $search.focus();

        expect($('.suggestion-box').find('li:eq(0)').text()).toBe('bar');
        expect($('.suggestion-box').find('ul').length).toEqual(1);
    });

    it('should allow suggestions to be an array of objects', function() {
        var $search = $('#search');
        var data = [{ 'suggestion': 'foo' }, { 'suggestion': 'bar' }];
        $search.suggestionBox({ data: data });
        $search.val('f');
        $search.focus();
        expect($('.suggestion-box').find('li:eq(0)').text()).toBe('foo');
        expect($('.suggestion-box').find('ul').length).toEqual(1);
    });



    it('should set the suggestion-box left position level with the search box', function() {
        var leftPosition = Math.round(Math.random() * (500));
        var $search = $('#search');
        $search.css({
            'position': 'absolute',
            'left': leftPosition + 'px'
        });
        var data = ['foo'];
        var suggestionBox = $search.suggestionBox({ data: data });
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
        var suggestionBox = $search.suggestionBox({ data: data });
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
        var suggestionBox = $search.suggestionBox({ data: data });
        $search.val('f');
        $search.focus();

        expect($('.suggestion-box').css('width')).toBe(width + 'px');

    });

    it('should fade In the suggestion box', function() {
        var $search = $('#search');
        spyOn($.fn, 'fadeIn');

        var data = ['foo'];
        var suggestionBox = $search.suggestionBox({ data: data });
        $search.val('f');
        $search.focus();

        expect($(suggestionBox).fadeIn).toHaveBeenCalled();

    });

    it('should hoie the suggestion box on blur', function() {
        var $search = $('#search');

        var data = ['foo'];
        var suggestionBox = $search.suggestionBox({ data: data });

        $search.val('f');
        $search.focus();

        expect($('.suggestion-box').css('display')).toBe('block');
        $search.blur();
        expect($('.suggestion-box').css('display')).toBe('none');
    });


    it('should not display when suggestions are not available', function() {
        var $search = $('#search');

        var data = [];
        var suggestionBox = $search.suggestionBox({ data: data })

        $search.val('f');
        $search.focus();

        expect($('.suggestion-box').css('display')).toBe('none');

    });

    it('should highlight the suggestion on mouseover', function() {
        var $search = $('#search');
        var data = ['foo', 'foobar'];
        var suggestionBox = $search.suggestionBox({ data: data });

        $search.val('f');
        $search.focus();

        $suggestionBox = $('.suggestion-box');
        $suggestionBox.find('li:eq(0) a').mousemove();
        expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeTruthy();

        $suggestionBox.find('li:eq(1) a').mousemove();
        expect($suggestionBox.find('li:eq(1)').hasClass('selected')).toBeTruthy();
        expect($suggestionBox.find('li:eq(0)').hasClass('selected')).toBeFalsy();
    });


    it('should  move down with the down arrow key', function() {
        var $search = $('#search');
        var data = ['foo', 'foobar'];
        var suggestionBox = $search.suggestionBox({ data: data });

        $search.val('f');
        $search.focus();

        var e = $.Event('keydown');
        e.which = 40;
        $search.trigger(e);
        expect($('.suggestion-box').find('li:eq(0)').hasClass('selected')).toBeTruthy();
    });

});
