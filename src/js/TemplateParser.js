class TemplateParser {

    constructor(template) {
        this.template = template;
        this.nodes = [];
        this.conditionals = [];

        this._getNodes();
        this._getConditionals()
        this._getTemplateForListItem();
        this._removeListItemMarkup();
        this._removeRootElement();
    }

    _getTemplateForListItem() {
        let listItem = "";

        let html = $.parseHTML($.trim(this.template));
        var el = (html) ? html[0] : [];

        if (html.length !== 1) {
            console.log('%c[Suggestion-Box:Error] Unable to parse template. Template must have one root element.', 'color: #f00');
        }

        if (el.id !== "" || el.class !== undefined) {
            console.log('%c[Suggestion-Box:warn] Avoid adding style attributes such as "class", "id" or "style" to root element in template because these tags will be stripped.', 'color: #f00');
        }

        if (el.childNodes.length > 0) {
            $.each(el.childNodes, function(i, el) {
                if (el.id === "suggestion-list") {
                    $.each(el.childNodes, function(i, el) {
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
    getTemplatedItems(str) {
        let regex = new RegExp("@?{{\\s?[a-z0-9_-]+\\s?}}", "ig");
        let items = str.match(regex);

        let itemNames = [];

        items.forEach((item) => {
            item = item.replace(new RegExp("@?{{\\s?"), "");
            item = item.replace(new RegExp("\\s?}}"), "");
            itemNames.push(item);
        })

        return itemNames;
    }

    _getConditionals() {
        this.nodes.forEach((node) => {
            if (node.attributes.length > 0) {
                for (var i = 0; i < node.attributes.length; i++) {
                    if (node.attributes[i].nodeName === "sb-show") {
                        let id = $(node).attr('id') || 'sb' + Math.floor(Math.random() * 10000000);

                        // Add the id to the template
                        this.template = this.template.replace($(node)[0].outerHTML, $(node).attr('id', id)[0].outerHTML);
                        this.conditionals.push({ 'id': id });
                    }
                }
            }
        });
    }

    getConditional(id) {
        for (var key in this.conditionals) {
            if (this.conditionals[key].id === id) {
                return this.conditionals[key]
            }
        }

        return false;
    }

    getConditionals() {
        return this.conditionals;
    }

    _getNodes(node) {
        if (!node) {
            let html = $.parseHTML($.trim(this.template));
            var node = (html) ? html[0] : [];
        }

        $.each(node.childNodes, (i, el) => {
            if (el.childNodes.length > 0) {
                this.nodes.push(el);
                this._getNodes(el);
            }
        });

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
