export default {
    data: [],
    template: '#suggestion-box-template',
    searchBy: 'suggestion',
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
    onClick: (value, obj, event, inputEl, selectedEl) => {
        inputEl.val(value);
/*        console.log(value);
        console.log(obj);
        console.log(event);
        console.log(inputEl);
        console.log(selectedEl);*/
    },
    onShow: () => {},
    onHide: () => {},
    paramName: 'search',
    sort: () => {},
    scrollable: false,
    debug: true
    //height: 50
};
