'use strict'

/**
 * read file by lines
 * encrypt secret lines
 * check for sever to get decrypt pwd
 * if not, ask for password if is needed for every first time
 */
class keyfile { }
keyfile.getkeyfile = function(win) {
  var path = process.cwd() + '/path'
  var fs = require('fs')
  fs.readFile(path, 'utf8', function (err, data) {
    if (!err) {
      global.keyfile = JSON.parse(data)
    } else {
      global.keyfile = []
    }
  });
}
keyfile.setkeyfile = function(win, data) {
  var path = process.cwd() + '/path'
  var fs = require('fs')
  var reg = new RegExp(/\\/g)
  global.keyfile = data
  var confdata = JSON.stringify(data)
  fs.writeFile(path, confdata, function() {
    if (win !== null && win != undefined) win.webContents.send('keyfilesaved');
  })
}
module.exports = keyfile
