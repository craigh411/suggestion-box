![alt text](http://www.suggestion-box.co.uk/images/logo.png "Suggestion Box")

[![Build Status](https://travis-ci.org/craigh411/suggestion-box.svg?branch=2.0)](https://travis-ci.org/craigh411/suggestion-box)
[![Bower](https://img.shields.io/bower/l/bootstrap.svg)](http://bower.io)

**3.0 is currently in development:** 

jQuery suggestion box plugin for search suggestions. 

Automatically makes suggestions based on user input.

## What's New

  ### Templating

  A new templating engine has been implemented to allow creation of templates using a string or the HTML5 template tag. Suggestion box no longer requires you to return your data in a set format, you can simply create a template for displaying you data. There are even conditionals!

  ### Typehead

  It's now possible for suggestion box to add the most relevant suggestion in the suggestion box as the user types.

  ### Simplified API

  Gone are all the methods, suggestion box now uses options and callbacks to receive information.

  ### Native array support

  Suggestion box now supports direct input from a javascript array or an array of objects. JSON is still used when returning server data.

  ### New server call options

  The way suggestion box interacts with the server has been completely rewritten. It's now possible to prefetch data, fetch data once, fetch on a continuous cycle as the user types or use a mixture of the filter and server calls, allowing for greater flixibility. 

  ### Loading spinner

  It may be a small thing, but suggestion box now places a loading spinner in the suggestion box when it is fetching data, for a better user experience.

*Screenshot*
![alt text](https://raw.githubusercontent.com/craigh411/suggestion-box/master/screenshot.png "Suggestion box in action")

### Features:

- Highly configurable & flexible
- Suggestions can be provided directly, by your own server side script or from a JSON file.
- Inbuilt filtering support
- Selection highlighting
- Intuative keyboard controls.
- Supports copy & paste
- Easy custom styling using css stylesheets

### Setup

Make sure you have jQuery included in your project then simply add the `js` and `css` files in the `dist` folder to your project and include them:

```html
<link rel="stylesheet" href="path/to/suggestion-box.min.css" />
<script src="path/to/suggestion-box.min.js"></script>
````

#### Bower

If you use Bower then you can install suggestion box with the following command:

`bower install suggestion-box`


## Documentation & Examples

Full documentation and code examples are available on the [Suggestion Box](http://www.suggestion-box.co.uk) Website.

## Licence

Suggestion Box is licenced under [MIT](https://github.com/craigh411/suggestion-box/blob/master/LICENCE).
