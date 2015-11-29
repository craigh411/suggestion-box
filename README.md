# suggestion-box 2.0

jQuery suggestion box plugin for search suggestions. 

Automatically makes suggestions based on user input.

*Screenshot*
![alt text](https://raw.githubusercontent.com/craigh411/suggestion-box/2.0/screenshot.png "Suggestion box in action")


### What's new in 2.0

- Support for images
- Support for multiple suggestion boxes on a single page
- Support for custom information
- Support for highlighting pattern matches
- Support for scrollbars
- Better support for overriding default click events
- Improved keyboard controls
- Options now settable via set method or directly on jQuery object.
- Border radius is removed on text input when suggestion box shows for better appearence 
- New functions added and redundent function removed.
- More consistent functionality.

**Note:** While much of the functionaility is fully implemented and tested, 2.0 is not a stable release and is liable to change. If you choose to use the current version of 2.0 in your projects you should make sure ensure your copy will not be overwritten by update, so future releases do not break your code.

### Features:

- Highly configurable & flexible
- Suggestions can be provided directly, by your own server side script or from a JSON file.
- Inbuilt filtering support
- Selection highlighting
- Keyboard controls.
- Supports copy & paste
- Easy custom styling using css stylesheets
- Licenced under MIT

## Setup

Make sure you have included `jQuery` in your project: https://code.jquery.com. Then simplycopy the `css` & `js` files from the `dist` folder and add the following code to your page:

```html
<link rel="stylesheet" href="path/to/css/suggestion-box.min.css"/>
<script src="path/to/js/suggestion-box.min.js"></script>
```

#### Bower

Suggestion box is also availble via `bower`, simply use:

`bower install suggestion-box`


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
