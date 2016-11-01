module.exports = {
    topOffset: 0,
    leftOffset: 0,
    zIndex: 10000,
    hideOnExactMatch: false,
    isSelectionBox: false,
    loadImage: null,
    widthAdjustment: 0,
    delay: 250, // in ms
    heading: 'Suggestions',
    results: 10,
    fadeIn: true,
    fadeOut: false,
    menuWidth: 'auto',
    showNoSuggestionsMessage: false,
    noSuggestionsMessage: 'No Suggestions Found',
    filter: true, // remove this, filtering will now always take place!
    filterPattern: "({INPUT})",
    highlightMatch: false,
    adjustBorderRadius: true,
    ajaxError: function(e) {
        console.log(e);
    },
    ajaxSuccess: function(data) {},
    onClick: function() {
        goToSelection();
        hideSuggestionBox();
        context.val('');
    },
    onShow: function() {},
    onHide: function() {},
    paramName: 'search',
    customData: [],
    scrollable: false,
    noConflict: false
};
