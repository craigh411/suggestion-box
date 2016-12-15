(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Anubis = function () {
    function Anubis(searchBy, filter, sort, param, customParams, root, ajaxErrorEvent) {
        _classCallCheck(this, Anubis);

        this.searchBy = searchBy;
        this.filter = filter;
        this.sort = sort;
        this.search = "";
        this.customParams = customParams || {};
        this.param = param || 'search';
        this.lastSearch = "";
        this.root = root || "";
        this.ajaxErrorEvent = ajaxErrorEvent || 'suggestion-box.ajax.error';
    }

    _createClass(Anubis, [{
        key: 'setDataRoot',
        value: function setDataRoot(root) {
            this.root = root;
        }
    }, {
        key: 'getDataRoot',
        value: function getDataRoot() {
            return this.root;
        }
    }, {
        key: 'setData',
        value: function setData(data) {
            if (this.root.length > 0) {
                var dataRoot = this.root.split(".");
                // Set the data at the given root
                for (var i = 0; i < dataRoot.length; i++) {
                    data = data[dataRoot[i]] ? data[dataRoot[i]] : [];
                }
            }

            this.data = data;
        }
    }, {
        key: 'getData',
        value: function getData() {
            return this.data;
        }
    }, {
        key: 'setSearchBy',
        value: function setSearchBy(searchBy) {
            this.searchBy = searchBy;
        }
    }, {
        key: 'getSearchBy',
        value: function getSearchBy() {
            return this.searchBy;
        }
    }, {
        key: 'setCustomParams',
        value: function setCustomParams(params) {
            this.customParams = params;
        }
    }, {
        key: 'getCustomParams',
        value: function getCustomParams() {
            return this.customParams;
        }
    }, {
        key: 'getSuggestions',
        value: function getSuggestions() {
            return this.filterData();
        }
    }, {
        key: 'setSearch',
        value: function setSearch(search) {
            // Escape any regex patterns as search string
            var santizedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            this.search = santizedSearch;
        }
    }, {
        key: 'getSearch',
        value: function getSearch() {
            return this.search;
        }
    }, {
        key: 'setFilter',
        value: function setFilter(filter) {
            this.filter = filter;
        }
    }, {
        key: 'getFilter',
        value: function getFilter() {
            return this.filter;
        }
    }, {
        key: 'setSort',
        value: function setSort(sort) {
            this.sort = sort;
        }
    }, {
        key: 'getSort',
        value: function getSort() {
            return this.sort;
        }
    }, {
        key: 'getSearchParam',
        value: function getSearchParam() {
            var searchBy = this.searchBy.split(".");
            return typeof searchBy === "String" ? searchBy : searchBy[searchBy.length - 1];
        }
    }, {
        key: 'filterData',
        value: function filterData() {
            var _this = this;

            var filterPattern = this.filter.replace('{{INPUT}}', this.search);
            var regex = new RegExp(filterPattern, "i");
            var results = [];

            if (this.data && this.search.length > 0) {
                results = $.grep(this.data, function (item) {
                    if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object") {
                        var searchData = _util2.default.getValueByStringAttributes(_this.searchBy, item);

                        for (var i = 0; i <= searchData.length; i++) {
                            if (regex.test(searchData[i])) {
                                return true;
                            }
                        }

                        return false;
                    }

                    return regex.test(item);
                });
            }

            results = this.sortData(results);

            return results;
        }
    }, {
        key: 'sortData',
        value: function sortData(data) {
            return data.sort(this.sort);
        }
    }, {
        key: 'getParam',
        value: function getParam() {
            return this.param;
        }
    }, {
        key: 'setParam',
        value: function setParam(param) {
            this.param = param;
        }
    }, {
        key: 'getLastSearch',
        value: function getLastSearch() {
            return this.lastSearch;
        }
    }, {
        key: 'clearLastSearch',
        value: function clearLastSearch() {
            this.lastSearch = "";
        }
    }, {
        key: 'killCurrentFetch',
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
        key: 'fetchSuggestions',
        value: function fetchSuggestions(url, callback) {
            var _this2 = this;

            this.lastSearch = this.search;

            // Kill any current ajax connections.
            this.killCurrentFetch();
            // Set up the search param
            var request = this.customParams;
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

},{"./util.js":3}],2:[function(require,module,exports){
'use strict';

window.Anubis = require('../Anubis.js').default;

},{"../Anubis.js":1}],3:[function(require,module,exports){
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

        /*
         * Retuns the value at the given attribute. An attribute can look like: 'artists[0].name'
         * @param {string} attrs - The string attributes you want to get the value for.
         * @param {array} data - the data to search
         * @retun {array} - An array of results for the given query
         */

    }, {
        key: 'getValueByStringAttributes',
        value: function (_getValueByStringAttributes) {
            function getValueByStringAttributes(_x, _x2) {
                return _getValueByStringAttributes.apply(this, arguments);
            }

            getValueByStringAttributes.toString = function () {
                return _getValueByStringAttributes.toString();
            };

            return getValueByStringAttributes;
        }(function (attrs, data) {
            attrs = Array.isArray(attrs) ? attrs : attrs.split(".");
            if (data !== undefined) {
                for (var i = 0; i < attrs.length; i++) {
                    if (Array.isArray(data)) {
                        var vals = [];
                        for (var j = 0; j < data.length; j++) {
                            var value = data[j][attrs[i]]; // The value at the given array
                            if (attrs.length - 1 > i) {
                                // Recursively retrieve values at the next key and add them to the array
                                vals = vals.concat(getValueByStringAttributes(attrs[i + 1], value));
                            } else {
                                // We have no more keys for this object, so add this to the array
                                vals.push(data[j][attrs[i]]);
                            }
                        }
                        return vals;
                    } else {
                        var arrayItem = attrs[i].split('[');
                        if (arrayItem.length === 1) {
                            data = data[arrayItem[0]];
                        } else {
                            var index = arrayItem[1].replace(']', '');
                            var attr = arrayItem[0];

                            data = data[attr][index];
                        }
                    }
                }
            }

            return Array.isArray(data) ? data : [data];
        })

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

},{}]},{},[2]);

//# sourceMappingURL=Anubis.js.map
