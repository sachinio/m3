var gulp = require('gulp');
var typescript = require('gulp-tsc');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('default', function () {
    gulp.watch('src/**/*.ts', ['compile:src'])
});

gulp.task('compile:src', function(){
    gulp.src(['src/**/*.ts'])
        .pipe(typescript({out:'app.js'}))
        .pipe(gulp.dest('bin/'))
});

gulp.task('compile:tests', function(){
    return gulp.src(['tests/**/*.ts'])
        .pipe(typescript({out:'tests.js'}))
        .pipe(gulp.dest('bin/'))
});

gulp.task('test', ['compile:tests'], function(){
    return gulp
        .src('bin/tests.js')
        .pipe(jasmine({ integration: true }));
});

