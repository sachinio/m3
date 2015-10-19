var gulp = require('gulp');
var typescript = require('gulp-tsc');
var jasmine = require('gulp-jasmine-phantom');
var stripDebug = require('gulp-strip-debug');
var del = require('del');
var concat = require('gulp-concat');
var gulpMerge = require('gulp-merge');

gulp.task('default', ['compile:src'], function () {
});

gulp.task('scripts', function () {
    return gulp;
});

gulp.task('watch', function () {
    return gulp.watch('src/**/*.ts', ['compile:src'])
});

gulp.task('compile:src', function () {
    return gulpMerge(
        gulp.src(['externals/jquery-1.11.3.min.js']),
        gulp.src(['src/**/*.ts'])
            .pipe(typescript({out: 'm3.js'})))
        .pipe(concat('m3.js'))
        .pipe(gulp.dest('bin/debug'))
        .pipe(stripDebug())
        .pipe(gulp.dest('bin/release/'))
});

gulp.task('compile:tests', ['compile:src'], function () {
    return gulpMerge(
        gulp.src(['externals/jquery-1.11.3.min.js']),
        gulp.src(['tests/**/*.ts'])
        .pipe(typescript({out: 'tests.js'})))
        .pipe(concat('tests.js'))
        .pipe(gulp.dest('bin/'))
});

gulp.task('test', ['compile:tests'], function () {
    return gulp
        .src('bin/tests.js')
        .pipe(jasmine({integration: true}));
});

gulp.task('clean', function () {
    return del(['bin/**/*']);
});

