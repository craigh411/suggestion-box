// Karma configuration
// Generated on Thu Nov 05 2015 19:32:20 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
    config.set({


        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter

        frameworks: ['jasmine'],

        /*
         ** UNCOMMENT FOR USE WITH detectBrowsers **
         frameworks: ['jasmine','detectBrowsers'],
         plugins: [
         'karma-chrome-launcher',
         'karma-firefox-launcher',
         'karma-ie-launcher',
         'karma-safari-launcher',
         'karma-opera-launcher',
         'karma-phantomjs-launcher',
         'karma-detect-browsers',
         'karma-jasmine'
         ],*/

        // list of files / patterns to load in the browser
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'https://code.jquery.com/jquery-1.11.3.min.js',
            'spec/support/mock-ajax.js',
            'dist/js/globals/Anubis.js',
            'dist/js/globals/TypeAhead.js',
            'dist/js/globals/TemplateParser.js',
            'dist/js/main.js',

            // tests
            'spec/appSpec.js',
            'spec/typeaheadSpec.js',
            'spec/templateParserSpec.js',
            'spec/anubisSpec.js',

            // fixtures
            {
                pattern: 'spec/support/*.json',
                watched: true,
                served: true,
                included: false
            }
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultanous
        concurrency: Infinity
    })
}
