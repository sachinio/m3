var gulp = require('gulp');
var typescript = require('gulp-tsc');

gulp.task('default', function () {
    gulp.watch('src/**/*.ts', ['compile'])
});

gulp.task('compile', function(){
    gulp.src(['src/**/*.ts'])
        .pipe(typescript({out:'app.js'}))
        .pipe(gulp.dest('bin/'))
});