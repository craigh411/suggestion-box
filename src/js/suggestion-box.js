(function ($) {

        $.fn.suggestionBox = function (options) {

            // Get the bound dom element, we don't want to use id's as MVVM frameworks don't use them (i.e. AngularJS, KnockoutJS etc)
            var domElement = $(this).get()[0];

            var args = $.makeArray(arguments);
            var suggestionBox = $.data(domElement, 'suggestionBox');

            if (suggestionBox) {
                suggestionBox.set(args[0], args[1]);
            } else {
                suggestionBox = new SuggestionBox(options, this);
                $.data(domElement, 'suggestionBox', suggestionBox);
            }
            return suggestionBox;
        };

        function SuggestionBox(options, context) {
            var self = context;

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
                    filter: true,
                    filterPattern: "({INPUT})",
                    highlightMatch: false,
                    adjustBorderRadius: true,
                    ajaxError: function (e) {
                        console.log(e);
                    },
                    ajaxSuccess: function (data) {
                    },
                    onClick: function () {
                        goToSelection();
                        hideSuggestionBox();
                        self.val('');
                    },
                    onShow: function () {
                    },
                    onHide: function () {
                    },
                    paramName: 'search',
                    customData: [],
                    scrollable: false
                },
                options);


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

            var searchBoxBorderRadius,
                $suggestionBox = null,
                randId;

            /**
             * Initialise the plugin
             */
            (function _init() {
                // Inject the suggestion box into the body of the web page
                randId = 'suggestion-box-' + Math.floor(Math.random() * 10000000);
                // Inject the suggestion box into the body of the web page
                $('body').append('<div id="' + randId + '" class="suggestion-box"></div>');

                searchBoxBorderRadius = {
                    bottomLeft: self.css('border-bottom-left-radius'),
                    bottomRight: self.css('border-bottom-right-radius')
                };

                $suggestionBox = $('#' + randId);

                // Turn off autocomplete
                self.attr('autocomplete', 'off');

                setup();
            })();

            function setup() {
                setSuggestionBoxPosition();

                if (settings.height) {
                    $suggestionBox.css('max-height', settings.height);
                }
                if (settings.scrollable) {
                    $suggestionBox.css('overflow', 'auto');
                }

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
                    } else if ($(':focus').attr('id') !== self.attr('id')) {
                        // We're out of the suggestion box so re-focus on search
                        self.focus();
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

            self.on({
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

                            // set the request to be sent sent as the data parameter
                            request[settings.paramName] = self.val();
                            timer = setTimeout(function () {
                                getSuggestions(settings.url)
                            }, settings.delay);
                        }

                        // If filter set to true, call showSuggestions() - it will filter the results for us
                        if (settings.filter) {
                            showSuggestions();
                        }
                    }
                },
                keydown: function (e) {

                    if (e.which == DOWN_ARROW_KEY) {
                        e.preventDefault();
                        moveDown(true);
                    }

                    if ($suggestionBox.css('display') !== 'none') {
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
                        self.keyup();
                    }, 200);
                }
            });

            // Reset the position of the suggestion box if the window is re-sized
            $(window).resize(function () {
                setSuggestionBoxPosition();
            });

            /**
             * Performs the click action, this can be called for any event you want to recreate a click action for.
             * @param e
             */
            function doClick(e) {
                settings.onClick(e);
            }

            /**
             * Is the given event made on a suggestion?
             * @param e
             * @returns {boolean}
             */
            function isSuggestion(e) {
                return $(e.target).parents('a').length > 0 || e.target.nodeName === 'A';
            }

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


            /**
             * Scrolls the suggestion box to the given position
             * @param to
             */
            function doScroll(to) {
                autoScrolled = true;

                if (to > -1) {
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

                if ($suggestionBox.css('display') === 'none') {
                    showSuggestions();
                } else if (selectedLi === (listSize - 1)) {
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
                ajaxCalledVal = self.val();
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
                        if (currentLi > -1 && (self.val() === ajaxCalledVal) && !selectionHasChanged) {
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
                var borders = getCssValue(self, 'border-bottom-width') + getCssValue(self, 'border-top-width');
                var padding = getCssValue(self, 'padding-bottom') + getCssValue(self, 'padding-top');

                $suggestionBox.css({
                    'position': 'absolute',
                    'left': (self.offset().left) + settings.leftOffset,
                    'top': (self.offset().top) + (self.height() + borders + padding + settings.topOffset)
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
                    self.css('border-bottom-left-radius', searchBoxBorderRadius.bottomLeft);
                    self.css('border-bottom-right-radius', searchBoxBorderRadius.bottomRight);
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
                    self.css('border-bottom-left-radius', 0);
                    self.css('border-bottom-right-radius', 0);
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
                    self.width() +
                    getCssValue(self, 'border-left-width') +
                    getCssValue(self, 'border-right-width') +
                    getCssValue(self, 'padding-left') +
                    getCssValue(self, 'padding-right')
                );
            }

            /**
             * Builds the attributes from the JSON
             * @param value
             * @param attr
             * @returns {*}
             */
            function createAttributes(value, attr) {
                $.each(value.attr, function (key, value) {
                    var keys = Object.keys(value);
                    for (var i = 0; i < keys.length; i++) {
                        attr += keys[i] + '="' + value[keys[i]] + '" '
                    }
                });
                return attr;
            }

            /**
             * Adds any given custom values from the JSON file
             * @param value
             * @param $suggestions
             * @returns {*}
             */
            function createCustomValues(value, $suggestions) {
                for (var i = 0; i < settings.customData.length; i++) {
                    var custom = value[settings.customData[i]];
                    if (custom) {
                        $suggestions += value[settings.customData[i]];
                    }
                }

                return $suggestions;
            }

            /**
             * Builds the suggestions list from the JSON
             * @param data
             * @returns {string}
             */
            function createSuggestionsList(data) {

                var filterPattern = settings.filterPattern.replace("{INPUT}", self.val());

                var $suggestions = '<div class="suggestion-header">' + settings.heading + '</div> ' +
                    '<ul class="suggestion-box-list">';

                $.each(data.results, function (key, value) {
                    if (value.suggestion && value.url) {
                        matches = true;
                        var attr = "";
                        if (value.attr) {
                            attr = createAttributes(value, attr);
                        }
                        $suggestions += '<li><a href="' + value.url + '" ' + attr + '>';
                        if(value.image){
                            $suggestions += '<img src="'+value.image+'" />';
                        }

                        $suggestions += (settings.highlightMatch) ? (value.suggestion).replace(new RegExp(filterPattern,'gi'),'<b>$&</b>') : value.suggestion;

                        if (settings.customData.length > 0) {
                            $suggestions = createCustomValues(value, $suggestions);
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

            function getNoSuggestionMarkup() {
                $suggestionBox.html('<div class="no-suggestions">' + settings.noSuggestionsMessage + '</div>');
            }

            /**
             * Shows the suggestion-box suggestions if they are available based on the data passed in
             */
            function showSuggestions(forceShow) {
                resetSelection();

                matches = false;

                var data = (settings.filter) ? filterResults(self.val()) : jsonData;

                if (data) {
                    if (data.results) {
                        var $suggestions = createSuggestionsList(data);
                    }
                }

                // Check for focus before showing suggestion box. User could have clicked outside before request finished.
                if (active || forceShow) {
                    if (matches && (self.val().length > 0 || forceShow)) {
                        // we have some suggestions, so show them
                        $suggestionBox.html($suggestions);
                        setSuggestionBoxWidth();
                        showSuggestionBox();
                    } else if (forceShow) {
                        // We don't have any suggestions, but we are forcing display, show it regardless.
                        if (settings.showNoSuggestionsMessage) {
                            getNoSuggestionMarkup();
                        }
                        setSuggestionBoxWidth();
                        showSuggestionBox();
                    } else if (settings.showNoSuggestionsMessage && self.val().length > 0) {
                        // We don't have any suggestions for input and want to display no suggestion message
                        setSuggestionBoxWidth();
                        showSuggestionBox();
                        getNoSuggestionMarkup();
                    } else {
                        // Nope,no matches, hide the suggestion box
                        hideSuggestionBox();
                    }
                } else {
                    // The search box no longer has focus, hide the suggestion box
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
                    // we weren't passed anything to filter against, return empty object
                    return jsonData;
                }
                if (jsonData) {
                    if (jsonData.results) {
                        // We have JSON data and user input, so apply the filter
                        var regex = new RegExp(filterPattern, "i");
                        data = $.grep(jsonData.results, function (name) {
                            return regex.test(name.suggestion);
                        });
                    }
                }
                // Sort the results, if sort function passed
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
                    select(position, settings.scrollable);
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
                getId: function (withHash) {
                    return (withHash) ? '#' + randId : randId;
                },
                reservedKey: function (e) {
                    var key = e.which;
                    return key === ENTER_KEY || key === ESCAPE_KEY || key === UP_ARROW_KEY || key === DOWN_ARROW_KEY
                },
                getContext: function () {
                    return self;
                },
                getDomElement: function () {
                    return $(self).get()[0];
                },
                destroy: function () {
                    self.unbind(this);
                    $suggestionBox.remove();
                    return null;
                }
                ,
                set: function (option, value) {
                    settings[option] = value;
                    setup();
                },
                clearSuggestions: function(){
                    setJsonData(JSON.stringify({}));
                }
            };
        }
    }(jQuery)
);