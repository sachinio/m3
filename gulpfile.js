var gulp = require('gulp');
var typescript = require('gulp-tsc');
var jasmine = require('gulp-jasmine-phantom');
var stripDebug = require('gulp-strip-debug');
var del = require('del');

gulp.task('default', ['compile:src'], function () {
});

gulp.task('watch', function () {
    return gulp.watch('src/**/*.ts', ['compile:src'])
});

gulp.task('compile:src', function () {
    return gulp.src(['src/**/*.ts'])
        .pipe(typescript({out: 'm3.js'}))
        .pipe(gulp.dest('bin/debug'))
        .pipe(stripDebug())
        .pipe(gulp.dest('bin/release/'));
});

gulp.task('compile:tests', ['compile:src'], function () {
    return gulp.src(['tests/**/*.ts'])
        .pipe(typescript({out: 'tests.js'}))
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

