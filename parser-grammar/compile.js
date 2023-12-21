const peggy = require('peggy')
const uglify = require('uglify-js')
const fs = require('fs')

const grammar = fs.readFileSync(__dirname + '/parser-grammar.peggy').toString()
const parser = peggy.generate(grammar)
const compress = 'module.exports = ' + uglify.minify(parser.parse.toString()).code

fs.writeFileSync(__dirname + '/../src/parser-compiled.js', compress)
