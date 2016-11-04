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
    loadImage: null,
    widthAdjustment: 10,
    delay: 250, // in ms
    heading: 'Suggestions',
    results: 10,
    fadeIn: true,
    fadeOut: false,
    menuWidth: 'auto',
    showNoSuggestionsMessage: false,
    noSuggestionsMessage: 'No Suggestions Found',
    filter: "{{INPUT}}",
    highlightMatch: false,
    adjustBorderRadius: true,
    ajaxError: () => {},
    ajaxSuccess: () => {},
    onClick: () => {
        goToSelection();
        hideSuggestionBox();
        context.val('');
    },
    onShow: () => {},
    onHide: () => {},
    paramName: 'search',
    customData: [],
    scrollable: false,
    noConflict: false
};
