'use strict';

var gulp = require('gulp');
var gUtil = require('gulp-util');
var gClean = require('gulp-clean');
var msxLogic = require('./msxLogic');

var msx = require('./vendor/msx/msx-main');
var through = require('through2');

function msxTransform(name) {
  return through.obj(function (file, enc, cb) {
    try {
      file.contents = new Buffer(msx.transform(file.contents.toString()));
    }
    catch (err) {
      err.fileName = file.path;
      this.emit('error', new gUtil.PluginError('msx', err));
    }
    this.push(file);
    cb();
  });
}

console.log('test for gulp-msx-logic')

gulp.task('clean', function () {
  return gulp.src('./test/build/**.*', {read: false})
    .pipe(gClean());
});

gulp.task('msx-logic', function() {
  return gulp.src('./test/src/*.txt')
    .pipe(msxTransform())
    .pipe(msxLogic({showFiles:true}))
    .pipe(gulp.dest('./test/build'))
    .on('error', function(e) {
      console.error(e.message + '\n  in ' + e.fileName);
    });
});

gulp.task('test', ['clean', 'msx-logic'], function () {
  require('./test/test.js');
});

