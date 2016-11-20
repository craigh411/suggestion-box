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
    function Anubis(searchBy, filter, sort, param) {
        _classCallCheck(this, Anubis);

        this.searchBy = searchBy;
        this.filter = filter;
        this.sort = sort;
        this.search = "";
        this.param = param || 'search';
        this.debug = false; // flag for showing debug messages from ajax call
        this.lastSearch = "";
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

        // Fetches suggestions from the given url

    }, {
        key: "fetchSuggestions",
        value: function fetchSuggestions(url, callback) {
            this.lastSearch = this.search;

            this.killCurrentFetch();
            var request = {};
            request[this.param] = this.search;

            this.xhr = $.ajax({
                url: url,
                method: 'get',
                dataType: 'json',
                data: request,
                success: callback
            });

            if (this.xhr && this.debug) {
                this.xhr.fail(function (data) {
                    console.log('[Ajax Error]:');
                    console.log(data);
                });
            }
        }
    }]);

    return Anubis;
}();

exports.default = Anubis;

},{}],2:[function(require,module,exports){
'use strict';

window.Anubis = require('../Anubis.js').default;

},{"../Anubis.js":1}]},{},[2]);

//# sourceMappingURL=Anubis.js.map
