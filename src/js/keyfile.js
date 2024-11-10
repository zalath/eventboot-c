'use strict'

/**
 * read file by lines
 * encrypt secret lines
 * check for sever to get decrypt pwd
 * if not, ask for password if is needed for every first time
 */
const req = require('./req')
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
keyfile.synckeyfile = function(win, data) {
  req.post(global.gconf, "/setkeyfile", data).then((res)=>{
    win.webContents.send('keyfilesaved')
  })
}
keyfile.downloadfile = function(win) {
  req.get(global.gconf, "/readkeyfile").then((res)=>{
    Keyfile.setkeyfile(win, res)
    win.webContents.send('keyfilesaved')
  })
}
module.exports = keyfile
