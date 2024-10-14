'use strict'

const { default: req } = require('./req');

class conf { }
conf.getconfig = function() {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  fs.readFile(path, 'utf8', function (err, data) {
    if (!err) {
      global.gconf = JSON.parse(data)
    }
  });
}
conf.getapi = function(win) {
  var pre = global.gconf.conf.api.substring(0, global.gconf.conf.api.lastIndexOf('.') + 1)
  for (let i = 1; i < 256; i++) {
    var fullip = pre + i + ':10488/';
    // console.log(fullip)
    this.checkapi(fullip, win)
  }
}
conf.checkapi = function(ip, win) {
  var ipreq = ip + 'ping';
  req.ipget(ipreq).then((res) => {
    if (res.data.message === 'pong') {
      global.gconf.conf.api = ip
      this.setconfig(null, global.gconf)
      win.webContents.send('loaded', global.gconf)
      win.webContents.send('taskreload')
    }
  }).catch((res) => {
    // console.log(res)
    // console.log('api check error 0')
  })
}
conf.setconfig = function(win, data) {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  var reg = new RegExp(/\\/g)
  for (var i = 0; i < data.boot.length; i++) {
    data.boot[i] = data.boot[i].replace(reg, '/')
  }
  for (i = 0; i < data.starter.length; i++) {
    if (typeof data.starter[i] !== 'string') {
      data.starter[i].path = data.starter[i].path.replace(reg, '/')
    }
  }
  global.gconf = data
  var confdata = JSON.stringify(data)
  if (win !== null) win.webContents.send('initd', data)
  fs.writeFile(path, confdata, function() {
    if (win !== null) win.webContents.send('confsaved');
  })
}
module.exports = conf
