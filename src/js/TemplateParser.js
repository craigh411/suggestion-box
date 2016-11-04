class TemplateParser {

    constructor(template) {
        this.template = template;
        this._getTemplateForListItem();
        this._removeListItemMarkup();
        this._removeRootElement();
    }

    _getTemplateForListItem() {
        let listItem = "";

        let html = $.parseHTML($.trim(this.template));

        if (html.length !== 1) {
            console.log('%c[Suggestion-Box:Error] Unable to parse template. Template must have one root element.', 'color: #f00');
        }
        var el = html[0];
         if (el.id !== "" || el.class !== undefined) {
            console.log('%c[Suggestion-Box:warn] Avoid adding style attributes such as "class", "id" or "style" to root element in template because these tags will be stripped.', 'color: #f00');
        }

        if (el.childNodes.length > 0) {
            $.each(el.childNodes, function(i, el) {
                if (el.id == "suggestion-list") {
                    $.each(el.childNodes, function(i, el) {
                        if (el.nodeName == "LI") {
                            listItem = el.innerHTML;
                        }
                    });
                }
            });
        }


        this.listItem = listItem;
    }

    _removeRootElement() {
        this.template = $(this.template).unwrap().html();
    }

    _removeListItemMarkup() {
        this.template = this.template.replace("<li>" + this.listItem + "</li>", "{{ suggestion_list }}");
    }

    replaceHandlebars(str, name, replace) {
        return str.replace(new RegExp("@?{{\\s?" + name + "\\s?}}", "gi"), replace);
    }

    getParsedTemplate() {
        return this.template;
    }

    getListItemMarkup() {
        return this.listItem;
    }
}

export default TemplateParser;
