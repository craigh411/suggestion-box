module.exports = {
    data: [],
    template: '#suggestion-box-template',
    props: {
        value: 'suggestion'
    },
    sort: () => {},
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
    widthType: 'width',  // Pass a css width attr (i.e. 'width', 'min-width')
    showNoSuggestionsMessage: false,
    noSuggestionsMessage: 'No Suggestions Found',
    filter: "^{{INPUT}}",
    typeahead: false,
    highlightMatch: false,
    ajaxError: () => {},
    ajaxSuccess: () => {},
    loading: () => {},
    completed: () => {},
    onClick: (el, value, href, input) => {
        input.val(value);
    },
    onShow: () => {},
    onHide: () => {},
    paramName: 'search',
    sort: () => {},
    scrollable: false,
    debug: true
    //height: 50
};
