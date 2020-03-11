"use strict";

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  rename = require("gulp-rename"),
  merge = require('merge-stream'),
  htmlreplace = require('gulp-html-replace'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();

  var babel = require('gulp-babel');

  var randHex = function() {
    var r = Math.floor(Math.random()*1000000000).toString(16)
    return r;
  };

// Clean task
gulp.task('clean', function() {
  return del(['dist', 'assets/css/app.css']);
});

// Copy third party libraries from node_modules into /vendor
gulp.task('vendor:js', function() {
  return gulp.src([
    './node_modules/bootstrap/dist/js/*',
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js',
    './node_modules/popper.js/dist/umd/popper.*',
    './node_modules/fastclick/lib/*'
  ])
    .pipe(gulp.dest('./assets/js/vendor'));
});

// Copy font-awesome from node_modules into /fonts
gulp.task('vendor:css', function() {
  return  gulp.src([
    './css/semantic.min.css',
    './css/**/*'
  ])
    .pipe(gulp.dest('./dist/css'))
    .pipe(gulp.dest('./app/www/css'))
});

gulp.task('resources', function() {
  return  gulp.src([
    './resources/**/*'
  ])
    .pipe(gulp.dest('./dist/resources'))
    .pipe(gulp.dest('./app/www/resources'))
});

gulp.task('images', function() {
  return  gulp.src([
    './images/**/*'
  ])
    .pipe(gulp.dest('./dist/images'))
    .pipe(gulp.dest('./app/www/images'))
});

// vendor task
gulp.task('vendor', gulp.parallel('vendor:css', 'vendor:js'));

// Copy vendor's js to /dist
gulp.task('vendor:build', function() {
  var jsStream = gulp.src([
    './assets/js/vendor/clipboard.js',
    './assets/js/vendor/jquery.js',
    './assets/js/vendor/reject.js',
    './assets/js/vendor/semantic.js',
    './assets/js/vendor/underscore.js',
    './assets/js/vendor/jquery.browser.js',
    './assets/js/vendor/fastclick.js',
    './js/insulin-calc.js'
  ])
    .pipe(gulp.dest('./dist/assets/js/vendor'))
    .pipe(gulp.dest('./app/www/assets/js/vendor'));
  return jsStream;
})

// Copy Bootstrap SCSS(SASS) from node_modules to /assets/scss/bootstrap
gulp.task('bootstrap:scss', function() {
  return gulp.src(['./node_modules/bootstrap/scss/**/*'])
    .pipe(gulp.dest('./assets/scss/bootstrap'));
});

// Compile SCSS(SASS) files
gulp.task('scss', gulp.series('bootstrap:scss', function compileScss() {
  return gulp.src(['./assets/scss/*.scss'])
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./assets/css'))
}));

// Minify CSS
gulp.task('css:minify', gulp.series('scss', function cssMinify() {
  return gulp.src("./css/style.css")
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(gulp.dest('./app/www/css'))
    .pipe(browserSync.stream());
}));

// Minify Js
gulp.task('js:minify', function () {
  return gulp.src([
    './js/index.js'
  ])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulp.dest('./app/www/js'))
    .pipe(browserSync.stream());
});

// Replace HTML block for Js and Css file upon build and copy to /dist
gulp.task('replaceHtmlBlock', function () {
  return gulp.src(['index.html', 'governance.html'])
    .pipe(htmlreplace({
      js: `js/index.min.js?v=${randHex()}`,
      css: `css/style.min.css?v=${randHex()}`,
      calc: `js/insulin-calc.js?v=${randHex()}`,
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(gulp.dest('./app/www/'));
});

// Configure the browserSync task and watch file path for change
gulp.task('dev', function browserDev(done) {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('assets/scss/*.scss', gulp.series('css:minify', function cssBrowserReload (done) {
    browserSync.reload();
    done(); //Async callback for completion.
  }));
  gulp.watch('assets/js/index.js', gulp.series('js:minify', function jsBrowserReload (done) {
    browserSync.reload();
    done();
  }));
  gulp.watch(['*.html']).on('change', browserSync.reload);
  done();
});

// Build task
gulp.task("build", gulp.series(gulp.parallel('css:minify', 'js:minify', 'vendor', 'resources', 'images'), 'vendor:build', function copyAssets() {
  return gulp.src([
    '*.html'
  ], { base: './'})
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('app/www'));
}));

// Default task
gulp.task("default", gulp.series("clean", 'build', 'replaceHtmlBlock'));
