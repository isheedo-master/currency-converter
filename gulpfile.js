// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass            = require('gulp-sass');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var livereload      = require('gulp-livereload');
var cleanCSS        = require('gulp-clean-css');
var autoprefixer    = require('gulp-autoprefixer');

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('source/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/assets/'))
        .pipe(livereload());
});

// Mnify CSS
gulp.task('minify', function() {
  return gulp.src('public/assets/app.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('public/assets'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('source/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/assets/'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('source/js/**/*.js', ['scripts']);
    gulp.watch('source/sass/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'scripts']);
