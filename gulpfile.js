var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    sass = require('gulp-ruby-sass'),
    spawn = require('child_process').spawn,
    uglify = require('gulp-uglify');

var paths = {
    scripts: [
        'src/coffee/utils.coffee',
        'src/coffee/color.coffee',
        'src/coffee/geomap.coffee',
        'src/coffee/choropleth.coffee'
    ],
    styles: ['src/**/*.sass']
};

// Run dev server
gulp.task('serve', function() {
    log = function (data) { console.log(data.toString()) };
    lserve = spawn('logya', ['serve']);
    lserve.stdout.on('data', log);
    lserve.stderr.on('data', log);
});

// Minify scripts and styles
gulp.task('minify', ['scripts'], function() {
    gulp.src('dist/js/d3.geomap.js')
        .pipe(uglify())
        .pipe(concat('d3.geomap.min.js'))
        .pipe(gulp.dest('static/js'));
});

// Minify and copy scripts
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(coffee())
        .pipe(concat('d3.geomap.js'))
        .pipe(gulp.dest('static/js'));
});

// Compile and copy sass
gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(concat('d3.geomap.css'))
        .pipe(gulp.dest('static/css'));
});

// Rerun task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
});

// Build the JavaScript and CSS files
gulp.task('build', ['scripts', 'styles', 'minify']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'serve', 'watch']);