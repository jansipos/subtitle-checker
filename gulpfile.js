const { src, dest, series } = require('gulp')
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default
const minify = require('gulp-htmlmin')
const replace = require('gulp-replace')
const del = require('del')

const bundleFiles = []

function clean(cb) {
  del('dist/**')
  cb()
}

function html(cb) {
  src('index.html')
  .pipe(replace(/<script src="(.+?)"><\/script>/g, function(match, p1, offset, string) {
    bundleFiles.push(p1)
    return ''
  }))
  .pipe(replace('</body>', '<script src="bundle.js"></script></body>'))
  .pipe(minify({
    minifyCSS: true,
    collapseWhitespace: true,
    minifyJS: true,
    processScripts: ['x-tmpl-mustache']
  }))
  .pipe(dest('dist'))
  .on('end', cb)
}

function js(cb) {
  const uglifyOptions = {
    output: {
      comments: false
    }
  }
  src(bundleFiles)
  .pipe(concat('bundle.js'))
  .pipe(uglify(uglifyOptions))
  .pipe(dest('dist'))
  
  cb()
}

exports.default = series(clean, html, js)