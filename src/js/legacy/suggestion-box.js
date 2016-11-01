(function($) {

    $.fn.suggestionBox = function(options) {

        // Get the bound dom element
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

        options = $.extend({
            topOffset: 0,
            leftOffset: 0,
            zIndex: 10000,
            hideOnExactMatch: false,
            isSelectionBox: false,
            loadImage: null,
            widthAdjustment: 0,
            delay: 250, // in ms
            heading: 'Suggestions',
            results: 10,
            fadeIn: true,
            fadeOut: false,
            menuWidth: 'auto',
            showNoSuggestionsMessage: false,
            noSuggestionsMessage: 'No Suggestions Found',
            filter: true, // remove this, filtering will now always take place!
            filterPattern: "({INPUT})",
            highlightMatch: false,
            adjustBorderRadius: true,
            ajaxError: function(e) {
                console.log(e);
            },
            ajaxSuccess: function(data) {},
            onClick: function() {
                goToSelection();
                hideSuggestionBox();
                context.val('');
            },
            onShow: function() {},
            onHide: function() {},
            paramName: 'search',
            customData: [],
            scrollable: false,
            noConflict: false
        }, options);

        // Initially set the return context to context
        var self = context;

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


        // Variables for use with typeahead
        var exactMatch = false;
        var hideOnExactMatch = false;

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
            $suggestionBox = $('<div id="' + randId + '" class="suggestion-box"></div>').appendTo('body');

            searchBoxBorderRadius = {
                bottomLeft: context.css('border-bottom-left-radius'),
                bottomRight: context.css('border-bottom-right-radius')
            };

            // Turn off autocomplete
            context.attr('autocomplete', 'off');

            // Bind event handlers
            context.on('blur', blurEvent);
            context.on('keyup', keyupEvents);
            context.on('focus', focusEvents);
            context.on('keydown', keydownEvents);
            context.on('paste', pasteEvents);

            $suggestionBox.on('mousemove', mousemoveEvents);
            $suggestionBox.on('mouseout', mouseoutEvents);
            $suggestionBox.on('click', clickEvents);

            // Reset the position of the suggestion box if the window is re-sized
            $(window).resize(function() {
                setSuggestionBoxPosition();
            });

            // If it is a selection box then override the default on click method, to put the selected value in the box.
            if (options.isSelectionBox) {
                options.onClick = function() {
                    context.val(context.selectedSuggestion());
                    context.focus();
                    hideSuggestionBox();
                };
            }

            setup();
        })();

        function setup() {
            setSuggestionBoxPosition();

            if (options.height) {
                $suggestionBox.css('max-height', options.height);
            }
            if (options.scrollable) {
                $suggestionBox.css('overflow', 'auto');
            }

            // If noConflict set the return context to this
            if (options.noConflict) {
                self = this;
            }
        }

        /**
         * Events for the mouse moving inside the suggestion box
         * @param e
         */
        function mousemoveEvents(e) {
            if (isSuggestion(e) && !autoScrolled) {
                unselect(selectedLi);
                selectedLi = getSelectionMouseIsOver(e);
                select(selectedLi);
            }

            mouseHover = true;
            autoScrolled = false;
        }

        /**
         * Events for when the mouse leaves the suggestion box
         * @param e
         */
        function mouseoutEvents(e) {
            if (isSuggestion(e) && !autoScrolled) {
                unselect(selectedLi);
                resetSelection();
            } else if ($(':focus').attr('id') !== context.attr('id')) {
                // We're out of the suggestion box so re-focus on search
                context.focus();
            }
            mouseHover = false;
        }

        /**
         * Events for clicks inside the suggestion box
         * @param e
         */
        function clickEvents(e) {
            if (isSuggestion(e)) {
               // e.preventDefault();
                doClick(e);
            }
        }

        /**
         * Events for when the search box loses focus
         */
        function blurEvent() {
            active = false;
            if (!mouseHover) {
                hideSuggestionBox();
            }
        }

        /**
         * Keyup events for the search box
         * @param e
         */
        function keyupEvents(e) {
            // Ignore the navigation keys. We don't want to fire ajax calls when navigating
            if (e.which !== UP_ARROW_KEY && e.which !== DOWN_ARROW_KEY && e.which !== ESCAPE_KEY && e.which !== ENTER_KEY) {
                var input = context.val();
                request[options.paramName] = input;
                if(input.length <= 0){
                  self.clearSuggestions();
                }

                if ((input.length <= 0 || !matches || ajaxCalledVal.length > input.length || (ajaxCalledVal.length == input.length && ajaxCalledVal != input) )) {
                    resetSelection();
                    if (timer) {
                        clearTimeout(timer);
                    }

                    // set the request to be sent sent as the data parameter
                    request[options.paramName] = input;
                    timer = setTimeout(function() {
                        getSuggestions(options.url)
                    }, options.delay);

                   // getSuggestions(options.url);
                    showSuggestions();
                }

                showSuggestions();
            }
        }

        /**
         * Events for when the search box is focused
         */
        function focusEvents() {
            setSuggestionBoxPosition();
            active = true;
            if ($(this).val()) {
                showSuggestions(jsonData);
            }
        }

        function keydownEvents(e) {
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
        }

        /**
         * Events for when text is pasted in to the search box
         */
        function pasteEvents() {
            // Simulate keyup after 200ms otherwise the value of the search box will not be available
            setTimeout(function() {
                context.keyup();
            }, 200);
        }


        /**
         * Performs the click action, this can be called for any event you want to recreate a click action for.
         * @param e
         */
        function doClick(e) {
            e.preventDefault();
            options.onClick(e);
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
         * @param scroll
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
            var listSize = $suggestionBox.find('li').length;

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
                selectedLi = $suggestionBox.find('li').length - 1;
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
            if (context.val() != "") {
                ajaxCalledVal = context.val();

                console.log('calling bg');

                if (options.loadImage != null) {
                    context.css('background', "url('"+options.loadImage+"') no-repeat 99% 50%");
                }

                $.ajax({
                    url: url,
                    data: request,
                    dataType: 'json',
                    success: function(data) {
                        var selectionHasChanged = true;
                        var currentLi = selectedLi;

                        if (jsonData.suggestions && data.suggestions) {
                            selectionHasChanged = (JSON.stringify(jsonData.suggestions[selectedLi]) !== JSON.stringify(data.suggestions[selectedLi]))
                        }

                        setJsonData(data);
                        showSuggestions();

                        // Keep selection if no new information has been entered since ajax was called and the selection is the same.
                        // This prevents the flick back effect when menu has the same data but the ajax hasn't finished.
                        if (currentLi > -1 && (context.val() === ajaxCalledVal) && !selectionHasChanged) {
                            selectedLi = currentLi;
                            select(selectedLi);
                        }

                        setTimeout(function(){
                           context.css('background', "");
                       },500);

                        options.ajaxSuccess(data);
                    },
                    error: function(e) {
                        options.ajaxError(e);
                    }
                });
            } else {
                self.clearSuggestions();
            }
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
            var borders = getCssValue(context, 'border-bottom-width') + getCssValue(context, 'border-top-width');
            var padding = getCssValue(context, 'padding-bottom') + getCssValue(context, 'padding-top');

            context.show();
            $suggestionBox.css({
                'position': 'absolute',
                'zIndex': options.zIndex,
                'left': (context.offset().left) + options.leftOffset,
                'top': (context.offset().top) + (context.height() + borders + padding + options.topOffset)
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

            if (options.fadeOut) {
                $suggestionBox.fadeOut();
            } else {
                $suggestionBox.css('display', 'none');
            }
            resetSelection();

            if (options.adjustBorderRadius) {
                context.css('border-bottom-left-radius', searchBoxBorderRadius.bottomLeft);
                context.css('border-bottom-right-radius', searchBoxBorderRadius.bottomRight);
            }

            options.onHide()
        }

        /**
         * Displays the suggestion-box
         */
        function showSuggestionBox() {
            if (options.fadeIn) {
                $suggestionBox.fadeIn();
            } else {
                $suggestionBox.css('display', 'block');
            }

            if (options.adjustBorderRadius) {
                context.css('border-bottom-left-radius', 0);
                context.css('border-bottom-right-radius', 0);
            }

            options.onShow();

        }

        /**
         * Sets the width of the suggestion box
         */
        function setSuggestionBoxWidth() {
            var searchBoxWidth = getSearchBoxWidth() + options.widthAdjustment;
            if (options.menuWidth == 'auto') {
                $suggestionBox.css({
                    'min-width': searchBoxWidth
                });
            } else if (options.menuWidth == 'constrain') {
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
                context.width() +
                getCssValue(context, 'border-left-width') +
                getCssValue(context, 'border-right-width') +
                getCssValue(context, 'padding-left') +
                getCssValue(context, 'padding-right')
            );
        }

        /**
         * Builds the attributes from the JSON
         * @param value
         * @param attr
         * @returns {*}
         */
        function createAttributes(value, attr) {
            $.each(value.attr, function(key, value) {
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
            for (var i = 0; i < options.customData.length; i++) {
                var custom = value[options.customData[i]];
                if (custom) {
                    $suggestions += value[options.customData[i]];
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

            var filterPattern = options.filterPattern.replace("{INPUT}", context.val());

            var $suggestions = '<div class="suggestion-header">' + options.heading + '</div> ' +
                '<ul class="suggestion-box-list">';
                // TODO: Implement array of object and array of values for populating list.
console.log(Array.isArray(data))

            $.each(data.suggestions, function(key, value) {

                if (value.suggestion) {
                    let url = (value.url) ? value.url : "#";
   
                    matches = true;
                    var attr = "";
                    if (value.attr) {
                        attr = createAttributes(value, attr);
                    }
                    $suggestions += '<li><a href="' + url + '" ' + attr + '>';
                    if (value.image) {
                        $suggestions += '<img src="' + value.image + '" />';
                    }

                    $suggestions += (options.highlightMatch) ? (value.suggestion).replace(new RegExp(filterPattern, 'gi'), '<b>$&</b>') : value.suggestion;

                    if (options.customData.length > 0) {
                        $suggestions = createCustomValues(value, $suggestions);
                    }
                    $suggestions += '</a></li>';
                } else {
                    return false;
                }

                // break when maximum results have been found
                if (key === (options.results - 1)) {
                    return false;
                }
            });
            $suggestions += '</ul>';

            return $suggestions;
        }

        function getNoSuggestionMarkup() {
            $suggestionBox.html('<div class="no-suggestions">' + options.noSuggestionsMessage + '</div>');
        }

        /**
         * Shows the suggestion-box suggestions if they are available based on the data passed in
         */
        function showSuggestions(forceShow) {
            resetSelection();

            matches = false;

            var data = (options.filter) ? filterResults(context.val()) : jsonData;


            if (data) {
                if (data.suggestions) {
                    var $suggestions = createSuggestionsList(data);
                }
            }

            // Check for focus before showing suggestion box. User could have clicked outside before request finished.
            if (active || forceShow) {

                if (matches && (context.val().length > 0 || forceShow)) {
                    // we have exactly 1 exact match and have set the hideOnExactMatch option to true, so hide the suggestion box
                    if (options.hideOnExactMatch && exactMatch) {
                        hideSuggestionBox();
                    } else {
                        // we have some suggestions, so show them
                        $suggestionBox.html($suggestions);
                        setSuggestionBoxWidth();
                        showSuggestionBox();
                    }
                } else if (forceShow) {
                    // We don't have any suggestions, but we are forcing display, show it regardless.
                    if (options.showNoSuggestionsMessage) {
                        getNoSuggestionMarkup();
                    }
                    setSuggestionBoxWidth();
                    showSuggestionBox();
                } else if (options.showNoSuggestionsMessage && context.val().length > 0) {
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

            if (options.sort && jsonData.suggestions) {
                jsonData.suggestions.sort(options.sort);
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
                success: function(data) {
                    setJsonData(data);
                },
                error: function(e) {
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
            var filterPattern = options.filterPattern.replace("{INPUT}", value);

            if (!value) {
                // we weren't passed anything to filter against, return empty object
                return jsonData;
            }
            if (jsonData) {
                if (jsonData.suggestions) {

                    // We have JSON data and user input, so apply the filter
                    var regex = new RegExp(filterPattern, "i");
                    data = $.grep(jsonData.suggestions, function(name) {
                        return regex.test(name.suggestion);
                    });
                }
            }
            // Sort the results, if sort function passed
            if (options.sort && data) {
                data.sort(options.sort);
            }

            if (data && options.hideOnExactMatch) {
                exactMatch = (data.length == 1 && data[0].suggestion == value)
            }

            var json = JSON.stringify({ "suggestions": data });

            return $.parseJSON(json);
        }

        // public methods.
        self.getSuggestions = function(url) {
            getSuggestions(url);
            return self;
        };
        self.addSuggestions = function(json) {
            setJsonData(json);
            return self;
        };
        self.loadSuggestions = function(url) {
            loadJson(url);
            return self;
        };
        self.getJson = function() {
            return JSON.stringify(jsonData);
        };
        self.moveUp = function() {
            moveUp();
            return self;
        };
        self.moveDown = function() {
            moveDown();
            return self;
        };
        self.selectedUrl = function() {
            return selectedHref;
        };
        self.selectedSuggestion = function() {
            return $suggestionBox.find('li:eq(' + selectedLi + ')').text();
        };
        self.selectedImage = function() {
            return $suggestionBox.find('li:eq(' + selectedLi + ')').find('img').attr('src');
        };
        self.position = function() {
            return selectedLi;
        };
        self.select = function(position) {
            unselect(selectedLi);
            selectedLi = position;
            select(position, options.scrollable);
            return self;
        };
        self.resetSelection = function() {
            unselect(selectedLi);
            resetSelection();
            return self;
        };
        self.show = function(force) {
            force = (force) ? force : false;
            showSuggestions(force);
            return self;
        };
        self.hide = function() {
            hideSuggestionBox();
            return self;
        };
        self.getId = function(withHash) {
            return (withHash) ? '#' + randId : randId;
        };
        self.reservedKey = function(e) {
            var key = e.which;
            return key === ENTER_KEY || key === ESCAPE_KEY || key === UP_ARROW_KEY || key === DOWN_ARROW_KEY
        };
        self.el = function() {
            return $suggestionBox;
        };
        self.destroy = function() {
            $suggestionBox.unbind();
            $suggestionBox.remove();

            // remove event handlers
            context.off('blur', blurEvent);
            context.off('keyup', keyupEvents);
            context.off('focus', focusEvents);
            context.off('keydown', keydownEvents);
            context.off('paste', pasteEvents);

            return null;
        };
        self.set = function(option, value) {
            options[option] = value;
            setup();
            return self;
        };
        self.clearSuggestions = function() {
            setJsonData(JSON.stringify({}));
            return self;
        };

        return self;
    }
}(jQuery));
