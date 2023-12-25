const peggy = require('peggy')
const uglify = require('uglify-js')
const fs = require('fs')

const grammar = fs.readFileSync(__dirname + '/parser-grammar.peggy').toString()
const parser = peggy.generate(grammar)

const parserStr = parser.SyntaxError.toString()
    + ';peg$SyntaxError.buildMessage = ' + parser.SyntaxError.buildMessage.toString()
    + ';module.exports = ' + parser.parse.toString()
const compress = uglify.minify(parserStr).code

fs.writeFileSync(__dirname + '/../src/parser-compiled.js', compress)
