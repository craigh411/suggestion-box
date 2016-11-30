/* File: gulpfile.js */
var gulp = require('gulp');
var Server = require('karma').Server;
var elixir = require('laravel-elixir');
// override the default laravel browserify so we can use mangle in uglifyjs.
require('./browserify.js');

	config.js.uglify.options = {
    compress: {
        drop_console: false
    },
    mangle: {
        except: ['Anubis', 'Typeahead', 'SuggestionList']
    }
}

elixir(function(mix) {
    mix.browserifyuglify('main.js', './dist/js/main.js', './src/js/');
});


elixir(function(mix) {
    mix.sass([
        './src/scss/suggestion-box.scss',
    ], 'dist/css/suggestion-box.min.css');
});

// Build all files individually

elixir(function(mix) {
   mix.browserifyuglify('Typeahead.js', './dist/js/globals/Typeahead.js', './src/js/globals');
});
elixir(function(mix) {
   mix.browserifyuglify('TemplateParser.js', './dist/js/globals/TemplateParser.js', './src/js/globals');
});
elixir(function(mix) {
   mix.browserifyuglify('Anubis.js', './dist/js/globals/Anubis.js', './src/js/globals');
});
elixir(function(mix) {
    mix.browserify('main.js', './dist/js/globals/main.js', './src/js/globals');
});

/**
 * Run tests using karma once and exit
 */
gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});
