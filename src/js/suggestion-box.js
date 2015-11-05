(function ($) {


    $.fn.suggestionBox = function (options) {
        var $searchBox = this;

        var settings = $.extend({
                // default settings.
                topOffset: 0,
                leftOffset: 0,
                delay: 400, // in ms
                heading: 'Suggestions',
                results: 10,
                fadeIn: true,
                fadeOut: true,
                menuWidth: 'auto',
                ajaxError: function (e) {
                    console.log(e);
                },
                paramName: 'search'
            },
            options);

        if (!settings.url) {
            throw 'url of suggestion json required';
        }

        // Inject the suggestion box into the body of the web page
        $('body').append('<div id="suggestion-box"></div>');
        // Turn off autocomplete
        $searchBox.attr('autocomplete', 'off');

        var $suggestionBox = $('#suggestion-box');
        setSuggestionBoxPosition();

        // Constants for key values
        const ENTER_KEY = 13;
        const UP_ARROW_KEY = 38;
        const DOWN_ARROW_KEY = 40;
        const ESCAPE_KEY = 27;

        // Default values for selected list item
        var selectedLi = -1;
        var selectedHref = '#';

        // Is the mouse hovering over the suggestion box?
        var mouseHover = false;
        // Timer for only making ajax calls when the user stops typing
        var timer = null;
        // Did we get any suggestions?
        var matches = false;
        // create a blank object for our request
        var request = {};


        $suggestionBox.on({
            'mousemove': function (e) {
                if (e.target.nodeName === 'A') {
                    $(this).find('li').removeClass('selected');
                    var $parentLi = $(e.target).parent('li');
                    selectedLi = $parentLi.parent().children().index($parentLi);
                    select(selectedLi);
                    mouseHover = true;
                }
            },
            'mouseout': function (e) {
                if (e.target.nodeName === 'A') {
                    mouseHover = false;
                    unselect(selectedLi);
                    resetSelection();
                }
            }
        });
        $searchBox.on({
            'blur': function () {
                // Only close the menu if we a re not clicking a link
                if (!mouseHover) {
                    if (settings.fadeOut) {
                        $suggestionBox.fadeOut();
                    } else {
                        $suggestionBox.css('display', 'none');
                    }
                }
            },
            'focus': function () {
                if ($(this).val()) {
                    if (settings.fadeIn) {
                        $suggestionBox.fadeIn();
                    } else {
                        $suggestionBox.css('display', 'block');
                    }
                }
            },
            'keyup': function (e) {
                // Ignore the navigation keys. We don't want to fire ajax calls when navigating
                if (e.which !== UP_ARROW_KEY && e.which !== DOWN_ARROW_KEY && e.which !== ESCAPE_KEY) {
                    if (timer) {
                        clearTimeout(timer);
                    }

                    // set the request to be sent sent as the data parameter
                    request[settings.paramName] = $searchBox.val();

                    timer = setTimeout(function () {
                        $.ajax({
                            url: settings.url,
                            data: request,
                            dataType: 'json',
                            success: function (data) {
                                resetSelection();

                                if(data.results) {
                                    var $suggestions = '<div id="suggestion-header">' + settings.heading + '</div> ' +
                                        '<ul id="suggestion-box-list">';

                                    $.each(data.results, function (key, value) {
                                        if (value.suggestion) {
                                            matches = true;
                                            $suggestions += '<li><a href="' + value.url + '">' + value.suggestion + '</a></li>';
                                        } else {
                                            matches = false;
                                            $suggestionBox.css('display', 'none');
                                        }

                                        if (key === (settings.results - 1)) {
                                            return false;
                                        }
                                    });

                                    $suggestions += '</ul>';
                                    // Check for focus before showing suggestion box. User could have clicked outside before request finished.
                                    if (document.activeElement.id == 'search') {
                                        if (matches) {
                                            $suggestionBox.html($suggestions);
                                            var searchBoxWidth = (
                                                $searchBox.width() +
                                                getCssValue($searchBox, 'border-left') +
                                                getCssValue($searchBox, 'border-right') +
                                                getCssValue($searchBox, 'padding-left') +
                                                getCssValue($searchBox, 'padding-right') -
                                                getCssValue($suggestionBox, 'border-left') -
                                                getCssValue($suggestionBox, 'border-right') -
                                                getCssValue($suggestionBox, 'padding-left') -
                                                getCssValue($suggestionBox, 'padding-right')
                                            );

                                            if (settings.menuWidth == 'auto') {
                                                $suggestionBox.css({
                                                    'min-width': searchBoxWidth
                                                });
                                            } else if (settings.menuWidth == 'constrain') {
                                                $suggestionBox.css({
                                                    'width': searchBoxWidth
                                                });
                                            }

                                            if (settings.fadeIn) {
                                                $suggestionBox.fadeIn();
                                            } else {
                                                $suggestionBox.css('display', 'block');
                                            }
                                        }
                                    }
                                }else{
                                    if (settings.fadeOut) {
                                        $suggestionBox.fadeOut();
                                    } else {
                                        $suggestionBox.css('display', 'none');
                                    }
                                }
                            },
                            error: function (e) {
                                settings.ajaxError(e);
                            }
                        });
                    }, settings.delay);
                }
            },
            'keydown': function (e) {

                // Ignore navigation key presses mouse is hovering over a suggestion
                if ($suggestionBox.css('display') !== 'none') {
                    // down arrow
                    if (e.which == DOWN_ARROW_KEY) {
                        e.preventDefault();
                        var listSize = $suggestionBox.find('li').size();
                        if (selectedLi === (listSize - 1)) {
                            unselect(selectedLi);
                            resetSelection();

                        } else {
                            unselect(selectedLi);
                            selectedLi++;
                            select(selectedLi);
                        }
                    }

                    // Up arrow
                    if (e.which == UP_ARROW_KEY) {
                        e.preventDefault();
                        if (selectedLi > 0) {
                            unselect(selectedLi);
                            selectedLi--;
                            select(selectedLi);
                        } else if (selectedLi == -1) {
                            unselect(selectedLi);
                            selectedLi = $suggestionBox.find('li').size() - 1;
                            select(selectedLi);
                        } else {
                            unselect(0);
                            resetSelection();
                        }

                    }

                    // Enter key
                    if (e.which === ENTER_KEY && selectedHref !== '#') {
                        e.preventDefault();
                        window.location = selectedHref;

                    }

                    // Escape key
                    if (e.which == ESCAPE_KEY) {
                        $suggestionBox.css('display', 'none');
                        resetSelection();
                    }
                }
            }
        });

        // Reset the position of the suggestion box if the window is re-sized
        $(window).resize(function () {
            setSuggestionBoxPosition();
        });


        var select = function (position) {
            selectedHref = $suggestionBox.find("li:eq(" + position + ") a").attr('href');
            $suggestionBox.find("li:eq(" + position + ")").addClass('selected');
        };

        var unselect = function (position) {
            $suggestionBox.find("li:eq(" + position + ")").removeClass('selected');
        };

        var resetSelection = function () {
            selectedHref = '#';
            selectedLi = -1;
        };

        function setSuggestionBoxPosition() {
            var borders = getCssValue($searchBox, 'border-bottom') + getCssValue($searchBox, 'border-top');
            var padding = getCssValue($searchBox, 'padding-bottom') + getCssValue($searchBox, 'padding-top');

            $suggestionBox.css({
                'position': 'absolute',
                'left': ($searchBox.offset().left) + settings.leftOffset,
                'top': ($searchBox.offset().top) + ($searchBox.height() + borders + padding + settings.topOffset)
            });
        }

        function getCssValue(element, name) {
            return topBorders = parseInt(element.css(name).replace('px', ''));
        }

        return this;
    };
}(jQuery));