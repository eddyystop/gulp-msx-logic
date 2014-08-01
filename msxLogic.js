/* jshint node:true */
'using strict';
var fs = require('fs');
var path = require('path');

var through = require('through2');
var gutil = require('gulp-util');

var magenta = gutil.colors.magenta;
var cyan = gutil.colors.cyan;

function msxLogic(options) {
  options = options || {};
  options.showFiles = typeof options.showFiles === 'string' ?
    options.showFiles : (options.showFiles ? 'msx-logic:' : false);
  var regex = /\/\*\%|\%\*\//g;

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    try {
      var str = file.contents.toString();
      str = str.replace(regex, '');
    } catch(e) {
      this.emit('error', e);
      return cb();
    }

    file.contents = new Buffer(str);

    if (options.showFiles) {
      gutil.log(options.showFiles, magenta(path.relative(file.cwd, file.path)));
    }

    this.push(file);
    cb();
  });
}

module.exports = msxLogic;
