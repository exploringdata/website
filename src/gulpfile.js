var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    sass = require('gulp-ruby-sass'),
    spawn = require('child_process').spawn,
    merge = require('merge-stream'),
    uglify = require('gulp-uglify');

var js_paths = {
    main: [
        'static/js/script.js'
    ],
    sankey: [
        'node_modules/d3/d3.js',
        'src/vendor/d3-plugins/sankey/sankey.js'
    ]
}

var sass_paths = ['src/sass/*.sass']

var paths = {
    coffee: ['src/coffee/*.coffee']
}

// Run dev server
gulp.task('serve', function() {
    log = function (data) { console.log(data.toString()) };
    lserve = spawn('logya', ['serve']);
    lserve.stdout.on('data', log);
    lserve.stderr.on('data', log);
});


// Compile coffee scripts into stage dir
gulp.task('coffee', function() {
  return gulp.src('src/coffee/*.coffee')
      .pipe(coffee())
      .pipe(gulp.dest('static/stage'));
});

// Minify scripts
gulp.task('minify', ['coffee', 'vendor'], function() {
    return gulp.src('static/stage/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('static/min'));
});

// Compile and copy sass
gulp.task('styles', function () {
    return gulp.src(sass_paths)
        .pipe(sass())
        .pipe(gulp.dest('static/css'));
});

// Minify and copy vendor scripts
gulp.task('vendor', function() {
    return gulp.src(js_paths.sankey)
        .pipe(concat('d3.sankey.js'))
        .pipe(gulp.dest('static/stage'));
});

// Rerun task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.coffee, ['coffee']);
    gulp.watch(sass_paths, ['styles']);
});

// merge example
gulp.task('merge', function(cb) {
  var t1 = gulp.src('src/**/*.coffee')
      .pipe(coffee())
      .pipe(gulp.dest('test'));

  var t2 = gulp.src('src/**/*.sass')
      .pipe(sass())
      .pipe(gulp.dest('test'));

  return merge.apply([t1, t2]);
});


// Build the JavaScript and CSS files
gulp.task('build', ['coffee', 'styles', 'vendor', 'minify']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'serve', 'watch']);