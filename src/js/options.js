export default {
    data: [],
    template: '',
    searchBy: 'suggestion',
    url: '',
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
    prefetch: false,
    results: 10,
    widthType: 'width', // Pass a css width attr (i.e. 'width', 'min-width')
    showNoSuggestionsMessage: false,
    noSuggestionsMessage: 'No Suggestions Found',
    filter: "^{{INPUT}}",
    typeahead: false,
    highlightMatch: false,
    paramName: 'search',
    scrollable: false,
    debug: false,
    onClick: (value, obj, event, inputEl, selectedEl) => {
            inputEl.val(value);
        },
        //height: 50,
    customEvents: {
        close: 'suggestion-list.close',
        show: 'suggestion-list.show',
        loading: 'suggestion-box.loading',
        'ajax-error': 'suggestion-box.ajax.error',
        'ajax-success': 'suggestion-box.ajax.success'
    }
};
