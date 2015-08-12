/*globals require: false, __dirname: false*/

var
  gulp    = require('gulp'),
  gutil   = require('gulp-load-utils')(['date']),
  header  = require('gulp-header'),
  _jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  Karma   = require('karma').Server,
  _uglify = require('gulp-uglify'),
  rename  = require('gulp-rename'),
  pkg     = require('./bower.json'),
  
  opt  = {
    pkg  : pkg,
    date : gutil.date("yyyy-mm-dd")
  },

  banner = [
    '/**',
    ' * <%= pkg.name %> - v<%= pkg.version %> - <%= date %>',
    ' * <%= pkg.homepage %>',
    ' *',
    ' * Copyright (c) <%= new Date().getFullYear() %> <%= pkg.authors[0] %>',
    ' * License <%= pkg.license %>',
    ' */\n'
  ].join('\n');

gulp.task(jshint);

function jshint() {

  'use strict';

  var
    options = { lookup : true };

  return gulp.src([
      'angular-pager.js',
      'angular-pager.spec.js'
    ])
    .pipe(_jshint(options))
    .pipe(_jshint.reporter(stylish))
    .pipe(_jshint.reporter('fail'));
}

gulp.task(test);

function test(done) {

  'use strict';

  new Karma({
    configFile : __dirname + '/karma.conf.js',
    singleRun  : true
  }, done).start();
}

gulp.task(uglify);

function uglify() {

  'use strict';

  return gulp.src('angular-pager.js')
    .pipe(_uglify())
    .pipe(header(banner, opt))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./'));
}

gulp.task('build', gulp.series(jshint, test, uglify));

