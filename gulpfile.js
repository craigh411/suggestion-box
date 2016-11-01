/* File: gulpfile.js */

var elixir = require('laravel-elixir');


elixir(function(mix) {
    mix.browserify('main.js','./dist/js/main.js','./src/js/');
});


/**
 * Run tests using karma once and exit
 */
/*gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});*/