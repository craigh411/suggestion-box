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
                    adjustBorderRadius: true,
                    ajaxError: function (e) {
                        console.log(e);
                    },
                    ajaxSuccess: function (data) {
                    },
                    onClick: function (e) {
                        goToSelection();
                        hideSuggestionBox();
                        $searchBox.val('');
                    },
                    onShow: function () {
                    },
                    onHide: function () {
                    },
                    paramName: 'search',
                    customValues: [],
                    scrollable: false
                },
                options);

            var $suggestionBox = null;
            var randId = null;

            (function init() {
                // Inject the suggestion box into the body of the web page
                randId = 'suggestion-box-' + Math.floor(Math.random() * 10000000);
                // Inject the suggestion box into the body of the web page
                $('body').append('<div id="' + randId + '" class="suggestion-box"></div>');

                $suggestionBox = $('#' + randId);
                setSuggestionBoxPosition();

                if (settings.height) {
                    $suggestionBox.css('max-height', settings.height);
                }
                if (settings.scrollable) {
                    $suggestionBox.css('overflow', 'auto');
                }

                // Turn off autocomplete
                $searchBox.attr('autocomplete', 'off');
            })();


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
            // Whether or not the scroll action was done pragmatically
            var autoScrolled = false;
            // create a blank object for our request
            var request = {};
            var jsonData = {};

            // The value of the input when ajax was called
            var ajaxCalledVal;
            var searchBoxBorderRadius = {
                bottomLeft: $searchBox.css('border-bottom-left-radius'),
                bottomRight: $searchBox.css('border-bottom-right-radius')
            };

            function doClick(e) {
                settings.onClick(e);
            }

            function isSuggestion(e) {
                return $(e.target).parents('a').length > 0 || e.target.nodeName === 'A';
            }


            $suggestionBox.on({
                mousemove: function (e) {
                    if (isSuggestion(e) && !autoScrolled) {
                        unselect(selectedLi);
                        selectedLi = getSelectionMouseIsOver(e);
                        select(selectedLi);
                    }

                    mouseHover = true;
                    autoScrolled = false;
                },
                mouseout: function (e) {
                    if (isSuggestion(e) && !autoScrolled) {
                        unselect(selectedLi);
                        resetSelection();
                    } else if ($(':focus').attr('id') !== $searchBox.attr('id')) {
                        $searchBox.focus();
                    }

                    mouseHover = false;
                },
                click: function (e) {
                    if (isSuggestion(e)) {
                        e.preventDefault();
                        doClick(e);
                    }
                }
            });

            $searchBox.on({
                blur: function () {
                    active = false;
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
                    if (e.which !== UP_ARROW_KEY && e.which !== DOWN_ARROW_KEY && e.which !== ESCAPE_KEY && e.which !== ENTER_KEY) {
                        if (settings.url) {
                            resetSelection();

                            if (timer) {
                                clearTimeout(timer);
                            }
                        }

                        if (settings.url) {
                            // set the request to be sent sent as the data parameter
                            request[settings.paramName] = $searchBox.val();
                            timer = setTimeout(function () {
                                getSuggestions(settings.url)
                            }, settings.delay);
                        }
                        if (settings.filter) {
                            showSuggestions();
                        }
                    }
                },
                keydown: function (e) {
                    if ($suggestionBox.css('display') !== 'none') {
                        if (e.which == DOWN_ARROW_KEY) {
                            e.preventDefault();
                            moveDown(true);
                        }
                        if (e.which == UP_ARROW_KEY) {
                            e.preventDefault();
                            moveUp(true);
                        }
                        if (e.which === ENTER_KEY && selectedLi > -1) {
                            e.preventDefault();
                            $suggestionBox.find('.selected a').click();
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
            function select(position, scroll) {
                selectedHref = $suggestionBox.find("li:eq(" + position + ") a").attr('href');
                $suggestionBox.find("li:eq(" + position + ")").addClass('selected');

                if (scroll) {
                    doScroll(position);
                }
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
                // remove all selected on reset
                $suggestionBox.find('li').removeClass('selected');
            }


            function doScroll(to) {
                autoScrolled = true;

                if(to > -1) {
                     var pos = $suggestionBox.find('li:eq(' + to + ')').position().top -
                        $suggestionBox.find('li:eq(0)').position().top;
                }

                // find scroll position at to and set scroll bars to it
                var scrollTo = (to > -1) ? pos : 0;
                $suggestionBox.scrollTop(scrollTo);
            }

            /**
             * Moves the selection down to the next suggestion
             */
            function moveDown(scroll) {
                var listSize = $suggestionBox.find('li').size();

                if (selectedLi === (listSize - 1)) {
                    unselect(selectedLi);
                    resetSelection();
                } else {
                    unselect(selectedLi);
                    selectedLi++;
                    select(selectedLi);
                }

                if (scroll) {
                    doScroll(selectedLi);
                }
            }

            /**
             * Moves the selection up to the previous suggestions
             */
            function moveUp(scroll) {
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

                if (scroll) {
                    doScroll(selectedLi);
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
                ajaxCalledVal = $searchBox.val();
                $.ajax({
                    url: url,
                    data: request,
                    dataType: 'json',
                    success: function (data) {

                        var selectionHasChanged = true;
                        var currentLi = selectedLi;

                        if (jsonData.results && data.results) {
                            selectionHasChanged = (JSON.stringify(jsonData.results[selectedLi]) !== JSON.stringify(data.results[selectedLi]))
                        }

                        setJsonData(data);
                        showSuggestions();

                        // Keep selection if no new information has been entered since ajax was called and the selection is the same.
                        // This prevents the flick back effect when menu has the same data but the ajax hasn't finished.
                        if (currentLi > -1 && ($searchBox.val() === ajaxCalledVal) && !selectionHasChanged) {
                            selectedLi = currentLi;
                            select(selectedLi);
                        }

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
                var $parentLi = $(e.target).parents('li');
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
                $suggestionBox.scrollTop(0);

                if (settings.fadeOut) {
                    $suggestionBox.fadeOut();
                } else {
                    $suggestionBox.css('display', 'none');
                }
                resetSelection();

                if (settings.adjustBorderRadius) {
                    $searchBox.css('border-bottom-left-radius', searchBoxBorderRadius.bottomLeft);
                    $searchBox.css('border-bottom-right-radius', searchBoxBorderRadius.bottomRight);
                }

                settings.onHide()
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

                if (settings.adjustBorderRadius) {
                    $searchBox.css('border-bottom-left-radius', 0);
                    $searchBox.css('border-bottom-right-radius', 0);
                }

                settings.onShow();

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

            function createSuggestionsList(data) {
                var $suggestions = '<div class="suggestion-header">' + settings.heading + '</div> ' +
                    '<ul class="suggestion-box-list">';

                $.each(data.results, function (key, value) {
                    if (value.suggestion && value.url) {
                        matches = true;
                        var attr = "";
                        if (value.attr) {
                            $.each(value.attr, function (key, value) {
                                var keys = Object.keys(value);
                                for (var i = 0; i < keys.length; i++) {
                                    attr += keys[i] + '="' + value[keys[i]] + '" '
                                }
                            });
                        }
                        $suggestions += '<li><a href="' + value.url + '" ' + attr + '>' + value.suggestion;

                        for (var i = 0; i < settings.customValues.length; i++) {
                            var custom = value[settings.customValues[i]];
                            if (custom) {
                                $suggestions += value[settings.customValues[i]];
                            }

                        }

                        $suggestions += '</a></li>';
                    } else {
                        return false;
                    }

                    // break when maximum results have been found
                    if (key === (settings.results - 1)) {
                        return false;
                    }
                });
                $suggestions += '</ul>';

                return $suggestions;
            }

            /**
             * Shows the suggestion-box suggestions if they are available based on the data passed in
             */
            function showSuggestions(forceShow) {
                resetSelection();

                matches = false;

                var data = (settings.filter) ? filterResults($searchBox.val()) : jsonData;

                if (data) {
                    if (data.results) {
                        var $suggestions = createSuggestionsList(data);
                    }
                }

                // Check for focus before showing suggestion box. User could have clicked outside before request finished.
                if (active || forceShow) {
                    if (matches) {
                        $suggestionBox.html($suggestions);
                        setSuggestionBoxWidth();
                        showSuggestionBox();
                    } else if (forceShow) {
                        if (settings.showNoSuggestionsMessage) {
                            $suggestionBox.html('<div class="no-suggestions">' + settings.noSuggestionsMessage + '</div>');
                        }
                        setSuggestionBoxWidth();
                        showSuggestionBox();

                    } else if (settings.showNoSuggestionsMessage && $searchBox.val().length > 0) {
                        setSuggestionBoxWidth();
                        showSuggestionBox();

                        $suggestionBox.html('<div class="no-suggestions">' + settings.noSuggestionsMessage + '</div>');
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

                if (settings.sort && jsonData.results) {
                    jsonData.results.sort(settings.sort);
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

                value = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
                show: function (force) {
                    force = (force) ? force : false;
                    showSuggestions(force);
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
                onClick: function (action) {
                    settings.onClick = action;
                    return this;
                },
                getId: function (withHash) {
                    return (withHash) ? '#' + randId : randId;
                },
                reservedKey: function (e) {
                    var key = e.which;
                    return key === ENTER_KEY || key === ESCAPE_KEY || key === UP_ARROW_KEY || key === DOWN_ARROW_KEY
                },
                destroy: function () {
                    $searchBox.unbind(this);
                    $suggestionBox.remove();
                    return null;
                }
            };
        };
    }(jQuery)
);