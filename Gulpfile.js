var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    bower = require('gulp-bower'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

var config = {
    sassPath: 'public/styles/sass',
    bowerPath: 'bower_components'
};

gulp.task('express', function() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')({port: 35729}));
    app.use(express.static(__dirname + '/public'));
    app.listen(3000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
    var fileName = 'public/' + require('path').relative(__dirname + '/public', event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerPath));
});

gulp.task('icons', function() {
    return gulp.src(config.bowerPath + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('styles', function() {
    return sass(config.sassPath, {
        style: 'expanded',
        loadPath: [
            config.sassPath,
            config.bowerPath + '/bootstrap/scss',
            config.bowerPath + '/font-awesome/scss'
        ]
    })
        .on('error', notify.onError(function(error) {
            return 'Error: ' + error.message;
        }))

        .pipe(gulp.dest('public/styles'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('public/styles'));
});

gulp.task('uglify', function() {
    return gulp.src('public/js/app.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/*.scss', ['styles']);
    gulp.watch('public/*.html', notifyLiveReload);
    gulp.watch('public/styles/*.css', notifyLiveReload);
    gulp.watch('public/js/*.js', notifyLiveReload);
    gulp.watch('public/js/app.js', ['uglify']);
});

gulp.task('default', ['bower', 'icons', 'styles', 'uglify', 'express', 'livereload', 'watch'], function() {

});
