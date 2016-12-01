(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Anubis = function () {
    function Anubis(searchBy, filter, sort, param, ajaxErrorEvent) {
        _classCallCheck(this, Anubis);

        this.searchBy = searchBy;
        this.filter = filter;
        this.sort = sort;
        this.search = "";
        this.param = param || 'search';
        this.lastSearch = "";
        this.ajaxErrorEvent = ajaxErrorEvent || 'suggestion-box.ajax.error';
    }

    _createClass(Anubis, [{
        key: "setData",
        value: function setData(data) {
            this.data = data;
        }
    }, {
        key: "getData",
        value: function getData() {
            return this.data;
        }
    }, {
        key: "setSearchBy",
        value: function setSearchBy(searchBy) {
            this.searchBy = searchBy;
        }
    }, {
        key: "getSearchBy",
        value: function getSearchBy() {
            return this.searchBy;
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
    }, {
        key: "setFilter",
        value: function setFilter(filter) {
            this.filter = filter;
        }
    }, {
        key: "getFilter",
        value: function getFilter() {
            return this.filter;
        }
    }, {
        key: "setSort",
        value: function setSort(sort) {
            this.sort = sort;
        }
    }, {
        key: "getSort",
        value: function getSort() {
            return this.sort;
        }
    }, {
        key: "filterData",
        value: function filterData() {
            var _this = this;

            var filterPattern = this.filter.replace('{{INPUT}}', this.search);
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
        key: "getParam",
        value: function getParam() {
            return this.param;
        }
    }, {
        key: "setParam",
        value: function setParam(param) {
            this.param = param;
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

        /* 
         * Fetches suggestions from the given url
         * @param {string} url - The url to retrieve suggestion data from
         * @param {function} callback - The actions to perform on successfull fetch
         */

    }, {
        key: "fetchSuggestions",
        value: function fetchSuggestions(url, callback) {
            var _this2 = this;

            this.lastSearch = this.search;

            // Kill any current ajax connections.
            this.killCurrentFetch();
            // Set up the search param
            var request = {};
            request[this.param] = this.search;

            this.xhr = $.ajax({
                url: url,
                method: 'get',
                dataType: 'json',
                data: request,
                success: callback
            });

            if (this.xhr) {
                this.xhr.fail(function (data) {
                    // fire an ajax error event on failure with the error data
                    $.event.trigger(_this2.ajaxErrorEvent, data);
                });
            }
        }
    }]);

    return Anubis;
}();

exports.default = Anubis;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Class to build the dropdown $menu
 */
var Dropdown = function () {
    function Dropdown(options, id) {
        _classCallCheck(this, Dropdown);

        this.id = id || this._getRandId();
        this.mouseHover = false;
        this.options = options;
        this.selectedLi = -1;
        this.autoScrolled = false; // Whether or not the scroll action was done progrmatically


        this.$menu = $('<div id="' + this.id + '" class="suggestion-box"></div>').appendTo('body');
        this.buildDom();
    }

    /*
     * Builds the HTML for the suggestion list and binds the events
     */


    _createClass(Dropdown, [{
        key: 'buildDom',
        value: function buildDom() {
            if (this.options.height) {
                this.$menu.css('max-height', this.options.height);
            }

            if (this.options.scrollable) {
                this.$menu.css('overflow', 'auto');
            } else {
                this.$menu.css('overflow', 'hidden');
            }

            this._bindEvents();
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            this.$menu.unbind();
            this.$menu.on('mousemove', this.mousemoveEvents.bind(this));
            this.$menu.on('mouseout', this.mouseoutEvents.bind(this));
            this.$menu.on('click', this.clickEvents.bind(this));
        }

        /*
         * Destroys the dropdown $menu
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.$menu.unbind();
            $('#' + this.id).remove();
        }

        /**
         *  Selects the item at the given position
         */

    }, {
        key: 'select',
        value: function select(position, scroll) {
            this.$menu.find("#suggestion-list > li:eq(" + position + ")").addClass('selected');

            if (scroll) {
                this.doScroll();
            }
        }

        /**
         *  Unselects the item at the given postion
         */

    }, {
        key: 'unselect',
        value: function unselect(position) {
            this.$menu.find("#suggestion-list > li:eq(" + position + ")").removeClass('selected');
        }

        /**
         * Events for when the mouse leaves the suggestion box
         */

    }, {
        key: 'mouseoutEvents',
        value: function mouseoutEvents(event) {
            this.mouseHover = false;
        }

        /**
         * Events for clicks inside the suggestion box
         * @param e
         */

    }, {
        key: 'clickEvents',
        value: function clickEvents(event) {
            if (this.isSuggestion(event)) {
                event.preventDefault();
                this.doClick(event);
            }
        }

        /**
         * Performs the click action, this can be called for any event you want to recreate a click action for.
         * @param e
         */

    }, {
        key: 'doClick',
        value: function doClick(event) {
            event.preventDefault();
        }

        /**
         * Events for the mouse moving inside the suggestion box
         * @param e
         */

    }, {
        key: 'mousemoveEvents',
        value: function mousemoveEvents(event) {
            if (this.isSuggestion(event) && !this.autoScrolled) {
                this.unselect(this.selectedLi);
                this.selectedLi = this.getSelectionMouseIsOver(event);
                this.select(this.selectedLi);
            }

            this.mouseHover = true;
            this.autoScrolled = false;
        }

        /**
         * Returns the index of the list item the mouse is currently hovering over
         * @param e
         * @returns {Number}
         */

    }, {
        key: 'getSelectionMouseIsOver',
        value: function getSelectionMouseIsOver(e) {
            var $parentLi = $(e.target).parents('li');

            return $parentLi.parent().children().index($parentLi);
        }

        /**
         * Is the given event made on a suggestion (targets anchor tag)?
         * @param e
         * @returns {boolean}
         */

    }, {
        key: 'isSuggestion',
        value: function isSuggestion(event) {
            return $(event.target).parents('a').length > 0 || event.target.nodeName === 'A';
        }
    }, {
        key: 'resetSelection',
        value: function resetSelection() {
            this.selectedLi = -1;
            // remove all selected on reset
            this.$menu.find('#suggestion-list > li').removeClass('selected');
        }
    }, {
        key: 'getSelectedItemIndex',
        value: function getSelectedItemIndex() {
            return this.selectedLi;
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
                var selection = this.$menu.find('#suggestion-list > li:eq(' + this.selectedLi + ')').position();

                var pos = selection ? selection.top - this.$menu.find('#suggestion-list > li:eq(0)').position().top : 0;
            }

            // find scroll position at to and set scroll bars to it
            var scrollTo = this.selectedLi > -1 ? pos : 0;
            this.$menu.scrollTop(scrollTo);
        }
    }, {
        key: 'isOpen',
        value: function isOpen() {
            return this.$menu.css('display') !== 'none';
        }

        /*
         * Returns true if the mouse is over the dropdown list
         */

    }, {
        key: 'isHovering',
        value: function isHovering() {
            return this.mouseHover;
        }
    }, {
        key: '_getRandId',
        value: function _getRandId() {
            return 'suggestion-box-' + Math.floor(Math.random() * 10000000);
        }
    }, {
        key: 'getId',
        value: function getId(withHash) {
            return withHash ? '#' + this.id : this.id;
        }
    }]);

    return Dropdown;
}();

exports.default = Dropdown;

},{"./util.js":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Dropdown2 = require('./Dropdown');

var _Dropdown3 = _interopRequireDefault(_Dropdown2);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * @Class SuggestionList - builds the SuggestionList Dom object
 */

var SuggestionList = function (_Dropdown) {
    _inherits(SuggestionList, _Dropdown);

    function SuggestionList(inputEl, templateParser, options, typeahead, suggestions) {
        _classCallCheck(this, SuggestionList);

        var _this = _possibleConstructorReturn(this, (SuggestionList.__proto__ || Object.getPrototypeOf(SuggestionList)).call(this, options));

        _this.inputEl = inputEl;
        _this.templateParser = templateParser;
        _this.typeahead = typeahead;
        _this.suggestions = suggestions;
        _this.suggestionChosen = false;
        return _this;
    }

    /**
     * Reset the template by creating a new Template object, this is necassary because template
     * Parser automtically parses the node tree, so it doesn't have to be done multiple times.
     */


    _createClass(SuggestionList, [{
        key: 'setTemplate',
        value: function setTemplate(templateParser) {
            this.templateParser = templateParser;
        }
    }, {
        key: 'setOptions',
        value: function setOptions(options) {
            this.options = options;
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition(left, top) {
            this.$menu.css({
                'position': 'absolute',
                'zIndex': this.options.zIndex,
                'left': left,
                'top': top
            });
        }

        /*
         * Show the suggestion box
         */

    }, {
        key: 'show',
        value: function show() {

            // Don't reset if a suggestion is still available at the index it's annoying when trying to select while data is loading
            if (this.suggestions.getSuggestions().length < this.selectedLi) {
                this.selectedLi = -1;
            }

            this.renderSuggestionsList();
            // Reset selection after page loaded
            if (this.selectedLi > -1) {
                this.select(this.selectedLi);
            }

            if (this.$menu.css('display') === 'none') {
                this.$menu.fadeIn();
            }
        }

        /**
         * Sets the width of the suggestion box
         */

    }, {
        key: 'setWidth',
        value: function setWidth(searchBoxWidth) {
            var width = {};
            width[this.options.widthType] = searchBoxWidth;
            this.$menu.css(width);
        }

        /*
         * Hide the suggestion list
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.selectedLi = -1;
            this.$menu.css('display', 'none');
            $.event.trigger(this.options.customEvents.close);
        }
    }, {
        key: '_buildMarkupForObjectList',
        value: function _buildMarkupForObjectList(templateItems, item, markup) {
            var _this2 = this;

            templateItems.forEach(function (templateItem) {
                var itemVal = _this2.options.highlightMatch && templateItem === _this2.options.searchBy ? _this2.highlightMatches(item[templateItem]) : item[templateItem];
                markup = _this2.templateParser.replaceHandlebars(markup, templateItem, itemVal);
            });

            return markup;
        }
    }, {
        key: '_buildSuggestionListMarkup',
        value: function _buildSuggestionListMarkup(markup, listMarkup) {
            var _this3 = this;

            var markupDom = $(markup);
            this.templateParser.getConditionals().forEach(function (conditional) {
                var expression = markupDom.find('#' + conditional.id).attr('sb-show');

                if (!_this3.displayEl(expression)) {
                    markupDom.find('#' + conditional.id).css('display', 'none');
                }
            });

            listMarkup += "<li>";
            listMarkup += markupDom[0].outerHTML;
            listMarkup += "</li>";

            return listMarkup;
        }
    }, {
        key: '_buildMarkup',
        value: function _buildMarkup(listItemMarkup, item) {
            var markup = listItemMarkup;

            if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == "object") {
                var templateItems = this.templateParser.getTemplatedItems(listItemMarkup);
                markup = this._buildMarkupForObjectList(templateItems, item, markup);
            } else {
                var suggestion = this.options.highlightMatch ? this.highlightMatches(item) : item;
                markup = this.templateParser.replaceHandlebars(markup, this.options.searchBy, suggestion);
                markup = this.templateParser.replaceHandlebars(markup, "url", "#");
            }

            return markup;
        }
    }, {
        key: 'renderSuggestionsList',
        value: function renderSuggestionsList() {
            var _this4 = this;

            var suggestions = this.suggestions.getSuggestions().slice(0, this.options.results);

            var template = this.templateParser.getParsedTemplate();
            var listItemMarkup = this.templateParser.getListItemMarkup();
            var listMarkup = "";

            suggestions.forEach(function (item) {
                var markup = _this4._buildMarkup(listItemMarkup, item);
                listMarkup = _this4._buildSuggestionListMarkup(markup, listMarkup);
            });

            var suggestionMarkup = this.templateParser.replaceHandlebars(template, "suggestion_list", listMarkup);

            this.$menu.html(suggestionMarkup);
        }
    }, {
        key: 'displayEl',
        value: function displayEl(expression) {
            try {
                return new Function("return " + expression + "? true : false")();
            } catch (e) {
                _util2.default.logger(this.options.debug, 'Invalid "sb-show" expression in template. Remember to wrap any strings in quotes even if they are template items.', 'warn');
            }
        }

        /*
         * Highlights parts of the suggestion that match the given input and pattern
         * @param string suggestion
         */

    }, {
        key: 'highlightMatches',
        value: function highlightMatches(suggestion) {
            // Replace all 
            var filterPattern = this.templateParser.replaceHandlebars(this.options.filter, "INPUT", this.inputEl.val());
            return suggestion.replace(new RegExp(filterPattern, 'gi'), '<b>$&</b>');
        }

        /**
         * Selects the suggestion at the given position
         * @param int position
         * @param bool scroll
         */

    }, {
        key: 'select',
        value: function select(position, scroll) {
            _get(SuggestionList.prototype.__proto__ || Object.getPrototypeOf(SuggestionList.prototype), 'select', this).call(this, position, scroll);

            var value = this.typeahead.getTypeahead(position);
            this.typeahead.updateTypeahead(value, this.suggestions.getSuggestions()[position]);
        }

        /**
         * Moves the selection down to the next suggestion
         * @param bool scroll
         */

    }, {
        key: 'moveDown',
        value: function moveDown(scroll) {
            var listSize = this.$menu.find('#suggestion-list > li').length;

            /*        if (!this.isOpen() && this.suggestions.getSuggestions().length > 0) {
                        //this.show();
                        console.log('show!')
                    } else */if (this.selectedLi === listSize - 1) {
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
         * @param bool scroll
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
                this.selectedLi = this.$menu.find('#suggestion-list > li').length - 1;
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
         * Events for when the mouse leaves the suggestion box
         * @param e
         */

    }, {
        key: 'mouseoutEvents',
        value: function mouseoutEvents(e) {
            _get(SuggestionList.prototype.__proto__ || Object.getPrototypeOf(SuggestionList.prototype), 'mouseoutEvents', this).call(this, e);

            if (this.isSuggestion(e) && !this.autoScrolled) {
                this.unselect(this.selectedLi);
                this.resetSelection();
            } else if ($(':focus').attr('id') !== this.inputEl.attr('id')) {
                // We're out of the suggestion box so re-focus on search
                this.inputEl.focus();
            }
            this.mouseHover = false;
        }

        /**
         * Performs the click action, this can be called for any event you want to recreate a click action for.
         * @param Event event
         */

    }, {
        key: 'doClick',
        value: function doClick(event) {
            _get(SuggestionList.prototype.__proto__ || Object.getPrototypeOf(SuggestionList.prototype), 'doClick', this).call(this, event);

            var suggestion = this.suggestions.getSuggestions()[this.selectedLi];
            var selectedEl = this.$menu.find('#suggestion-list > li:eq(' + this.selectedLi + ')');

            var value = (typeof suggestion === 'undefined' ? 'undefined' : _typeof(suggestion)) === "object" ? suggestion[this.options.searchBy] : suggestion;

            this.options.onClick(value, suggestion, event, this.inputEl, selectedEl);
            this.hide();

            // Set the isSuggestionChosen flag to true when a suggestion is selected
            this.setIsSuggestionChosen(true);

            this.typeahead.removeTypeahead();
        }

        /**
         * Returns true if a suggestion has been chosen, this flag is used during ajax calls so the menu
         *  isn't shown when new options are loaded from the server after the user has chosen an suggestion.
         */

    }, {
        key: 'isSuggestionChosen',
        value: function isSuggestionChosen() {
            return this.suggestionChosen;
        }

        /**
         * Set the suggestionChosen flag
         * @param bool suggestionChosen 
         */

    }, {
        key: 'setIsSuggestionChosen',
        value: function setIsSuggestionChosen(suggestionChosen) {
            this.suggestionChosen = suggestionChosen;
        }
    }]);

    return SuggestionList;
}(_Dropdown3.default);

exports.default = SuggestionList;

},{"./Dropdown":2,"./util":12}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Suggestions = function () {
	function Suggestions() {
		_classCallCheck(this, Suggestions);

		this.suggestions = [];
	}

	_createClass(Suggestions, [{
		key: "setSuggestions",
		value: function setSuggestions(suggestions) {
			this.suggestions = suggestions;
		}
	}, {
		key: "getSuggestions",
		value: function getSuggestions() {
			return this.suggestions;
		}
	}]);

	return Suggestions;
}();

exports.default = Suggestions;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TemplateParser = function () {
    function TemplateParser(template, debug) {
        _classCallCheck(this, TemplateParser);

        this.debug = debug || false;
        this.template = template;
        this.nodes = [];
        this.conditionals = [];

        this._getNodes();
        this._getConditionals();
        this._getTemplateForListItem();
        this._removeListItemMarkup();
        this._removeRootElement();
    }

    _createClass(TemplateParser, [{
        key: '_getTemplateForListItem',
        value: function _getTemplateForListItem() {
            var listItem = "";

            var html = $.parseHTML($.trim(this.template));
            var el = html ? html[0] : [];

            if (html.length !== 1 && this.debug) {
                _util2.default.logger(this.debug, 'Unable to parse template. Template must have one root element.', 'error');
            }

            if ((el.id !== "" || el.class !== undefined) && this.debug) {
                _util2.default.logger(this.debug, 'Avoid adding style attributes such as "class", "id" or "style" to root element in template because these tags will be stripped.', 'warn');
            }

            if (el.childNodes.length > 0) {
                $.each(el.childNodes, function (i, el) {
                    if (el.id === "suggestion-list") {
                        $.each(el.childNodes, function (i, el) {
                            if (el.nodeName === "LI") {
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
                item = item.replace(new RegExp("@?{{\\s?"), "");
                item = item.replace(new RegExp("\\s?}}"), "");
                itemNames.push(item);
            });

            return itemNames;
        }
    }, {
        key: '_getConditionals',
        value: function _getConditionals() {
            var _this = this;

            this.nodes.forEach(function (node) {
                if (node.attributes.length > 0) {
                    for (var i = 0; i < node.attributes.length; i++) {
                        if (node.attributes[i].nodeName === "sb-show") {
                            var id = $(node).attr('id') || 'sb' + Math.floor(Math.random() * 10000000);

                            // Add the id to the template
                            _this.template = _this.template.replace($(node)[0].outerHTML, $(node).attr('id', id)[0].outerHTML);
                            _this.conditionals.push({ 'id': id });
                        }
                    }
                }
            });
        }
    }, {
        key: 'getConditional',
        value: function getConditional(id) {
            for (var key in this.conditionals) {
                if (this.conditionals[key].id === id) {
                    return this.conditionals[key];
                }
            }

            return false;
        }
    }, {
        key: 'getConditionals',
        value: function getConditionals() {
            return this.conditionals;
        }
    }, {
        key: '_getNodes',
        value: function _getNodes(node) {
            var _this2 = this;

            if (!node) {
                var html = $.parseHTML($.trim(this.template));
                var node = html ? html[0] : [];
            }

            $.each(node.childNodes, function (i, el) {
                if (el.childNodes.length > 0) {
                    _this2.nodes.push(el);
                    _this2._getNodes(el);
                }
            });
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
    }, {
        key: 'setDebug',
        value: function setDebug(debug) {
            this.debug = debug;
        }
    }]);

    return TemplateParser;
}();

exports.default = TemplateParser;

},{"./util.js":12}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require("./util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Typeahead = function () {
    function Typeahead(suggestions, searchBy) {
        _classCallCheck(this, Typeahead);

        this.suggestions = suggestions;
        this.searchBy = searchBy;
    }

    _createClass(Typeahead, [{
        key: "setCurrentInput",
        value: function setCurrentInput(currentInput) {
            this.currentInput = currentInput;
        }
    }, {
        key: "getTypeahead",
        value: function getTypeahead(selectedItemIndex) {
            // If the suggestion box has an item selected get the item at that index instead.
            var index = selectedItemIndex > -1 ? selectedItemIndex : 0;
            var suggestion = this.suggestions.getSuggestions()[index] || "";

            suggestion = (typeof suggestion === "undefined" ? "undefined" : _typeof(suggestion)) == "object" ? suggestion[this.searchBy] : suggestion;

            var regex = new RegExp("^" + this.currentInput, "i");
            // Simply match the case of the typeahead to the case the user typed
            var typeahead = suggestion.replace(regex, this.currentInput);

            return typeahead;
        }
    }, {
        key: "removeTypeahead",
        value: function removeTypeahead() {
            this.updateTypeahead("");
        }
    }, {
        key: "updateTypeaheadPosition",
        value: function updateTypeaheadPosition(inputEl) {

            var top = _util2.default.getCssValue(inputEl, 'padding-top') + _util2.default.getCssValue(inputEl, 'border-top-width') + _util2.default.getCssValue(inputEl, 'top');
            var left = _util2.default.getCssValue(inputEl, 'padding-left') + _util2.default.getCssValue(inputEl, 'border-left-width') + inputEl.position().left;

            $("#suggestion-box-dynamic-typeahead").html('#suggestion-box-typeahead::after{left:' + left + 'px;top:' + top + 'px;}');
        }
    }, {
        key: "updateTypeahead",
        value: function updateTypeahead(value) {
            $("#suggestion-box-typeahead").attr('data-placeholder', value);
        }
    }, {
        key: "setSearchBy",
        value: function setSearchBy(searchBy) {
            this.searchBy = searchBy;
        }
    }]);

    return Typeahead;
}();

exports.default = Typeahead;

},{"./util.js":12}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    'ENTER_KEY': 13,
    'UP_ARROW_KEY': 38,
    'DOWN_ARROW_KEY': 40,
    'ESCAPE_KEY': 27,
    'CTRL_KEY': 17
};

},{}],8:[function(require,module,exports){
'use strict';

var _suggestionBox = require('./suggestionBox.js');

var _suggestionBox2 = _interopRequireDefault(_suggestionBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function ($) {
    $.fn.suggestionBox = function (options) {
        // Get the bound dom element
        var domElement = $(this).get()[0];

        var suggestionBox = $.data(domElement, 'suggestionBox');

        if (!suggestionBox) {
            suggestionBox = new _suggestionBox2.default(options, this);
            $.data(domElement, 'suggestionBox', suggestionBox);
        }

        return suggestionBox;
    };
})(jQuery);

},{"./suggestionBox.js":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: [],
    template: '',
    searchBy: 'suggestion',
    url: '',
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
    prefetch: false,
    results: 10,
    widthType: 'width', // Pass a css width attr (i.e. 'width', 'min-width')
    filter: "^{{INPUT}}",
    typeahead: false,
    highlightMatch: false,
    paramName: 'search',
    scrollable: false,
    debug: false,
    onClick: function onClick(value, obj, event, inputEl, selectedEl) {
        inputEl.val(value);
    },
    //height: 50,
    customEvents: {
        close: 'suggestion-list.close',
        show: 'suggestion-list.show',
        loading: 'suggestion-box.loading',
        ajaxError: 'suggestion-box.ajax.error',
        ajaxSuccess: 'suggestion-box.ajax.success',
        noSuggestions: 'suggestion-box.no-suggestions'
    }
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SuggestionList = require('./SuggestionList.js');

var _SuggestionList2 = _interopRequireDefault(_SuggestionList);

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

var _keys = require('./constants/keys.js');

var _keys2 = _interopRequireDefault(_keys);

var _Anubis = require('./Anubis.js');

var _Anubis2 = _interopRequireDefault(_Anubis);

var _TemplateParser = require('./TemplateParser.js');

var _TemplateParser2 = _interopRequireDefault(_TemplateParser);

var _Typeahead = require('./Typeahead.js');

var _Typeahead2 = _interopRequireDefault(_Typeahead);

var _Suggestions = require('./Suggestions.js');

var _Suggestions2 = _interopRequireDefault(_Suggestions);

var _options = require('./options.js');

var _options2 = _interopRequireDefault(_options);

var _template = require('./template.js');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SuggestionBox = function () {
    function SuggestionBox(options, context) {
        var _this = this;

        _classCallCheck(this, SuggestionBox);

        this.context = context;

        this.search = this.context.val();

        this._defaults = JSON.parse(JSON.stringify(_options2.default));

        this.options = $.extend(_options2.default, options);

        this.perpetualFetch = this.options.fetchEvery !== -1 ? true : false;
        this.fetchRate = this.options.fetchAfter;
        this.endFetch = false;
        this.pending = false;

        this._checkFilterForTypeahead();
        // load default template into options 
        this.templateParser = this._buildTemplate();

        this._initAnubis();

        this.suggestions = new _Suggestions2.default();

        this.typeahead = new _Typeahead2.default(this.suggestions, this.options.searchBy);
        this.suggestionList = new _SuggestionList2.default(this.context, this.templateParser, this.options, this.typeahead, this.suggestions);

        this.context.on('keyup', this._keyupEvents.bind(this));
        this.context.on('blur', this._blurEvents.bind(this));
        this.context.on('focus', this._focusEvents.bind(this));
        this.context.on('keydown', this._keydownEvents.bind(this));
        this.context.on('paste', this._pasteEvents.bind(this));

        // Set up typeahead option
        this._initTypeahead();
        this.autocomplete = this.context.attr('autocomplete');

        this.context.attr('autocomplete', 'off');

        this.radiusDefaults = {
            bottomLeft: _util2.default.getCssValue(this.context, 'border-bottom-right-radius'),
            bottomRight: _util2.default.getCssValue(this.context, 'border-bottom-right-radius')
        };

        // Preload the loading image if it has been supplied so it loads faster!
        if (this.options.loadImage) {
            $('<img/>')[0].src = this.options.loadImage;
        }

        // If we are prefetching our data
        if (this.options.prefetch) {
            this.updateSuggestions(this.context.val(), true);
        }

        $(document).on('suggestion-list.close', function () {
            _util2.default.applyBorderRadius(_this.context, _this.radiusDefaults.bottomLeft, _this.radiusDefaults.bottomRight);
        });

        $(document).on(this.options.customEvents.loading, function (e, status) {
            if (status === true) {
                _this.context.css('background', "url('" + _this.options.loadImage + "') no-repeat 99% 50%");
            } else {
                _this.context.css('background', "");
            }
        });
    }

    /*
     * Updates the suggestion list
     * @param search - The search string for finding suggestions
     * @param forceFetch -   set to true to fetch suggestions regardless of input (used internally for prefetching)
     */


    _createClass(SuggestionBox, [{
        key: 'updateSuggestions',
        value: function updateSuggestions(search, forceFetch) {
            var _this2 = this;

            this.anubis.setSearch(search);

            if (search == "" && !forceFetch) {
                this.anubis.clearLastSearch();
                this.hideSuggestions();
            } else {
                if (this.options.url.length > 0 && !this.pending && (this.anubis.getLastSearch().length > search.length || this.anubis.getLastSearch().length === 0) && !this.endFetch || this.perpetualFetch) {

                    this.anubis.setSearch(search);
                    this.pending = true;
                    //   this.context.css('background', "url('" + this.options.loadImage + "') no-repeat 99% 50%");
                    $.event.trigger(this.options.customEvents.loading, true);
                    setTimeout(function () {
                        _this2.loadSuggestionData(forceFetch);
                    }, this.fetchRate);

                    this.endFetch = this.options.fetchOnce;

                    if (this.perpetualFetch) {
                        // make sure we continue to filter
                        this.showSuggestions();
                        this.fetchRate = this.options.fetchEvery;
                    }
                } else {
                    this.showSuggestions();
                }
            }
        }

        /*
         * loads the suggestion data from the server
         * @param forceFetch - set to true to force the fetch (used for prefetch when search value is empty)
         */

    }, {
        key: 'loadSuggestionData',
        value: function loadSuggestionData(forceFetch) {
            // Don't bother fetching data we already have again
            if (this.anubis.getLastSearch() !== this.anubis.getSearch() || forceFetch) {
                this.anubis.fetchSuggestions(this.options.url, this._fetchSuggestionsCallback());
            } else {
                this.context.css('background', "");
                this.pending = false;
            }
        }

        /*
         * Show the suggestions list
         */

    }, {
        key: 'showSuggestions',
        value: function showSuggestions() {
            // Set the suggesation (SuggestionList holds a reference to this object)
            this.suggestions.setSuggestions(this.anubis.getSuggestions());

            // Don't show an empty list
            if (this.suggestions.getSuggestions().length > 0) {

                var borders = _util2.default.calculateVerticalBorderWidth(this.context);
                var padding = _util2.default.calculateVerticalPadding(this.context);
                var offset = this.context.offset();

                this.suggestionList.updatePosition(offset.left + this.options.leftOffset, offset.top + (this.context.height() + borders + padding + this.options.topOffset));
                this.suggestionList.setWidth(this.getSearchBoxWidth() + this.options.widthAdjustment);

                this.typeahead.updateTypeaheadPosition(this.context);

                if (this.options.adjustBorderRadius) {
                    _util2.default.applyBorderRadius(this.context, 0, 0);
                }

                this.suggestionList.show();
            } else {
                $.event.trigger(this.options.customEvents.noSuggestions);
                this.hideSuggestions();
            }
        }

        /**
         * Returns the width of the search box
         * @returns {number}
         */

    }, {
        key: 'getSearchBoxWidth',
        value: function getSearchBoxWidth() {
            return this.context.width() + _util2.default.getCssValue(this.context, 'border-left-width') + _util2.default.getCssValue(this.context, 'border-right-width') + _util2.default.getCssValue(this.context, 'padding-left') + _util2.default.getCssValue(this.context, 'padding-right');
        }

        /**
         * Hides the suggestion list
         */

    }, {
        key: 'hideSuggestions',
        value: function hideSuggestions() {
            this.typeahead.removeTypeahead();
            this.suggestionList.hide();
            this.suggestions.setSuggestions([]);
        }

        /**
         * The actions to perform when data has been successfully fetched from the server
         */

    }, {
        key: '_fetchSuggestionsCallback',
        value: function _fetchSuggestionsCallback() {
            var _this3 = this;

            return function (data) {
                _this3.anubis.setData(data);

                // Only show if a selection was not made while wating for a response
                if (!_this3.suggestionList.isSuggestionChosen() && _this3.anubis.getSearch().length > 0) {
                    _this3.showSuggestions();
                } else {
                    _this3.hideSuggestions();
                }

                _this3.suggestionList.setIsSuggestionChosen(false);
                _this3.pending = false;

                $.event.trigger(_this3.options.customEvents.loading, [false]);
                $.event.trigger(_this3.options.customEvents.ajaxSuccess, [data]);
            };
        }

        /*
         * Applies the give border-radius to the search input, used when diosplaying suggestion list
         * with an input that has a border radius.
         */

    }, {
        key: '_applyBorderRadius',
        value: function _applyBorderRadius(left, right) {
            this.context.css('border-bottom-left-radius', left);
            this.context.css('border-bottom-right-radius', right);
        }

        /*
         * Checks that the filter pattern is suitable for uisng typeahed and throw out a warning if it is not.
         */

    }, {
        key: '_checkFilterForTypeahead',
        value: function _checkFilterForTypeahead() {
            if (this.options.filter !== "^{{INPUT}}" && this.options.typeahead) {
                _util2.default.logger(this.options.debug, 'Using a custom filter pattern with the typeahed option can cause unexpected results', 'warn');
            }
        }

        /**
         *  Destroy the suggestionBox
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            // Remove reference to this suggestionBox instance from data
            $.removeData(this.context.get()[0], 'suggestionBox');

            // remove event handlers
            this.context.unbind('keyup');
            this.context.unbind('blur');
            this.context.unbind('focus');
            this.context.unbind('keydown');
            this.context.unbind('paste');

            // destroy the suggestionList
            this.suggestionList.destroy();

            // remove typeahead
            this.context.unwrap("#suggestion-box-typeahead");
            // remove injected typeahed css
            $("#suggestion-box-dynamic-typeahead").remove();

            // reset autocomplete to it's initial value
            this.context.attr('autocomplete', this.autocomplete);

            // delete class instances
            delete this.anubis;
            delete this.typeahead;
            delete this.suggestionList;

            // Remove the loading spinner
            this.context.css('background', "");

            // reset default options, $.extend overwrites defaultOptions which are global, 
            // so re-overwrite the ones set here to the orignal defaults.
            $.extend(_options2.default, this._defaults);
        }

        /*
         * Returns the template as a string
         * @return {String}
         */

    }, {
        key: '_buildTemplate',
        value: function _buildTemplate() {
            var template = _util2.default.isId(this.options.template) ? $(this.options.template).html() : this.options.template;
            template = !template ? _template2.default : template;
            return new _TemplateParser2.default(template, this.options.debug);
        }

        /**
         * Returns the Anubis object
         * @return {Anubis}
         */

    }, {
        key: 'getAnubis',
        value: function getAnubis() {
            return this.anubis;
        }

        /**
         * Sets the Anubis object
         * @param {Anubis} anubis
         */

    }, {
        key: 'setAnubis',
        value: function setAnubis(anubis) {
            this.anubis = anubis;
        }
    }, {
        key: 'getSuggestionList',
        value: function getSuggestionList() {
            return this.suggestionList;
        }
    }, {
        key: 'setSuggestionList',
        value: function setSuggestionList(suggestionList) {
            this.suggestionList = suggestionList;
        }
    }, {
        key: 'getTypeahead',
        value: function getTypeahead() {
            return this.typeahead;
        }
    }, {
        key: 'setTypeahead',
        value: function setTypeahead(typeahead) {
            this.typeahead = typeahead;
        }
    }, {
        key: 'getTemplateParser',
        value: function getTemplateParser() {
            return this.templateParser;
        }
    }, {
        key: 'setTemplateParser',
        value: function setTemplateParser(templateParser) {
            this.templateParser = templateParser;
        }

        /**
         * Instantiates the Anubis object with basic setup.
         */

    }, {
        key: '_initAnubis',
        value: function _initAnubis() {
            this.anubis = new _Anubis2.default(this.options.searchBy, this.options.filter, this.options.sort, this.options.paramName, this.options.customEvents.ajaxError);
            this.anubis.setData(this.options.data);
        }

        /**
         * Creates the typeahead Markup and injects it into the page
         */

    }, {
        key: '_initTypeahead',
        value: function _initTypeahead() {
            if (this.options.typeahead) {
                this.context.wrap('<div id="suggestion-box-typeahead" data-placeholder=""></div>');
                var top = _util2.default.getCssValue(this.context, 'padding-top') + _util2.default.getCssValue(this.context, 'border-top-width');
                var left = _util2.default.getCssValue(this.context, 'padding-left') + _util2.default.getCssValue(this.context, 'border-left-width');
                $("head").append('<style id="suggestion-box-dynamic-typeahead">#suggestion-box-typeahead::after{left:' + left + 'px;top:' + top + 'px;}</style>');
            }
        }

        /**
         * Clears the last suggestion and updates the suggestions list, useful for `ctrl+v` paste
         * when a user highlights the current text and pastes new text over the top.
         * @param search - The new search for the suggestion list
         */

    }, {
        key: 'clearAndUpdate',
        value: function clearAndUpdate(search) {
            this.suggestions.setSuggestions([]);
            this.anubis.clearLastSearch();
            this.updateSuggestions(search, false);
        }

        /*
         * Updates the typeahead
         */

    }, {
        key: 'updateTypeahead',
        value: function updateTypeahead() {
            if (this.context.val() !== "") {
                var selectedIndex = this.suggestionList.getSelectedItemIndex();

                this.typeahead.setCurrentInput(this.context.val());
                var value = this.typeahead.getTypeahead(selectedIndex);

                this.typeahead.updateTypeahead(value, this.context.val());
            }
        }

        /**
         * Set method for setting data option (automagically called via set())
         */

    }, {
        key: '_setData',
        value: function _setData(data) {
            this.options.data = data;
            this.anubis.setData(data);
            //this.getSuggestions();
        }

        /**
         * Set method for setting search option (automagically called via set())
         */

    }, {
        key: '_setSearchBy',
        value: function _setSearchBy(searchBy) {
            this.options.searchBy = searchBy;
            this.anubis.setSearchBy(searchBy);

            this.typeahead.setSearchBy(searchBy);
        }

        /**
         * Set method for setting filter option (automagically called via set())
         */

    }, {
        key: '_setFilter',
        value: function _setFilter(filter) {
            this.options.filter = filter;
            this.anubis.setFilter(filter);
            this._checkFilterForTypeahead();
        }

        /**
         * Set method for setting sort option (automagically called via set())
         */

    }, {
        key: '_setSort',
        value: function _setSort(sort) {
            this.options.sort = sort;
            this.anubis.setSort(sort);
        }

        /**
         * Set method for setting template option (automagically called via set())
         */

    }, {
        key: '_setTemplate',
        value: function _setTemplate(template) {
            this.options.template = template;
            this.templateParser = this._buildTemplate();
            this.suggestionList.setTemplate(this.templateParser);
        }

        /**
         * Set method for setting debug option (automagically called via set())
         */

    }, {
        key: '_setDebug',
        value: function _setDebug(debug) {
            this.options.debug = debug;
            this.templateParser.setDebug(debug);
        }

        /**
         * The set method for setting options after SUggestionBox has been instantiated
         */

    }, {
        key: 'set',
        value: function set(name, value) {
            // check if a function exists to set this option, and map the request, otherwise just set it as normal
            var funcName = '_set' + name.charAt(0).toUpperCase() + name.slice(1);
            if (typeof this[funcName] === "function") {
                this[funcName].call(this, value);
            } else {
                this.options[name] = value;
                this.suggestionList.buildDom();
                this._checkFilterForTypeahead();
            }
        }

        /**
         * Returns the options object
         */

    }, {
        key: 'getOptions',
        value: function getOptions() {
            return this.options;
        }
    }, {
        key: '_keyupEvents',
        value: function _keyupEvents(e) {
            if (!this._isReservedKey(e)) {
                this.getSuggestions();
                this.updateTypeahead();
                this.suggestionList.setIsSuggestionChosen(false);
            }
        }
    }, {
        key: '_keydownEvents',
        value: function _keydownEvents(e) {
            if (e.which == _keys2.default.DOWN_ARROW_KEY) {
                e.preventDefault();

                this.anubis.setSearch(this.context.val());

                this.suggestionList.moveDown(true);
                this.updateTypeahead();
                this.showSuggestions();
            }
            if (this.suggestionList.isOpen()) {
                if (e.which == _keys2.default.UP_ARROW_KEY) {
                    e.preventDefault();
                    this.suggestionList.moveUp(true);
                    this.updateTypeahead();
                }
                if (e.which === _keys2.default.ENTER_KEY) {
                    e.preventDefault();
                    this.suggestionList.doClick(e);
                }
                if (e.which == _keys2.default.ESCAPE_KEY) {
                    e.preventDefault();
                    $.event.trigger(this.options.customEvents.loading, false);
                    this.hideSuggestions();
                }
            }
        }
    }, {
        key: 'getSuggestions',
        value: function getSuggestions() {
            this.updateSuggestions(this.context.val(), false);
        }

        /**
         * Events for when the search box is focused
         */

    }, {
        key: '_focusEvents',
        value: function _focusEvents() {
            this.anubis.setSearch(this.context.val());
            this.showSuggestions();
        }

        /**
         * Events for when the search box loses focus
         */

    }, {
        key: '_blurEvents',
        value: function _blurEvents() {
            if (!this.suggestionList.isHovering()) {
                $.event.trigger(this.options.customEvents.loading, false);
                this.hideSuggestions();
            }
        }

        /**
         * Events for when text is pasted in to the search box
         */

    }, {
        key: '_pasteEvents',
        value: function _pasteEvents() {
            var _this4 = this;

            // Simulate keyup after 200ms otherwise the value of the search box will not be available
            setTimeout(function () {
                _this4.clearAndUpdate(_this4.context.val());
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

},{"./Anubis.js":1,"./SuggestionList.js":3,"./Suggestions.js":4,"./TemplateParser.js":5,"./Typeahead.js":6,"./constants/keys.js":7,"./options.js":9,"./template.js":11,"./util.js":12}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});
var template = '<div>' + '<ul id="suggestion-list" class="suggestion-box-list">' + '<li>' + '<a href="#">{{suggestion}}</a>' + '</li>' + '</ul>' + '</div>';

exports.default = template;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: 'getCssValue',
        value: function getCssValue(el, name) {
            var value = parseInt(el.css(name).replace('px', ''));
            return isNaN(value) ? 0 : value;
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
    }, {
        key: 'logger',
        value: function logger(debug, message, type) {
            if (debug) {
                if (type === 'error') {
                    console.log('%c[Suggestion-Box Error] ' + message, 'color: #f00');
                } else {
                    console.log('[suggestion-box ' + type + '] ' + message);
                }
            }
        }

        /*
         * Applies the give border-radius to the search input, used when diosplaying suggestion list
         * with an input that has a border radius.
         */

    }, {
        key: 'applyBorderRadius',
        value: function applyBorderRadius(el, left, right) {
            el.css('border-bottom-left-radius', left);
            el.css('border-bottom-right-radius', right);
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

},{}]},{},[8]);

//# sourceMappingURL=main.js.map
