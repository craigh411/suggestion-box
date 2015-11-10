# suggestion-box

jQuery suggestion box plugin for search suggestions. 

Automatically makes suggestions based on user input.

*Screenshot*
![alt text](https://raw.githubusercontent.com/craigh411/suggestion-box/master/screenshot.png "Suggestion box in action")

**IMPORTANT: This plugin is still in development and is currently not stable.**

### Features:

- Highly configurable & flexible
- Suggestions can be provided by your own server side script, JSON file or direct input.
- Native filtering support
- Selection highlighting
- Keyboard controls
- Intuative & seamless mouse/keyboard control swap overs.
- Easy custom styling using css stylesheets

## Setup

Make sure you have included `jQuery` in your project: https://code.jquery.com. Then simplycopy the `css` & `js` files from the `dist` folder and add the following code to your page:

```html
<link rel="stylesheet" href="path/to/css/suggestion-box.min.css"/>
<script src="path/to/js/suggestion-box.min.js"></script>
```

## Usage

First you need to add a text input to your page such as:

```html
<input type="text" id="mySearch" />
```

**Note:** `id` can be whatever you want, `mySearch` is only being used as an example.


### Loading suggestions from your own server side scripts

If you would like to get suggestions from your own server side script, you simply need to point to it using the `url` option.

```javascript
$('#mySearch').suggestionBox({url : 'path/to/script'});
```
 
Make sure you are outputting the JSON in the correct format (see below). 

#### Getting user input

`Suggestion-box` automatically sends a paramater called ``search`` in the `querystring` of the ajax call which allows you to get the user input from your scripts. You may change this paramater name if you wish using the `paramName` option:
 
 ```javascript
 $('#mySearch').suggestionBox({url : 'path/to/script', paramName: 'input'});
 ```
 
#### Setting The Delay
 
Because retrieving your server side script requires an ajax call, `suggestion-box` will only get suggestions when the user  has stopped typing for a specified period. By default this is when there hasn't been a keypress for 400ms. If you wish to change this you can set the `delay` option yourself.

```javascript 
$('#mySearch').suggestionBox({url : 'path/to/script', input: 1000}); // Make request after 1 second
```

### Pre-loading suggestions via JSON

If you would prefer to pre-load your suggestions you can do this using the `loadSuggestions` or `addSuggestions` functions:

```javascript
 $('#mySearch').suggestionBox({filter: true}).loadSuggestions('path/to/my.json');
```
 
 or
 
 ```javascript
$('#mySearch').suggestionBox({filter: true}).addSuggestions(JSON.stringify(
    {
    "results": [
      {
        "suggestion": "Suggestion 1",
        "url": "suggestion1.html",
      },
      {
        "suggestion": "Suggestion 2",
        "url": "suggestion2.html"
      }
    ]
  }
));
 ```

You should check the JSON Format section below to see how you should format your JSON.

#### Filtering

You can set your loaded JSON to filter automatcally setting the `filter` option to `true`. Suggestion-box will then automatcally filter your loaded JSON and present suggestions based on the user input.

```javascript
$('#mySearch').suggestionBox({filter: true}).loadSuggestions('path/to/my.json');
```

**Important:** If you do not set the `filter` option to true then no suggestions will be shown until you explicitly call the `showSuggestions()` method.

##### Custom Filters

By default filtering will match any occurance of the input string within your suggestion data. If you want to refine this you can pass in regex pattern using the `filterPattern` option. If you want to capture the user input for your pattern match simply place `{INPUT}` in your regex and it will be automatcally replaced with the user input:

```javascript
// Match suggestions starting with the user input
 $('#mySearch').suggestionBox({filter: true, filterPattern: "^{INPUT}"}).loadSuggestions('path/to/my.json');
```

##### Sorting

It is possible to sort your filtered results by passing a function to the `sort()` method. Sort uses javascripts `sort()` function, so the function you supply will perform exactly the same task.

  
## JSON Format
 
JSON needs to be provided in in the following format:

```json
{
  "results": [
    {
      "suggestion": "Suggestion 1",
      "url": "suggestion1.html",
      "attr" : [
        {
        "class" : "suggestion",
        "id" : "suggestion1",
        "anotherAttribute" : "foo"
        }
      ]
    },
    {
      "suggestion": "Suggestion 2",
      "url": "suggestion2.html",
    }
  ]
}
```

#### Required Values

Each `JSON` file must be a list of `results` and each suggestion is defined with  a `suggestion` element and a `url` element where `suggestion` is the text of the suggestion in the suggestion list and the `url` is the link location.

#### Optional Values

You may also add an optional `"attr"` element which allows you to add any attributes you want to the anchor tag (`<a>`)

so, the following suggestion with the `attr` element:

```json
  {
    "suggestion": "Suggestion 1",
    "url": "suggestion1.html",
    "attr" : [
      {
        "class" : "suggestion",
        "id" : "suggestion1",
        "anotherAttribute" : "foo"
      }
    ]
  }
```
would produce:

`<a href="suggestion1.html" class="suggestion" id="suggestion1" anotherAttribute="foo" >Suggestion 1</a>`


### Available Options

The following options can be passed to the suggestion box

e.g. 

```javascript
$('#search').suggestionBox({optionName : value}):
```


Option Name   | Description  | Default
------------- | -------------|------------
url           | The url of the JSON or server side script where you would like to make an ajax call to get the                        suggestions | null
heading       | The heading displayed in the suggestion box | Suggestions
results       | The maximum number of results to display in the suggestion box | 10
fadeIn        | Whether to apply a fade in effect to the suggestion box | true
fadeOut       | Whether to apply a fade out effect to the suggestion box | false
menuWidth     | How you would like the suggestion box width to be calculated, either: 'auto' - Browser automatically calculates the width based on content or 'constraint' - Constrain the suggestion box width to the search box width | auto
delay         | The number of milliseconds to wait until to consider the user to have stopped typing. An ajax call to                  the given suggestion url will be made after this time. | 400
topOffset     | The number of pixels you would like to move the suggestion boxes' top position | 0
leftOffset    | The number of pixels you would like to move the suggestion boxes' left position | 0
paramName     | The paramater name you would like to use in your query string for requests | search
ajaxError     | A function to define what should happen on ajax error, by default this performs a console.log() which will be overidden if supplied | function(data){...}
ajaxSuccess   | A function to define custom work to perform on ajax success. This will not override the default functionality | function(data){}
showNoSuggestionsMessage | Shows the noSuggestionsMessage when no suggestions can be found | false
noSuggestionsMessage | The message to be shown when no suggestions have been found and showNoSuggestionsMessage is true | No Suggestions Found
filter | If you would like to apply the filter to the suggestion box when typing | false
filterPattern | A regex expression to apply using the filter, use `{INPUT}` to inject the user input in to the pattern  | ({INPUT})

### Available Methods

The following methods can be used on the suggestion box e.g.:

```javascript
var suggestioBox = $('#search').suggestionBox():
suggestionBox.dstroy();
```


Method  | Description  | Chainable
------------- | -------------|------------
getSuggestions(url) | Gets the suggestion from the given url and displays them | Yes
showSuggestions() | Displays the suggestion box with the current suggestions | Yes
addSuggestions(suggestions) | Sets the JSON suggestions but doesn't display them | Yes
loadSuggestions(url) | Loads the JSON suggestions from the given url but doesn't display them | Yes
applyFilter(bool) | Whether to apply the filter to the suggestions | Yes
sort | A function to sort the filtered results using javasciprt `sort()` method (only works when filter is on) | Yes
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


### Styling the Suggestion Box

#### CSS
By default the stylesheet in miniturised, if you want to adjust any styles you can take a look at the non-miniturised css in `src/css` to help you see how styles have been applied.

#### SCSS/SASS

If you prefer you can download the scss from the `src/scss` which makes it easier to change any colours, but you will need to compile it to css.


## Roll your own

If you want to build your own version of `suggestion-box` or want to contribute, you will need to `clone` the repo.

#### Source files

The source files can be found in the `src` folder, which you are free to edit as you wish.

#### Installing Dependencies

Make sure you have `nodeJS` installed on your system: https://nodejs.org/

then run:

`npm install`

from the root directory.

### Gulp

`Suggestion-box` is built with gulp, so you can simply run `gulp` from the command line in the project root to create new builds from the `src`. You should not edit files in `src/css` directly as those are compiled from the `scss`, so will be overwritten when you run `gulp`.

The following gulp commands can be run:

`gulp` - Builds from `src/js` and `src/scss`

`gulp watch` - Watches for changes and automatcally create builds when files are saved

`gulp sass` - Builds the styles from .scss files in `src/scss`.

`gulp compress` - Builds the `js` distributables `src/js`

`gulp sass:watch` - Watch for changes on the `src/sass` files

`gulp js:watch` -  Watch for changes on the `src/js` files

`gulp test` - Run the tests

### Running tests

If you want to run the tests, then you can either run `gulp test` or `npm test` from the command line in the root.

You can also run `karma start` which will watch for any changes to the test files and run tests as they are changed.

<b>Note: </b> By default tests are run using `PhantomJS`. If you want to run them against other browsers you can add them to `browsers` section in `karma.conf.js`. All launchers have been included as devDependencies.
