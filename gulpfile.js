'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    postCss = require('gulp-postcss'),
    gutil = require('gulp-util'),


    paths = {
        staticDir: 'public',
        srcStyles: 'public/styles'
    },

    sassOpts = {style: 'expanded'},
    minifyCSSOpts = {compatibility: 'ie8'},

    errorHandler = function(culprit) {
        return function (err) {
            gutil.log(gutil.colors.red('[ ' + culprit + ' ]'), err.toString());
        }
    };



gulp.task('styles', function () {
    return gulp.src(paths.srcStyles + '/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', errorHandler('Sass')))
        .pipe(postCss([
            require('autoprefixer-core')({browsers: 'last 1 version'})
        ]))
        .pipe(minifyCSS(minifyCSSOpts))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.srcStyles + '/'));
});



//gulp.task('default', function () {
//    gulp.start('build');
//});
