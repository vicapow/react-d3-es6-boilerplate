var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var es6ify = require('es6ify')
var reactify = require('reactify')
var xtend = require('xtend')
var mkdirp = require('mkdirp')
var express = require('express')
var app = express()

mkdirp.sync(__dirname + '/client/_build/js')

app.use('/', express.static(__dirname + '/client'))

app.get('/_build/js/bundle.js', function(req, res) {
  res.type('.js')
  watchify(browserify(xtend(watchify.args, {debug: true})))
    .external('react')
    .external('d3')
    .add(es6ify.runtime)
    .transform(reactify)
    // compile all .js files except the ones coming from node_modules
    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .require(require.resolve('./src/js/main.js'), {entry: true})
    .bundle()
    .on('error', function(err) {
      console.error(err.message)
      res.status(500).send(err)
      this.emit('end')
    })
    .pipe(res)
})

app.get('/_build/js/third-party.js', function(req, res) {
  res.type('.js')
  var bundle = browserify({debug: true})
    .require('react')
    .require('d3')
    .bundle()
  bundle.pipe(res)
  bundle.pipe(fs.createWriteStream(__dirname + '/client/_build/js/third-party.js'))
})

var server = app.listen(3000)