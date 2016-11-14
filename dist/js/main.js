(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Anubis = function () {
    function Anubis(searchBy, regexPattern, sort) {
        _classCallCheck(this, Anubis);

        this.searchBy = searchBy;
        this.regex = regexPattern;
        this.sort = sort;
        this.search = "";
        this.debug = false; // flag for showing debug messages from ajax call
        this.lastSearch = "";
        console.log(this.regex);
    }

    _createClass(Anubis, [{
        key: "setDebug",
        value: function setDebug(debug) {
            this.debug = debug;
        }
    }, {
        key: "setData",
        value: function setData(data) {
            this.data = data;
        }
    }, {
        key: "getSuggestions",
        value: function getSuggestions() {
            return this.filterData();
        }
    }, {
        key: "setSearch",
        value: function setSearch(search) {
            // Escape any regex patterns as search string
            var santizedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            this.search = santizedSearch;
        }
    }, {
        key: "getSearch",
        value: function getSearch() {
            return this.search;
        }

        /**
         * Returns the first result that matches the filter
         */

    }, {
        key: "findFirst",
        value: function findFirst(filter) {
            var regex = new RegExp(filter);
            retun;
        }
    }, {
        key: "filterData",
        value: function filterData() {
            var _this = this;

            var filterPattern = this.regex.replace('{{INPUT}}', this.search);
            var regex = new RegExp(filterPattern, "i");
            var results = [];

            if (this.data && this.search.length > 0) {
                results = $.grep(this.data, function (item) {
                    return (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" ? regex.test(item[_this.searchBy]) : regex.test(item);
                });
            }

            results = this.sortData(results);

            return results;
        }
    }, {
        key: "sortData",
        value: function sortData(data) {
            return data.sort(this.sort);
        }
    }, {
        key: "getLastSearch",
        value: function getLastSearch() {
            return this.lastSearch;
        }
    }, {
        key: "clearLastSearch",
        value: function clearLastSearch() {
            this.lastSearch = "";
        }
    }, {
        key: "killCurrentFetch",
        value: function killCurrentFetch() {
            if (this.xhr != undefined) {
                this.xhr.abort();
            }
        }

        // Fetches suggestions from the given url

    }, {
        key: "fetchSuggestions",
        value: function fetchSuggestions(url, callback) {
            var _this2 = this;

            this.lastSearch = this.search;

            console.log('searching for ' + this.search);

            this.killCurrentFetch();

            this.xhr = $.ajax({
                url: url,
                method: 'get',
                dataType: 'json',
                data: { search: this.search }
            }).done(callback).fail(function (data) {
                if (_this2.debug) {
                    console.log('[Ajax Error]:' + data);
                }
            });
        }
    }]);

    return Anubis;
}();

exports.default = Anubis;

},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _TemplateParser = require('./TemplateParser');

var _TemplateParser2 = _interopRequireDefault(_TemplateParser);

var _Anubis = require('./Anubis');

var _Anubis2 = _interopRequireDefault(_Anubis);

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/*
/ @class SuggestionListDropdown - builds the SuggestionList Dom object
*/

var SuggestionListDropdown = function () {
    function SuggestionListDropdown(inputEl, template, options, anubis, typeAhead) {
        _classCallCheck(this, SuggestionListDropdown);

        this.inputEl = inputEl;
        this.template = template;

        this.templateParser = new _TemplateParser2.default(template);
        this.anubis = anubis;
        this.typeAhead = typeAhead;

        this.options = options;
        this.perpetualFetch = this.options.fetchEvery !== -1 ? true : false;
        this.fetchRate = this.options.fetchAfter;
        this.endFetch = false;

        // Whether or not the scroll action was done pragmatically
        this.autoScrolled = false;

        this.radiusDefaults = {
            bottomLeft: _util2.default.getCssValue(this.inputEl, 'border-bottom-right-radius'),
            bottomRight: _util2.default.getCssValue(this.inputEl, 'border-bottom-right-radius')
        };

        this.selectedLi = -1; // Nothing selected
        this.setRandId();
        this._buildDom();

        // Bind Events
        this.$suggestionBox.on('mousemove', this.mousemoveEvents.bind(this));
        this.$suggestionBox.on('mouseout', this.mouseoutEvents.bind(this));
        this.$suggestionBox.on('click', this.clickEvents.bind(this));
    }

    _createClass(SuggestionListDropdown, [{
        key: '_buildDom',
        value: function _buildDom() {
            this.$suggestionBox = (0, _jQuery2.default)('<div id="' + this.randId + '" class="suggestion-box"></div>').appendTo('body');
            if (this.options.height) {
                this.$suggestionBox.css('max-height', this.options.height);
            }

            if (this.options.scrollable) {
                this.$suggestionBox.css('overflow', 'auto');
            }
        }
    }, {
        key: 'updateSuggestions',
        value: function updateSuggestions(search) {
            var _this = this;

            this.anubis.setSearch(search);

            if (search == "") {
                this.anubis.clearLastSearch();
                this.hide();
            } else {
                console.log('choose');
                if (this.options.url && !this.pending && (this.anubis.getLastSearch().length > search.length || this.anubis.getLastSearch().length === 0) && !this.endFetch || this.perpetualFetch) {
                    this.anubis.setSearch(search);
                    this.pending = true;
                    this.inputEl.css('background', "url('" + this.options.loadImage + "') no-repeat 99% 50%");

                    setTimeout(function () {
                        _this.loadSuggestionData();
                    }, this.fetchRate);

                    this.endFetch = this.options.fetchOnce;

                    if (this.perpetualFetch) {
                        // make sure we continue to filter
                        this.show();
                        this.fetchRate = this.options.fetchEvery;
                    }
                } else {
                    this.show();
                }
            }
        }
    }, {
        key: 'getSelectedItemIndex',
        value: function getSelectedItemIndex() {
            return this.selectedLi;
        }
    }, {
        key: 'getSuggestionAt',
        value: function getSuggestionAt(index) {
            return this.anubis.getSuggestions()[index];
        }

        /**
         * Clears the last suggestions and updates the suggestions, useful for `ctrl+v` paste
         */

    }, {
        key: 'clearAndUpdate',
        value: function clearAndUpdate(search) {
            this.hide();
            this.anubis.clearLastSearch();
            this.updateSuggestions(search);
        }
    }, {
        key: 'loadSuggestionData',
        value: function loadSuggestionData() {
            var _this2 = this;

            // Don't bother fetching data we already have again
            if (this.anubis.getLastSearch() !== this.anubis.getSearch()) {
                this.anubis.fetchSuggestions(this.options.url, function (data) {
                    _this2.anubis.setData(data);
                    console.log(_this2.selectionMade);
                    // Only show if a selection was not made while wating for a response
                    if (!_this2.selectionMade && _this2.anubis.getSearch().length > 0) {
                        _this2.show();
                    } else {
                        _this2.hide();
                    }

                    _this2.selectionMade = false;
                    _this2.pending = false;

                    _this2.inputEl.css('background', "");
                });
            } else {
                this.inputEl.css('background', "");
            }
        }

        /* Update the position of the suggestionList */

    }, {
        key: 'updatePosition',
        value: function updatePosition() {
            // Calculates the vertical padding and broder for the input box so the list isn't placed over the top.
            var borders = _util2.default.calculateVerticalBorderWidth(this.inputEl);
            var padding = _util2.default.calculateVerticalPadding(this.inputEl);
            var offset = this.inputEl.offset();

            this.$suggestionBox.css({
                'position': 'absolute',
                'zIndex': this.options.zIndex,
                'left': offset.left + this.options.leftOffset,
                'top': offset.top + (this.inputEl.height() + borders + padding + this.options.topOffset)
            });
        }

        /*
         * Show the suggestion box
         */

    }, {
        key: 'show',
        value: function show() {

            // Don't reset if a suggestion is still available at the index it's annoying when trying to select while data is loading
            if (this.anubis.getSuggestions().length < this.selectedLi) {
                this.selectedLi = -1;
            }

            this.renderSuggestionsList();
            // Reset election after page loaded
            if (this.selectedLi > -1) {
                this.select(this.selectedLi);
            }

            if (this.anubis.getSuggestions().length > 0) {
                this.updatePosition();
                this.setWidth();

                if (this.options.adjustBorderRadius) {
                    this._applyBorderRadius(0, 0);
                }

                this.$suggestionBox.fadeIn();
            } else if (this.options.showNoSuggestionsMessage) {
                // SHOW NO SUGGESTIONS FOUND MESSAGE
            } else {
                this.hide();
            }
        }
    }, {
        key: '_applyBorderRadius',
        value: function _applyBorderRadius(left, right) {
            this.inputEl.css('border-bottom-left-radius', left);
            this.inputEl.css('border-bottom-right-radius', right);
        }

        /**
         * Sets the width of the suggestion box
         */

    }, {
        key: 'setWidth',
        value: function setWidth() {
            var searchBoxWidth = this.getSearchBoxWidth();
            var width = {};
            width[this.options.widthType] = searchBoxWidth;
            this.$suggestionBox.css(width);
        }

        /**
         * Returns the width of the search box
         * @returns {number}
         */

    }, {
        key: 'getSearchBoxWidth',
        value: function getSearchBoxWidth() {
            return this.inputEl.width() + _util2.default.getCssValue(this.inputEl, 'border-left-width') + _util2.default.getCssValue(this.inputEl, 'border-right-width') + _util2.default.getCssValue(this.inputEl, 'padding-left') + _util2.default.getCssValue(this.inputEl, 'padding-right');
        }

        /*
         * Hide the suggestion box
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.selectedLi = -1;
            console.log('hide');
            this._applyBorderRadius(this.radiusDefaults.bottomLeft, this.radiusDefaults.bottomRight);
            this.$suggestionBox.css('display', 'none');
            this.typeAhead.removeTypeahead();
        }
    }, {
        key: 'renderSuggestionsList',
        value: function renderSuggestionsList() {
            var _this3 = this;

            var suggestions = this.anubis.getSuggestions().slice(0, this.options.results);

            var template = this.templateParser.getParsedTemplate();
            template = this.templateParser.replaceHandlebars(template, "header", this.options.heading);

            var listItemMarkup = this.templateParser.getListItemMarkup();

            var listMarkup = "";

            suggestions.forEach(function (item) {
                var markup = listItemMarkup;

                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == "object") {
                    var templateItems = _this3.templateParser.getTemplatedItems(listItemMarkup);
                    templateItems.forEach(function (templateItem) {
                        var itemVal = _this3.options.highlightMatch && templateItem === _this3.options.props.value ? _this3.highlightMatches(item[templateItem]) : item[templateItem];
                        markup = _this3.templateParser.replaceHandlebars(markup, templateItem, itemVal);
                    });
                } else {
                    var suggestion = _this3.options.highlightMatch ? _this3.highlightMatches(item) : item;
                    markup = _this3.templateParser.replaceHandlebars(markup, _this3.options.props.value, suggestion);
                    markup = _this3.templateParser.replaceHandlebars(markup, "url", "#");
                }

                listMarkup += "<li>";
                listMarkup += markup;
                listMarkup += "</li>";
            });

            var suggestionMarkup = this.templateParser.replaceHandlebars(template, "suggestion_list", listMarkup);

            this.$suggestionBox.html(suggestionMarkup);
        }
    }, {
        key: 'highlightMatches',
        value: function highlightMatches(suggestion) {
            // Replace all 
            var filterPattern = this.templateParser.replaceHandlebars(this.options.filter, "INPUT", this.inputEl.val());
            return suggestion.replace(new RegExp(filterPattern, 'gi'), '<b>$&</b>');
        }

        /**
         * Selects the suggestion at the given position
         * @param position
         * @param scroll
         */

    }, {
        key: 'select',
        value: function select(position, scroll) {
            this.selectedHref = this.$suggestionBox.find("li:eq(" + position + ") a").attr('href');
            this.$suggestionBox.find("li:eq(" + position + ")").addClass('selected');
            this.typeAhead.updateTypeAhead(position);

            if (scroll) {
                this.doScroll();
            }
        }
    }, {
        key: 'isOpen',
        value: function isOpen() {
            return this.$suggestionBox.css('display') !== 'none';
        }

        /**
         * Scrolls the suggestion box to the given position
         * @param to
         */

    }, {
        key: 'doScroll',
        value: function doScroll() {
            this.autoScrolled = true;

            if (this.selectedLi > -1) {
                var selection = this.$suggestionBox.find('li:eq(' + this.selectedLi + ')').position();

                var pos = selection ? selection.top - this.$suggestionBox.find('li:eq(0)').position().top : 0;
            }

            // find scroll position at to and set scroll bars to it
            var scrollTo = this.selectedLi > -1 ? pos : 0;
            this.$suggestionBox.scrollTop(scrollTo);
        }

        /**
         * Unselects the suggestion at the given position
         * @param position
         */

    }, {
        key: 'unselect',
        value: function unselect(position) {
            this.$suggestionBox.find("li:eq(" + position + ")").removeClass('selected');
        }

        /**
         * Events for the mouse moving inside the suggestion box
         * @param e
         */

    }, {
        key: 'mousemoveEvents',
        value: function mousemoveEvents(e) {
            if (this.isSuggestion(e) && !this.autoScrolled) {
                this.unselect(this.selectedLi);
                this.selectedLi = this.getSelectionMouseIsOver(e);
                this.select(this.selectedLi);
            }

            this.mouseHover = true;
            this.autoScrolled = false;
        }

        /**
         * Moves the selection down to the next suggestion
         */

    }, {
        key: 'moveDown',
        value: function moveDown(scroll) {
            var listSize = this.$suggestionBox.find('li').length;

            if (!this.isOpen() && this.anubis.getSuggestions().length > 0) {
                this.updateSuggestions(this.inputEl.val());
                this.show();
            } else if (this.selectedLi === listSize - 1) {
                this.unselect(this.selectedLi);
                this.resetSelection();
            } else {
                this.unselect(this.selectedLi);
                this.selectedLi++;
                this.select(this.selectedLi);
            }

            if (scroll) {
                this.doScroll();
            }
        }

        /**
         * Moves the selection up to the previous suggestions
         */

    }, {
        key: 'moveUp',
        value: function moveUp(scroll) {
            if (this.selectedLi > 0) {
                this.unselect(this.selectedLi);
                this.selectedLi--;
                this.select(this.selectedLi);
            } else if (this.selectedLi == -1) {
                this.unselect(this.selectedLi);
                this.selectedLi = this.$suggestionBox.find('li').length - 1;
                this.select(this.selectedLi);
            } else {
                this.unselect(0);
                this.resetSelection();
            }

            if (scroll) {
                this.doScroll();
            }
        }

        /**
         * Returns the index of the list item the mouse is currently hovering over
         * @param e
         * @returns {Number}
         */

    }, {
        key: 'getSelectionMouseIsOver',
        value: function getSelectionMouseIsOver(e) {
            var $parentLi = (0, _jQuery2.default)(e.target).parents('li');

            return $parentLi.parent().children().index($parentLi);
        }

        /**
         * Events for when the mouse leaves the suggestion box
         * @param e
         */

    }, {
        key: 'mouseoutEvents',
        value: function mouseoutEvents(e) {
            if (this.isSuggestion(e) && !this.autoScrolled) {
                this.unselect(this.selectedLi);
                this.resetSelection();
            } else if ((0, _jQuery2.default)(':focus').attr('id') !== this.inputEl.attr('id')) {
                // We're out of the suggestion box so re-focus on search
                this.inputEl.focus();
            }
            this.mouseHover = false;
        }

        /**
         * Events for clicks inside the suggestion box
         * @param e
         */

    }, {
        key: 'clickEvents',
        value: function clickEvents(e) {
            if (this.isSuggestion(e)) {
                e.preventDefault();
                this.doClick(e);
            }
        }

        /*
         * Returns true if the mouse is over the dropdown list
         */

    }, {
        key: 'isHovering',
        value: function isHovering() {
            return this.mouseHover;
        }

        /**
         * Performs the click action, this can be called for any event you want to recreate a click action for.
         * @param e
         */

    }, {
        key: 'doClick',
        value: function doClick(e) {
            e.preventDefault();

            if (this.pending) {
                this.selectionMade = true;
            }

            if (this.perpetualFetch) {
                //this.getSuggestions();
            }

            var selectionText = this.$suggestionBox.find('li:eq(' + this.selectedLi + ')').text();
            this.options.onClick(e, selectionText, this.selectedHref, this.inputEl);
            this.hide();

            this.typeAhead.removeTypeahead();
        }
    }, {
        key: 'simulateClick',
        value: function simulateClick() {
            if (this.selectedLi > -1) {
                this.$suggestionBox.find('.selected a').click();
            }
        }

        /**
         * Is the given event made on a suggestion?
         * @param e
         * @returns {boolean}
         */

    }, {
        key: 'isSuggestion',
        value: function isSuggestion(e) {
            return (0, _jQuery2.default)(e.target).parents('a').length > 0 || e.target.nodeName === 'A';
        }

        /**
         * Resets any selected suggestions
         */

    }, {
        key: 'resetSelection',
        value: function resetSelection() {
            this.selectedHref = '#';
            this.selectedLi = -1;
            // remove all selected on reset
            this.$suggestionBox.find('li').removeClass('selected');
        }
    }, {
        key: 'setRandId',
        value: function setRandId() {
            this.Id = 'suggestion-box-' + Math.floor(Math.random() * 10000000);
        }
    }]);

    return SuggestionListDropdown;
}();

exports.default = SuggestionListDropdown;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Anubis":1,"./TemplateParser":3,"./util":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var TemplateParser = function () {
    function TemplateParser(template) {
        _classCallCheck(this, TemplateParser);

        this.template = template;
        this._getTemplateForListItem();
        this._removeListItemMarkup();
        this._removeRootElement();
    }

    _createClass(TemplateParser, [{
        key: '_getTemplateForListItem',
        value: function _getTemplateForListItem() {
            var listItem = "";

            var html = $.parseHTML($.trim(this.template));

            if (html.length !== 1) {
                console.log('%c[Suggestion-Box:Error] Unable to parse template. Template must have one root element.', 'color: #f00');
            }
            var el = html[0];
            if (el.id !== "" || el.class !== undefined) {
                console.log('%c[Suggestion-Box:warn] Avoid adding style attributes such as "class", "id" or "style" to root element in template because these tags will be stripped.', 'color: #f00');
            }

            if (el.childNodes.length > 0) {
                $.each(el.childNodes, function (i, el) {
                    if (el.id == "suggestion-list") {
                        $.each(el.childNodes, function (i, el) {
                            if (el.nodeName == "LI") {
                                listItem = el.innerHTML;
                            }
                        });
                    }
                });
            }

            this.listItem = listItem;
        }

        // returns an arroy of names for items that are inside handlebars

    }, {
        key: 'getTemplatedItems',
        value: function getTemplatedItems(str) {
            var regex = new RegExp("@?{{\\s?[a-z0-9_-]+\\s?}}", "ig");
            var items = str.match(regex);

            var itemNames = [];

            items.forEach(function (item) {
                //console.log(item);
                item = item.replace(new RegExp("@?{{\\s?"), "");
                item = item.replace(new RegExp("\\s?}}"), "");
                itemNames.push(item);
            });

            return itemNames;
        }
    }, {
        key: '_removeRootElement',
        value: function _removeRootElement() {
            this.template = $(this.template).unwrap().html();
        }
    }, {
        key: '_removeListItemMarkup',
        value: function _removeListItemMarkup() {
            this.template = this.template.replace("<li>" + this.listItem + "</li>", "{{ suggestion_list }}");
        }
    }, {
        key: 'replaceHandlebars',
        value: function replaceHandlebars(str, name, replace) {
            return str.replace(new RegExp("@?{{\\s?" + name + "\\s?}}", "gi"), replace);
        }
    }, {
        key: 'getParsedTemplate',
        value: function getParsedTemplate() {
            return this.template;
        }
    }, {
        key: 'getListItemMarkup',
        value: function getListItemMarkup() {
            return this.listItem;
        }
    }]);

    return TemplateParser;
}();

exports.default = TemplateParser;

},{}],4:[function(require,module,exports){
"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var TypeAhead = function () {
    function TypeAhead(anubis, searchBy) {
        _classCallCheck(this, TypeAhead);

        this.anubis = anubis;
        this.searchBy = searchBy;
    }

    _createClass(TypeAhead, [{
        key: "updateTypeAhead",
        value: function updateTypeAhead(selectedItemIndex) {
            var currentInput = this.anubis.getSearch();
            // If the suggestion box has an item selected get the item at that index instead.
            var index = selectedItemIndex > -1 ? selectedItemIndex : 0;
            var suggestion = this.anubis.getSuggestions()[index] || "";

            suggestion = (typeof suggestion === "undefined" ? "undefined" : _typeof(suggestion)) == "object" ? suggestion[this.searchBy] : suggestion;

            var regex = new RegExp("^" + currentInput, "i");
            // Simply match the case of the typeahead to the case the user typed
            var typeAhead = suggestion.replace(regex, currentInput);
            $("#suggestion-box-typeahead").attr('data-placeholder', typeAhead);
        }
    }, {
        key: "removeTypeahead",
        value: function removeTypeahead() {
            $("#suggestion-box-typeahead").attr('data-placeholder', "");
        }
    }]);

    return TypeAhead;
}();

exports.default = TypeAhead;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    'ENTER_KEY': 13,
    'UP_ARROW_KEY': 38,
    'DOWN_ARROW_KEY': 40,
    'ESCAPE_KEY': 27
};

},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _suggestionBox = require('./suggestion-box.js');

var _suggestionBox2 = _interopRequireDefault(_suggestionBox);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

(function ($) {
    $.fn.suggestionBox = function (options) {
        // Get the bound dom element
        var domElement = $(this).get()[0];

        var args = $.makeArray(arguments);
        var suggestionBox = $.data(domElement, 'suggestionBox');

        if (suggestionBox) {
            suggestionBox.set(args[0], args[1]);
        } else {
            suggestionBox = new _suggestionBox2.default(options, this);
            $.data(domElement, 'suggestionBox', suggestionBox);
        }

        return suggestionBox;
    };
})(jQuery);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./suggestion-box.js":8}],7:[function(require,module,exports){
'use strict';

var _module$exports;

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }return obj;
}

module.exports = (_module$exports = {
    data: [],
    template: '#suggestion-box-template',
    props: {
        value: 'suggestion'
    },
    sort: function sort() {},
    topOffset: 0,
    leftOffset: 0,
    widthAdjustment: 0,
    adjustBorderRadius: true,
    zIndex: 10000,
    hideOnExactMatch: false,
    loadImage: "/dist/images/loading.gif",
    fetchAfter: 1000,
    fetchEvery: -1, // in ms
    fetchOnce: false,
    results: 10,
    widthType: 'width', // Pass a css width attr (i.e. 'width', 'min-width')
    showNoSuggestionsMessage: false,
    noSuggestionsMessage: 'No Suggestions Found',
    filter: "^{{INPUT}}",
    typeahead: false,
    highlightMatch: false,
    ajaxError: function ajaxError() {},
    ajaxSuccess: function ajaxSuccess() {},
    loading: function loading() {},
    completed: function completed() {},
    onClick: function onClick(el, value, href, input) {
        input.val(value);
    },
    onShow: function onShow() {},
    onHide: function onHide() {},
    paramName: 'search'
}, _defineProperty(_module$exports, 'sort', function sort() {}), _defineProperty(_module$exports, 'scrollable', false), _defineProperty(_module$exports, 'debug', true), _module$exports);

},{}],8:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _SuggestionListDropdown = require('./SuggestionListDropdown.js');

var _SuggestionListDropdown2 = _interopRequireDefault(_SuggestionListDropdown);

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

var _keys = require('./constants/keys.js');

var _keys2 = _interopRequireDefault(_keys);

var _Anubis = require('./Anubis.js');

var _Anubis2 = _interopRequireDefault(_Anubis);

var _TypeAhead = require('./TypeAhead.js');

var _TypeAhead2 = _interopRequireDefault(_TypeAhead);

var _options = require('./options.js');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var SuggestionBox = function () {
    function SuggestionBox(options, context) {
        _classCallCheck(this, SuggestionBox);

        this.context = context;

        this.search = this.context.val();
        this.suggestions = [];
        var defaultFilter = _options2.default.filter;

        this.options = _jQuery2.default.extend(_options2.default, options);

        if (defaultFilter != this.options.filter && this.options.typeahead) {
            console.log('[suggestion-box: warn]: Using a custom filter pattern with the typeahed option can cause unexpected results');
        }

        this.fetchRate = this.options.fetchAfter;
        // this.perpetualFetch = (this.options.fetchEvery != -1) ? true : false;
        // get loaddefault template into options 
        var template = _util2.default.isId(this.options.template) ? (0, _jQuery2.default)(this.options.template).html() : this.options.template;

        this.anubis = new _Anubis2.default(this.options.props.value, this.options.filter, this.options.sort);
        this.anubis.setData(this.options.data);
        this.anubis.setDebug(this.options.debug);

        this.typeAhead = new _TypeAhead2.default(this.anubis, this.options.props.value);
        this.dropdown = new _SuggestionListDropdown2.default(this.context, template, this.options, this.anubis, this.typeAhead);

        this.context.on('keyup', this.keyupEvents.bind(this));
        this.context.on('blur', this.blurEvents.bind(this));
        this.context.on('focus', this.focusEvents.bind(this));
        this.context.on('keydown', this.keydownEvents.bind(this));
        this.context.on('paste', this.pasteEvents.bind(this));

        // Set up typeahead option
        this._initTypeAhead();

        this.context.attr('autocomplete', 'off');

        // Preload the loading image if it has been supplied so it loads faster!
        if (this.options.loadImage) {
            (0, _jQuery2.default)('<img/>')[0].src = this.options.loadImage;
        }
    }

    _createClass(SuggestionBox, [{
        key: '_initTypeAhead',
        value: function _initTypeAhead() {
            if (this.options.typeahead) {
                this.context.wrap('<div id="suggestion-box-typeahead" data-placeholder=""></div>');
                var top = _util2.default.getCssValue(this.context, 'padding-top') + _util2.default.getCssValue(this.context, 'border-top-width');
                var left = _util2.default.getCssValue(this.context, 'padding-left') + _util2.default.getCssValue(this.context, 'border-left-width');
                (0, _jQuery2.default)('<style>#suggestion-box-typeahead::after{left:' + left + 'px;top:' + top + 'px;}</style>').appendTo('head');
            }
        }
    }, {
        key: 'getSuggestions',
        value: function getSuggestions() {
            this.dropdown.updateSuggestions(this.context.val());
        }
    }, {
        key: 'updateTypeAhead',
        value: function updateTypeAhead() {
            var selectedIndex = this.dropdown.getSelectedItemIndex();
            this.typeAhead.updateTypeAhead(selectedIndex);
        }
    }, {
        key: 'keyupEvents',
        value: function keyupEvents(e) {
            if (!this._isReservedKey(e)) {
                this.getSuggestions();
                this.updateTypeAhead();
            }
        }
    }, {
        key: 'keydownEvents',
        value: function keydownEvents(e) {

            if (e.which == _keys2.default.DOWN_ARROW_KEY) {
                e.preventDefault();
                this.dropdown.moveDown(true);
                this.updateTypeAhead();
            }
            if (this.dropdown.isOpen()) {
                if (e.which == _keys2.default.UP_ARROW_KEY) {
                    e.preventDefault();
                    this.dropdown.moveUp(true);
                    this.updateTypeAhead();
                }
                if (e.which === _keys2.default.ENTER_KEY) {
                    e.preventDefault();
                    this.dropdown.simulateClick();
                }
                if (e.which == _keys2.default.ESCAPE_KEY) {
                    e.preventDefault();
                    this.context.css('background', "");
                    this.dropdown.hide();
                }
            }
        }

        /**
         * Events for when the search box is focused
         */

    }, {
        key: 'focusEvents',
        value: function focusEvents() {
            this.getSuggestions();
        }

        /**
         * Events for when the search box loses focus
         */

    }, {
        key: 'blurEvents',
        value: function blurEvents() {
            if (!this.dropdown.isHovering()) {
                this.context.css('background', "");
                this.dropdown.hide();
            }
        }

        /**
         * Events for when text is pasted in to the search box
         */

    }, {
        key: 'pasteEvents',
        value: function pasteEvents() {
            var _this = this;

            // Simulate keyup after 200ms otherwise the value of the search box will not be available
            setTimeout(function () {
                _this.dropdown.clearAndUpdate(_this.context.val());
            }, 200);
        }
    }, {
        key: '_isReservedKey',
        value: function _isReservedKey(e) {
            return _util2.default.inObject(e.which, _keys2.default);
        }
    }]);

    return SuggestionBox;
}();

exports.default = SuggestionBox;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Anubis.js":1,"./SuggestionListDropdown.js":2,"./TypeAhead.js":4,"./constants/keys.js":5,"./options.js":7,"./util.js":9}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: 'getCssValue',
        value: function getCssValue(el, name) {
            return parseInt(el.css(name).replace('px', ''));
        }

        /** Calculates the padding for the given elements**/

    }, {
        key: 'calculateVerticalPadding',
        value: function calculateVerticalPadding(el) {
            return Util.getCssValue(el, 'padding-bottom') + Util.getCssValue(el, 'padding-top');
        }
    }, {
        key: 'calculateVerticalBorderWidth',
        value: function calculateVerticalBorderWidth(el) {
            return Util.getCssValue(el, 'border-bottom-width') + Util.getCssValue(el, 'border-top-width');
        }
    }, {
        key: 'calculateHorizontalBorders',
        value: function calculateHorizontalBorders(el) {
            return Util.getCssValue(el, 'border-left-width') + Util.getCssValue(el, 'border-right-width');
        }
    }, {
        key: 'copyArray',
        value: function copyArray(arr) {
            return arr.splice(0);
        }

        /**
         * Returns true if the given search is found in the given object;
         */

    }, {
        key: 'inObject',
        value: function inObject(search, obj) {
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;

                if (obj[key] == search) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'isId',
        value: function isId(str) {
            return str.charAt(0) == "#";
        }
    }, {
        key: 'logError',
        value: function logError(error) {
            console.log(error);
        }
    }]);

    return Util;
}();

exports.default = Util;

},{}]},{},[6]);

//# sourceMappingURL=main.js.map
