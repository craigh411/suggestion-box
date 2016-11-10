module.exports = {
	data: [],
	template: '#suggestion-box-template',
	props: {
		value: 'suggestion',
		url: 'url',
		custom: []
	},
	sort: () => {},
    topOffset: 0,
    leftOffset: 0,
    zIndex: 10000,
    hideOnExactMatch: false,
    isSelectionBox: false,
    loadImage: "/dist/images/loading.gif",
    widthAdjustment: 10,
    fetchAfter: 500,
    fetchEvery: 1000, // in ms
    fetchOnce: false,
    heading: 'Suggestions',
    results: 10,
    menuWidth: 'auto',
    showNoSuggestionsMessage: false,
    noSuggestionsMessage: 'No Suggestions Found',
    filter: "{{INPUT}}",
    highlightMatch: false,
    adjustBorderRadius: true,
    ajaxError: () => {},
    ajaxSuccess: () => {},
    onClick: (e, value, href, input) => {
       input.val(value);
    },
    onShow: () => {},
    onHide: () => {},
    paramName: 'search',
    sort: (a, b) => {
    	return a.localeCompare(b);
    },
    customData: [],
    scrollable: false,
    noConflict: false,
    debug: true
};
