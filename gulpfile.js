require('babel-polyfill');

const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackTestConfig = require('./spec/webpack.test.config');
const webpackConfig = require('./webpack.config');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const cssimport = require('gulp-cssimport');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('server', function () {
  nodemon({
    script: './server/server.js',
    ext: '.js',
    ignore: ['client/', 'public/']
  });
});

gulp.task('webpack', function () {
  process.env.NODE_ENV = 'production';
  return bundleAssets(webpackConfig)
    .pipe(gulp.dest('public/'));
});

gulp.task('webpack-watch', function () {
  const watcher = gulp.watch('client/**/*.js', ['webpack']);

  watcher.on('change', function () {
    console.log('updating webpack');
  });
});

gulp.task('dev', [
  'webpack-watch',
  'stylesheetsWatch',
  'server'
]);

function bundleAssets(config, options) {
  options = options || {};
  return gulp.src('./client/index.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(config, options)));
}

gulp.task('styleguideWebpack', function () {
  return bundleStyleguideAssets()
    .pipe(gulp.dest('public/'));
});

function stylesheets(compileSass) {
  return gulp.src('client/styles/**/*.scss')
    .pipe(compileSass())
    .pipe(plumber())
    .pipe(cssimport())
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/'));
}

gulp.task('stylesheetsNoThrow', function () {
  return stylesheets(function () {
    return sass().on('error', sass.logError);
  });
});

gulp.task('stylesheets', function () {
  return stylesheets(function () {
    return sass();
  });
});

gulp.task('stylesheetsWatch', ['stylesheetsNoThrow'], function () {
  return gulp.watch('client/styles/**/*.scss', ['stylesheetsNoThrow']);
});

gulp.task('webpackStyleguideWatch', function () {
  return bundleStyleguideAssets({watch: true})
    .pipe(gulp.dest('public/'));
});

function bundleStyleguideAssets(options) {
  options = options || {};
  return gulp.src('styleguide/styleguide.js')
    .pipe(plumber())
    .pipe(webpack(Object.assign(webpackStyleguideConfig, options)));
}

gulp.task('styleguideStyleWatch', ['styleguideStylesheets'], function() {
  return gulp.watch('styleguide/**/*.scss', ['styleguideStylesheets']);
});

gulp.task('styleguideStylesheets', function () {
  return gulp.src('styleguide/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/'));
});