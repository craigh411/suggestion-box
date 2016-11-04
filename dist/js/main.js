(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

        console.log(this.regex);
    }

    _createClass(Anubis, [{
        key: 'setData',
        value: function setData(data) {
            this.data = data;
        }
    }, {
        key: 'getSuggestions',
        value: function getSuggestions() {
            return this.filterData();
        }
    }, {
        key: 'setSearch',
        value: function setSearch(search) {
            // Escape any regex patterns is search string
            var santizedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            this.search = santizedSearch;
        }
    }, {
        key: 'formatData',
        value: function formatData() {}
    }, {
        key: 'filterData',
        value: function filterData() {
            var _this = this;

            var filterPattern = this.regex.replace('{{INPUT}}', this.search);
            var regex = new RegExp(filterPattern, "i");
            var results = [];

            if (this.data && this.search.length > 0) {
                results = $.grep(this.data, function (item) {
                    return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" ? regex.test(item[_this.searchBy]) : regex.test(item);
                });
            }

            this.sortData(results);

            return results;
        }
    }, {
        key: 'sortData',
        value: function sortData(data) {
            data.sort(this.sort);
        }
    }], [{
        key: 'factory',
        value: function factory() {
            return new Anubis('suggestion', '{{INPUT}}');
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
    function SuggestionListDropdown(inputEl, template) {
        _classCallCheck(this, SuggestionListDropdown);

        this.inputEl = inputEl;
        this.template = template;

        this.templateParser = new _TemplateParser2.default(template);

        this.topOffset = 0;
        this.leftOffset = 0;
        this.zIndex = 10000;
        this.setRandId();
        this._buildDom();
    }

    _createClass(SuggestionListDropdown, [{
        key: '_buildDom',
        value: function _buildDom() {
            this.$suggestionBox = (0, _jQuery2.default)('<div id="' + this.randId + '" class="suggestion-box"></div>').appendTo('body');
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
                'zIndex': this.zIndex,
                'left': offset.left + this.leftOffset,
                'top': offset.top + (this.inputEl.height() + borders + padding + this.topOffset)
            });
        }

        /*
         * Show the suggestion box
         */

    }, {
        key: 'show',
        value: function show() {
            this.updatePosition();
            this.setWidth();
            this.renderSuggestionsList();
            this.$suggestionBox.css('display', 'block');
        }

        /**
         * Sets the width of the suggestion box
         */

    }, {
        key: 'setWidth',
        value: function setWidth() {
            var searchBoxWidth = this.getSearchBoxWidth() - _util2.default.calculateHorizontalBorders(this.$suggestionBox);
            this.$suggestionBox.css({
                'min-width': searchBoxWidth
            });

            /*       let searchBoxWidth = this.getSearchBoxWidth() + options.widthAdjustment;
                      if (options.menuWidth == 'auto') {
                        $suggestionBox.css({
                            'min-width': searchBoxWidth
                        });
                    } else if (options.menuWidth == 'constrain') {
                        $suggestionBox.css({
                            'width': searchBoxWidth
                        });
                    }*/
        }
    }, {
        key: 'setSuggestions',
        value: function setSuggestions(suggestions) {
            this.suggestions = suggestions;
        }
    }, {
        key: 'getSuggestions',
        value: function getSuggestions() {
            return this.suggestions;
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
            this.$suggestionBox.css('display', 'none');;
        }
    }, {
        key: 'renderSuggestionsList',
        value: function renderSuggestionsList() {
            var _this = this;

            var heading = 'Suggestions';
            var suggestions = this.suggestions.slice(0, 10);

            var template = this.templateParser.getParsedTemplate();
            template = this.templateParser.replaceHandlebars(template, "header", heading);

            var listItemMarkup = this.templateParser.getListItemMarkup();
            var listMarkup = "";

            suggestions.forEach(function (item) {
                var suggestion = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) == "object" ? item.suggestion : item;
                var markup = _this.templateParser.replaceHandlebars(listItemMarkup, "suggestion", suggestion);
                markup = _this.templateParser.replaceHandlebars(markup, "url", "#");

                listMarkup += "<li>";
                listMarkup += markup;
                listMarkup += "</li>";
            });

            var suggestionMarkup = this.templateParser.replaceHandlebars(template, "suggestion_list", listMarkup);

            this.$suggestionBox.html(suggestionMarkup);
        }
    }, {
        key: 'getLeftOffset',
        value: function getLeftOffset() {
            return this.leftOffset;
        }
    }, {
        key: 'setLeftOffset',
        value: function setLeftOffset(offset) {
            this.leftOffset = offset;
        }
    }, {
        key: 'getTopOffset',
        value: function getTopOffset() {
            return this.topOffset;
        }
    }, {
        key: 'setTopOffset',
        value: function setTopOffset(offset) {
            this.topOffset = offset;
        }
    }, {
        key: 'setZIndex',
        value: function setZIndex(zIndex) {
            this.zIndex = zIndex;
        }
    }, {
        key: 'getZIndex',
        value: function getZIndex() {
            return this.zIndex;
        }
    }, {
        key: 'getId',
        value: function getId() {
            return this.Id;
        }
    }, {
        key: 'setId',
        value: function setId(id) {
            this.Id = id;
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
},{"./TemplateParser":3,"./util":8}],3:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
},{"./suggestion-box.js":7}],6:[function(require,module,exports){
'use strict';

module.exports = {
  data: [],
  template: '#suggestion-box-template',
  props: {
    value: 'suggestion',
    url: 'url',
    custom: []
  },
  sort: function sort() {},
  topOffset: 0,
  leftOffset: 0,
  zIndex: 10000,
  hideOnExactMatch: false,
  isSelectionBox: false,
  loadImage: null,
  widthAdjustment: 10,
  delay: 250, // in ms
  heading: 'Suggestions',
  results: 10,
  fadeIn: true,
  fadeOut: false,
  menuWidth: 'auto',
  showNoSuggestionsMessage: false,
  noSuggestionsMessage: 'No Suggestions Found',
  filter: "{{INPUT}}",
  highlightMatch: false,
  adjustBorderRadius: true,
  ajaxError: function ajaxError() {},
  ajaxSuccess: function ajaxSuccess() {},
  onClick: function onClick() {
    goToSelection();
    hideSuggestionBox();
    context.val('');
  },
  onShow: function onShow() {},
  onHide: function onHide() {},
  paramName: 'search',
  customData: [],
  scrollable: false,
  noConflict: false
};

},{}],7:[function(require,module,exports){
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
        this.active = false;
        this.mouseHover = false;
        this.search = this.context.val();
        this.suggestions = [];

        this.options = _jQuery2.default.extend(_options2.default, options);

        // get loaddefault template into options 
        var template = _util2.default.isId(this.options.template) ? (0, _jQuery2.default)(this.options.template).html() : this.options.template;

        this.dropdown = new _SuggestionListDropdown2.default(this.context, template);
        this.anubis = new _Anubis2.default(this.options.props.value, this.options.filter, this.options.sort);
        this.anubis.setData(this.options.data);

        this.context.on('keyup', this.keyupEvents.bind(this));
        this.context.on('blur', this.blurEvents.bind(this));
        this.context.on('focus', this.focusEvents.bind(this));
    }

    _createClass(SuggestionBox, [{
        key: 'keyupEvents',
        value: function keyupEvents(e) {
            this.search = this.context.val();
            if (!this._isReservedKey(e)) {

                this.anubis.setSearch(this.search);

                this.suggestions = this.anubis.getSuggestions();

                if (this.suggestions.length > 0) {
                    this.dropdown.setSuggestions(this.suggestions);
                    this.dropdown.show();
                } else {
                    this.dropdown.hide();
                }
                console.log(this.suggestions);
            }
        }

        /**
         * Events for when the search box is focused
         */

    }, {
        key: 'focusEvents',
        value: function focusEvents() {
            this.active = true;
            console.log(this.active);
            if (this.suggestions.length > 0) {
                this.dropdown.setSuggestions(this.suggestions);
                this.dropdown.show();
            }
        }

        /**
         * Events for when the search box loses focus
         */

    }, {
        key: 'blurEvents',
        value: function blurEvents() {
            this.active = false;
            if (!this.mouseHover) {
                this.dropdown.hide();
            }
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
},{"./Anubis.js":1,"./SuggestionListDropdown.js":2,"./constants/keys.js":4,"./options.js":6,"./util.js":8}],8:[function(require,module,exports){
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
    }]);

    return Util;
}();

exports.default = Util;

},{}]},{},[5]);

//# sourceMappingURL=main.js.map
