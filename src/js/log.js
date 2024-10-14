'use strict'
class log {
  log = function(txt, exname) {
    var path = process.cwd() + '/log' + exname
    var fs = require('fs')
    fs.appendFile(path, txt + "\n")
  }
}
module.exports = log
