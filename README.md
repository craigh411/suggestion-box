# suggestion-box

jQuery suggestion box plugin for search suggestions. 

**IMPORTANT: This is still in development and is currently not stable.**

## Usage

Simply add

`<input type="text" id="mySearch" />`

to you HTML, then:

 `$('#mySearch').suggestionBox({url : 'path/to/json'});`
 
 to your javascript.
 
 You will need to supply your JSON suggestions to the plugin, either by providing a `url` to a json file or to a server side script that outputs JSON, or, you can pass your JSON in directly:
 
 ```
 var suggestionBox = $('#mySearch').suggestionBox();
 
  // get JSON from url
 suggestionBox.getSuggestions('url');
 
 // Pass in json directly
 suggestionBox.showSuggestions({JSON});
 ```
 
 ## JSON Format
 
JSON needs to be provided in in the following format:

```
{
  "results": [
    {
      "suggestion": "Suggestion 1",
      "url": "suggestion1.html"
    },
    {
      "suggestion": "Suggestion 2",
      "url": "suggestion2.html"
    }
  ]
}
```

Where suggestion is the text of the suggestion box and url is where the suggestion will take the user on click or enter.

### Available Options

The following options can be passed to the suggestion box

e.g. 

`$('#search').suggestionBox({optionName : value})`:

Option Name   | Description  | Default
------------- | -------------|------------
url           | The url of the JSON or server side script where you would like to make an ajax call to get the                        suggestions | null
heading       | The heading displayed in the suggestion box | Suggestions
results       | The maximum number of results to display in the suggestion box | 10
fadeIn        | Defines whether to apply a fade in effect to the suggestion box | true
fadeOut       |Defines whether to apply a fade out effect to the suggestion box | false
menuWidth     | How you would like the suggestion box width to be calculated, either: 'auto' - Browser automatically calculates the width based on content or 'constraint' - Constrain the suggestion box width to the search box width | auto
delay         | The number of milliseconds to wait until to consider the user to have stopped typing. An ajax call to                  the given suggestion url will be made after this time. | 400
topOffset     | The number of pixels you would like to move the suggestion boxs' top position | 0
leftOffset    | The number of pixels you would like to move the suggestion boxs' left position | 0
paramName     | The paramater name you would like to use in your query string for requests | search
ajaxError     | A function to define what should happen on ajax error, by default this performs a console.log() which will be overidden if supplied | function(data){...}
ajaxSuccess   | A function to define custom work to perform on ajax success. This will not override the default functionality | function(data){}
showNoSuggestionsMessage | Shows the noSuggestionsMessage when no suggestions can be found | false
noSuggestionsMessage | The message to be shown when no suggestions have been found and showNoSuggestionsMessage is true | No Suggestions Found



### Available Methods

The following methods can be used on the suggestion box e.g.:

```
var suggestionBox = $('#search').suggestionBox();
suggestionBox.getSuggestions('path/to.json');
```

Method  | Description  | Chainable
------------- | -------------|------------
getSuggestions(url) | Gets the suggestion from the given url | Yes
showSuggestions(suggestions) | Displays the suggestion box with the given suggestions| Yes
moveUp() | Moves the selected suggestion up by 1 | Yes
moveDown() | Moves the selected suggestion down by 1 | Yes
select(position) | Selects the suggestion at the given position | Yes
reset() | Resets selection to starting position. Note: this does not reset the json data | Yes
hide() | Hides the suggestion box | Yes
show() | Displays the suggestion box | Yes
fadeIn(bool) | Sets the value of the fadeIn option | Yes
fadeOut(bool) | Sets the value of the fadeOut option | Yes
delay(ms) | Sets the value of the delay option | Yes
heading(heading) | Sets the value of the heading option | Yes
results(results) | Sets the value of the results option | Yes
ajaxError(error) | Sets the ajaxError option | Yes
ajaxSuccess(success) | Sets the ajaxSuccess option | Yes
selectedUrl() | Returns the url of the selected suggestion | No
selectedSuggestion() | Returns the selected suggestion text | No 
position() | Returns the zero based list position of the selected suggestion | No
jsonData() | Returns the JSON object used to populate the suggestion box | No
destroy() | Destroys the suggestion box | No


