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
                fadeOut: false,
                menuWidth: 'auto',
                ajaxError: function (e) {
                    console.log(e);
                },
                ajaxSuccess: function (data) {
                    showSuggestions(data);
                    console.log(data);
                },
                paramName: 'search'
            },
            options);


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
        var response;

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


        /**
         * Moves the selection down to the next suggestion
         * @param e
         */
        function moveDown() {
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

        /**
         * Moves the selection up to the previous suggestions
         * @param e
         */
        function moveUp() {
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

        /**
         * Redirects the user to the selected suggestion location
         */
        function goTo() {
            window.location = selectedHref;
        }

        /**
         * Makes an ajax call to the given url
         * @param url
         */
        function getSuggestions(url) {
            $.ajax({
                url: url,
                data: request,
                dataType: 'json',
                success: function (data) {
                    response = data;
                    settings.ajaxSuccess(data);
                },
                error: function (e) {
                    settings.ajaxError(e);
                }
            });
        }

        $searchBox.on({
            'blur': function () {
                // Only close the menu if we are not clicking a link
                if (!mouseHover) {
                    hideSuggestionBox();
                }
            },
            'focus': function () {
                if ($(this).val()) {
                    showSuggestionBox();
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
                    timer = setTimeout(getSuggestions(settings.url), settings.delay);
                }
            },
            'keydown': function (e) {
                if ($suggestionBox.css('display') !== 'none') {
                    if (e.which == DOWN_ARROW_KEY) {
                        e.preventDefault();
                        moveDown();
                    }
                    if (e.which == UP_ARROW_KEY) {
                        e.preventDefault();
                        moveUp();
                    }
                    if (e.which === ENTER_KEY && selectedHref !== '#') {
                        e.preventDefault();
                        goTo();
                    }
                    if (e.which == ESCAPE_KEY) {
                        e.preventDefault();
                        hideSuggestionBox();
                    }
                }
            }
        });

        // Reset the position of the suggestion box if the window is re-sized
        $(window).resize(function () {
            setSuggestionBoxPosition();
        });


        /**
         * Selects the suggestion at the given position
         * @param position
         */
        function select(position) {
            selectedHref = $suggestionBox.find("li:eq(" + position + ") a").attr('href');
            $suggestionBox.find("li:eq(" + position + ")").addClass('selected');
        }

        /**
         * Unselects the suggestion at the given position
         * @param position
         */
        function unselect(position) {
            $suggestionBox.find("li:eq(" + position + ")").removeClass('selected');
        }

        /**
         * Resets any selected suggestions
         */
        function resetSelection() {
            selectedHref = '#';
            selectedLi = -1;
        }

        /**
         * Sets the position of the suggestion box
         */
        function setSuggestionBoxPosition() {
            var borders = getCssValue($searchBox, 'border-bottom-width') + getCssValue($searchBox, 'border-top-width');
            var padding = getCssValue($searchBox, 'padding-bottom') + getCssValue($searchBox, 'padding-top');

            $suggestionBox.css({
                'position': 'absolute',
                'left': ($searchBox.offset().left) + settings.leftOffset,
                'top': ($searchBox.offset().top) + ($searchBox.height() + borders + padding + settings.topOffset)
            });
        }

        /**
         * Gets the css integer value for the given element.
         * @param element
         * @param name
         * @returns {Number}
         */
        function getCssValue(element, name) {
            return parseInt(element.css(name).replace('px', ''));
        }

        /**
         * Hides the suggestion box
         */
        function hideSuggestionBox() {
            if (settings.fadeOut) {
                $suggestionBox.fadeOut();
            } else {
                $suggestionBox.css('display', 'none');
            }
            resetSelection();
        }


        /**
         * Displays the suggestion-box
         */
        function showSuggestionBox() {
            if (settings.fadeIn) {
                $suggestionBox.fadeIn();
            } else {
                $suggestionBox.css('display', 'block');
            }
        }

        /**
         * Sets the width of the suggestion box
         */
        function setSuggestionBoxWidth() {
            var searchBoxWidth = getSearchBoxWidth();

            if (settings.menuWidth == 'auto') {
                $suggestionBox.css({
                    'min-width': searchBoxWidth
                });
            } else if (settings.menuWidth == 'constrain') {
                $suggestionBox.css({
                    'width': searchBoxWidth
                });
            }
        }

        /**
         * Returns the width of the search box
         * @returns {number}
         */
        function getSearchBoxWidth() {
            return (
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
        }

        /**
         * Shows the suggestion-box suggestions if they are available based on the data passed in
         * @param data
         */
        function showSuggestions(data) {
            resetSelection();
            response = data;

            if (data.results) {
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

                        setSuggestionBoxWidth();
                        showSuggestionBox();
                    }
                } else {
                    hideSuggestionBox();
                }
            }
        }

        // returned methods
        return {
            getSuggestions: function (url) {
                getSuggestions(url);
                return this;
            },
            showSuggestions: function (suggestions) {
                showSuggestions(suggestions);
                return this;
            },
            moveUp: function () {
                moveUp();
                return this;
            },
            moveDown: function () {
                moveDown();
                return this;
            },
            selectedLink: function () {
                return selectedHref;
            },
            selectedSuggestion: function () {
                return;
            },
            position: function () {
                return selectedLi;
            },
            response: function () {
                return response;
            },
            select: function (position) {
                select(position);
                return this;
            },
            unselect: function (position) {
                unselect(position);
                return this;
            },
            reset: function () {
                unselect(selectedLi);
                resetSelection();
                return this;
            },
            hide: function () {
                hideSuggestionBox();
                return this;
            },
            show: function () {
                showSuggestionBox();
                return this;
            },
            fadeIn: function (fadeIn) {
                settings.fadeIn = fadeIn;
                return this;
            },
            fadeOut: function (fadeOut) {
                settings.fadeOut = fadeOut;
                return this;
            },
            delay: function (delay) {
                settings.delay = delay;
                return this;
            },
            heading: function (heading) {
                settings.heading = heading;
                return this;
            },
            results: function (results) {
                settings.results = results;
                return this;
            },
            ajaxError: function (ajaxError) {
                settings.ajaxError = ajaxError;
                return this;
            },
            ajaxSuccess: function (ajaxSuccess) {
                settings.ajaxSuccess = ajaxSuccess;
                return this;
            },
            destroy: function () {
            }
        };
    };
}(jQuery));