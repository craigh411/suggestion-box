(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            var typeahead = suggestion === undefined ? "" : suggestion.replace(regex, this.currentInput);

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

},{"./util.js":3}],2:[function(require,module,exports){
'use strict';

window.Typeahead = require('../Typeahead.js').default;

},{"../Typeahead.js":1}],3:[function(require,module,exports){
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

//# sourceMappingURL=Typeahead.js.map
