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

    static logError(error) {
        console.log(error);
    }
}

export default Util;
