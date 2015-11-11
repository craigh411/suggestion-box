(function ($) {

    $.fn.suggestionBox = function (options) {

        var $searchBox = this;

        var settings = $.extend({
                // default settings.
                topOffset: 0,
                leftOffset: 0,
                widthAdjustment: 0,
                delay: 400, // in ms
                heading: 'Suggestions',
                results: 10,
                fadeIn: true,
                fadeOut: false,
                menuWidth: 'auto',
                showNoSuggestionsMessage: false,
                noSuggestionsMessage: 'No Suggestions Found',
                filter: false,
                filterPattern: "({INPUT})",
                ajaxError: function (e) {
                    console.log(e);
                },
                ajaxSuccess: function (data) {
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
        var ENTER_KEY = 13;
        var UP_ARROW_KEY = 38;
        var DOWN_ARROW_KEY = 40;
        var ESCAPE_KEY = 27;

        // Default values for selected list item
        var selectedLi = -1;
        var selectedHref = '#';

        // Is the mouse hovering over the suggestion box?
        var mouseHover = false;
        // Timer for only making ajax calls when the user stops typing
        var timer = null;
        // Did we get any suggestions?
        var matches = false;
        // Is the search box active (does it have focus)
        var active = false;
        // create a blank object for our request
        var request = {};
        var jsonData = {};


        $suggestionBox.on({
            mousemove: function (e) {
                if (e.target.nodeName === 'A') {
                    unselect(selectedLi);
                    selectedLi = getSelectionMouseIsOver(e);
                    select(selectedLi);
                    mouseHover = true;
                }
            },
            mouseout: function (e) {
                if (e.target.nodeName === 'A') {
                    mouseHover = false;
                    unselect(selectedLi);
                    resetSelection();
                }
            }
        });

        $searchBox.on({
            blur: function () {
                active = false;
                // Only close the menu if we are not clicking a link
                if (!mouseHover) {
                    hideSuggestionBox();
                }
            },
            focus: function () {
                active = true;
                if ($(this).val()) {
                    showSuggestions(jsonData);
                }
            },
            keyup: function (e) {
                // Ignore the navigation keys. We don't want to fire ajax calls when navigating
                if (e.which !== UP_ARROW_KEY && e.which !== DOWN_ARROW_KEY && e.which !== ESCAPE_KEY) {
                    if (settings.url) {
                        if (timer) {
                            clearTimeout(timer);
                        }
                        // set the request to be sent sent as the data parameter
                        request[settings.paramName] = $searchBox.val();
                        timer = setTimeout(function () {
                            getSuggestions(settings.url)
                        }, settings.delay);
                    } else if (settings.filter) {
                        showSuggestions();
                    }
                }
            },
            keydown: function (e) {
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
                        goToSelection();
                    }
                    if (e.which == ESCAPE_KEY) {
                        e.preventDefault();
                        hideSuggestionBox();
                    }
                }
            },
            paste: function () {
                // Simulate keyup after 200ms otherwise the value of the search box will not be available
                setTimeout(function () {
                    $searchBox.keyup();
                }, 200);
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
         * Moves the selection down to the next suggestion
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
        function goToSelection() {
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
                    setJsonData(data);
                    showSuggestions();
                    settings.ajaxSuccess(data);
                },
                error: function (e) {
                    settings.ajaxError(e);
                }
            });
        }

        /**
         * Returns the index of the list item the mouse is currently hovering over
         * @param e
         * @returns {Number}
         */
        function getSelectionMouseIsOver(e) {
            var $parentLi = $(e.target).parent('li');
            return $parentLi.parent().children().index($parentLi);
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
            var searchBoxWidth = getSearchBoxWidth() + settings.widthAdjustment;
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
                getCssValue($searchBox, 'border-left-width') +
                getCssValue($searchBox, 'border-right-width') +
                getCssValue($searchBox, 'padding-left') +
                getCssValue($searchBox, 'padding-right')
            );
        }

        /**
         * Shows the suggestion-box suggestions if they are available based on the data passed in
         */
        function showSuggestions() {
            resetSelection();

            matches = false;

            var data = (settings.filter) ? filterResults($searchBox.val()) : jsonData;
            if (data) {
                if (data.results) {
                    var $suggestions = '<div id="suggestion-header">' + settings.heading + '</div> ' +
                        '<ul id="suggestion-box-list">';

                    $.each(data.results, function (key, value) {
                        if (value.suggestion && value.url) {
                            matches = true;
                            var attr = "";
                            if (value.attr) {
                                $.each(value.attr, function (key, value) {
                                    attr += value.name + '="' + value.value + '" ';
                                });
                            }
                            $suggestions += '<li><a href="' + value.url + '" ' + attr + '>' + value.suggestion + '</a></li>';
                        } else {
                            return false;
                        }

                        // break when maximum results have been found
                        if (key === (settings.results - 1)) {
                            return false;
                        }
                    });
                    $suggestions += '</ul>';
                }
            }

            // Check for focus before showing suggestion box. User could have clicked outside before request finished.
            if (active) {
                if (matches) {
                    $suggestionBox.html($suggestions);
                    setSuggestionBoxWidth();
                    showSuggestionBox();
                } else if (settings.showNoSuggestionsMessage && $searchBox.val().length > 0) {
                    setSuggestionBoxWidth();
                    showSuggestionBox();
                    $suggestionBox.html('<div id="no-suggestions">' + settings.noSuggestionsMessage + '</div>');
                } else {
                    hideSuggestionBox();
                }
            } else {
                hideSuggestionBox();
            }
        }

        /**
         * Sets the current JSON data ready for display
         * @param json
         */
        function setJsonData(json) {
            if (json) {
                jsonData = (json instanceof Object) ? json : $.parseJSON(json);
            } else {
                jsonData = {};
            }
        }

        /**
         * Loads JSON from the given url
         * @param url
         */
        function loadJson(url) {
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    setJsonData(data);
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }

        /**
         * Filters the JSON based on the user input
         * @param value
         * @returns {Object}
         */
        function filterResults(value) {
            var data;

            filterPattern = settings.filterPattern.replace("{INPUT}", value);
            if (!value) {
                return {};
            }
            if (jsonData) {
                if (jsonData.results) {

                    var regex = new RegExp(filterPattern, "i");

                    data = $.grep(jsonData.results, function (name) {
                        return regex.test(name.suggestion);
                    });
                }
            }

            if (settings.sort) {
                data.sort(settings.sort);
            }

            var json = JSON.stringify({"results": data});

            return $.parseJSON(json);
        }

        // returned methods
        return {
            getSuggestions: function (url) {
                getSuggestions(url);
                return this;
            },
            addSuggestions: function (json) {
                setJsonData(json);
                return this;
            },
            loadSuggestions: function (url) {
                loadJson(url);
                return this;
            },
            getJson: function () {
                return JSON.stringify(jsonData);
            },
            moveUp: function () {
                moveUp();
                return this;
            },
            moveDown: function () {
                moveDown();
                return this;
            },
            selectedUrl: function () {
                return selectedHref;
            },
            selectedSuggestion: function () {
                return $suggestionBox.find('li:eq(' + selectedLi + ')').text();
            },
            position: function () {
                return selectedLi;
            },
            select: function (position) {
                unselect(selectedLi);
                selectedLi = position;
                select(position);
                return this;
            },
            reset: function () {
                unselect(selectedLi);
                resetSelection();
                return this;
            },
            show: function () {
                $searchBox.focus();
                showSuggestions();
                return this;
            },
            hide: function () {
                hideSuggestionBox();
                return this;
            },
            url: function (url) {
                settings.url = url;
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
            delay: function (ms) {
                settings.delay = ms;
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
            filter: function (filter) {
                settings.filter = filter;
                return this;
            },
            filterPattern: function (pattern) {
                settings.filterPattern = pattern;
                return this;
            },
            sort: function (sortFunc) {
                settings.sort = sortFunc;
                return this;
            },
            destroy: function () {
                $searchBox.unbind(this);
                $suggestionBox.remove();
                return null;
            }
        };
    };
}(jQuery));