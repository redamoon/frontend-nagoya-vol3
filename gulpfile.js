'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');

var metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var ignore = require('metalsmith-ignore');
var inplace = require('metalsmith-in-place');

var nunjucks = require('nunjucks');
nunjucks.configure('./_resource/_layouts', {
  noCache : true
});

// Gulp Config
var config = {
  jsConcatName: 'app.js',
  dev: true,
  tmp: '.tmphtml',
  resourceDir: '_resource',
  destDir: 'html',
  openDir: 'html',
  autoprefixerBrowsers: [
    '> 2%',
    'ie >= 11'
  ]
};

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src([
      config.resourceDir + '/**/*.js',
      '!' + config.resourceDir + '/common/js/vendor/*'
    ])
    .pipe($.jshint())
    .pipe($.jscs())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('copy:favicon', function() {
  return gulp.src([
    config.resourceDir + '/*.ico'
  ])
  .pipe(gulp.dest(config.destDir + '/'));
});

// gulp.task('copy:fonts', function() {
//   return gulp.src([
//     config.resourceDir + '/**/*.{ttf,eot,woff,woff2}'
//   ])
//   .pipe(gulp.dest(config.destDir + '/'));
// });

gulp.task('copy:images', function() {
  return gulp.src([
      config.resourceDir + '/**/*.{gif,svg}'
    ])
    .pipe(gulp.dest(config.destDir));
});

gulp.task('scripts', ['jshint'], function() {
  return gulp.src([
      config.resourceDir + '/common/js/vendor/jquery.js',
      config.resourceDir + '/common/js/vendor/!(jquery.js)*',
      config.resourceDir + '/common/js/app.js'
    ], {
      base: config.resourceDir + '/common/js/'
    })
    .pipe($.if(!config.dev, $.concat(config.jsConcatName)))
    .pipe($.if(!config.dev, $.uglify({output: {comments: 'some'}})))
    .pipe(gulp.dest(config.destDir + '/common/js/'))
    .pipe($.size({title: 'scripts'}));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src([config.resourceDir + '/**/*.{jpg,png}'])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(config.destDir))
    .pipe($.size({title: 'images'}));
});

gulp.task('styles:main', function() {
  return gulp.src([
      config.resourceDir + '/**/*.scss'
    ])
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({'browsers': config.autoprefixerBrowsers}))
    .pipe($.if('*.css', $.csscomb()))
    .pipe($.if(!config.dev, $.if('*.css', $.cleanCss())))
    .pipe(gulp.dest(config.destDir))
    .pipe($.size({title: 'css'}));
});

gulp.task('styles', ['styles:main']);

gulp.task('htmlBuild', function(callback) {
  metalsmith(__dirname)
    .source(config.resourceDir)
    .destination(config.tmp)
    .use(ignore([
      '_layouts/**/*',
      'common/**/*',
      '**/*.scss'
    ]))
    .use(inplace({
      engine: 'nunjucks'
    }))
    .use(layouts({
      engine: 'nunjucks',
      directory: './_resource/_layouts'
    }))
    .build(function(err) {
      if (err) {
        console.log(err);
      }
      return callback();
    });
});

gulp.task('html', ['htmlBuild'], function() {
  return gulp.src([config.tmp + '/**/*.html'])
    .pipe(gulp.dest(config.destDir))
    .pipe($.size({title: 'html'}));
});

gulp.task('clean', function(callback) {
  del([config.destDir, config.tmp], {
    dots: true,
    force: true
  }).then(function() {
    return $.cache.clearAll(callback);
  });
});

gulp.task('server',
    ['scripts', 'html', 'images', 'styles:main', 'copy:favicon', 'copy:images'],
  function() {
  var browserSync = require('browser-sync').create();
  browserSync.init({
    files: config.destDir + '/**/*',
    notify: false,
    open: 'external',
    host: '127.0.0.1',
    server: {
      baseDir: config.openDir
    }
  });

  gulp.watch([
    config.resourceDir + '/**/*.html',
    '!' + config.resourceDir + '/common/js/**/*'
  ], ['html']);
  gulp.watch(
    [config.resourceDir + '/**/*.{scss,css}'],
    ['styles:main']
  );
  gulp.watch(
    [config.resourceDir + '/**/*.js'],
    ['scripts']
  );
  gulp.watch(
    [config.resourceDir + '/**/*.{jpg,png}'],
    ['images', browserSync.reload]
  );
  gulp.watch(
    [config.resourceDir + '/**/*.{gif,svg}'],
    ['copy:images', browserSync.reload]
  );
  gulp.watch(
    [config.resourceDir + '/**/*.ico'],
    ['copy:favicon', browserSync.reload]
  );
});

// Build Develop Files, the Default Task
gulp.task('default', ['clean'], function(callback) {
  runSequence('styles',
    ['scripts', 'html', 'images', 'styles:main', 'copy:favicon', 'copy:images'],
  callback);
});

// Build Production Files, the build Task
gulp.task('build', ['clean'], function(callback) {
  config.dev = false;
  // config.destDir = 'public';
  runSequence('styles',
    ['scripts', 'html', 'images', 'styles:main', 'copy:favicon', 'copy:images'],
  callback);
});
