class Util {


    static getCssValue(el, name) {
        let value = parseInt(el.css(name).replace('px', ''));
        return (isNaN(value)) ? 0 : value;
    }

    /** Calculates the padding for the given elements**/
    static calculateVerticalPadding(el) {
        return Util.getCssValue(el, 'padding-bottom') + Util.getCssValue(el, 'padding-top');
    }

    static calculateVerticalBorderWidth(el) {
        return Util.getCssValue(el, 'border-bottom-width') + Util.getCssValue(el, 'border-top-width');
    }

    static calculateHorizontalBorders(el) {
        return Util.getCssValue(el, 'border-left-width') + Util.getCssValue(el, 'border-right-width');
    }

    static copyArray(arr) {
        return arr.splice(0);
    }

    static logger(debug, message, type) {
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
    static applyBorderRadius(el, left, right) {
        el.css('border-bottom-left-radius', left);
        el.css('border-bottom-right-radius', right);
    }


    /*
     * Retuns the value at the given attribute. An attribute can look like: 'artists[0].name'
     * @param {string} attrs - The string attributes you want to get the value for.
     * @param {array} data - the data to search
     * @retun {array} - An array of results for the given query
     */
    static getValueByStringAttributes(attrs, data) {
        attrs = (Array.isArray(attrs)) ? attrs : attrs.split(".");
        if (data !== undefined) {
            for (var i = 0; i < attrs.length; i++) {
                if (Array.isArray(data)) {
                    let vals = [];
                    for (var j = 0; j < data.length; j++) { 
                        let value = data[j][attrs[i]]; // The value at the given array
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
                    let arrayItem = attrs[i].split('[');
                    if (arrayItem.length === 1) {
                        data = data[arrayItem[0]];
                    } else {
                        let index = arrayItem[1].replace(']', '');
                        let attr = arrayItem[0];

                        data = data[attr][index];
                    }
                }
            }
        }

        return (Array.isArray(data)) ? data : [data];
    }

    /**
     * Returns true if the given search is found in the given object;
     */
    static inObject(search, obj) {
        for (var key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;

            if (obj[key] == search) {
                return true;
            }
        }

        return false;
    }

    static isId(str) {
        return str.charAt(0) == "#";
    }
}

export default Util;
