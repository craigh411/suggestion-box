/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');

gulp.task('default', ['sass', 'compress']);
gulp.task('watch', ['sass:watch', 'js:watch']);

// Compile .scss to .css
gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify('SCSS Compiled'));
});

// minify using UglifyJS
gulp.task('compress', function () {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify('JS Compiled'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass', 'autoprefixer', 'cssmin']);
});

gulp.task('js:watch', function () {
    gulp.watch('src/js/**/*.js', ['compress']);
});