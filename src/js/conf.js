'use strict'

const { default: req } = require('./req');

class conf { }
conf.getconflist = function(win) {
  // 获取后台的配置文件列表
  req.get('conflist').then((res) => {
    win.webContents.send('conflist', res.data)
  })
}
conf.setconfname = function(win, name) {
  // save remote config file name to c.json
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  fs.writeFile(path, name, function (err) {
    if (err) return console.log(err)
    else conf.getconfig(win)
  })
}
conf.getconfig = function(win) {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  fs.readFile(path, 'utf8', function (err, data) {
    if (!err) {
      req.post('getconffile', {filename:data}).then((res) => {
        global.gconf = JSON.parse(res.data)
        global.gconf.conffilename = data
        win.webContents.send('loaded', global.gconf)
        win.webContents.send('taskreload')
      })
    }
  });
}
conf.getapi = function(win) {
  var pre = global.gconfapi == undefined? 'http://192.168.2.1' : global.gconfapi
  pre = pre.substring(0, pre.lastIndexOf('.') + 1)
  for (let i = 1; i < 256; i++) {
    var fullip = pre + i + ':10488/';
    this.checkapi(pre + i, fullip, win)
  }
}
conf.checkapi = function(ip, url, win) {
  var ipreq = url + 'ping';
  req.ipget(ipreq).then((res) => {
    if (res.data.message === 'pong') {
      global.gconfapi = url
      this.getconfig(win)
      this.changeFTPip(ip)
      win.webContents.send('setapi',url)
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
  if (win !== null) win.webContents.send('initd', data)
  fs.readFile(path, 'utf8', function (err, filename) {
    if (!err) {
      var confdata = JSON.stringify(global.gconf)
      req.post('setconffile', { content: confdata, filename: filename }).then((res) => {
        if (win !== null) win.webContents.send('confsaved')
      })
    }
  });
}
conf.changeFTPip = function(ip) {
  ip = ip.replace(/http:\/\//g, '')
  const ftpconfpath = 'c:/Users/Administrator/AppData/Roaming/FileZilla/sitemanager.xml';
  // 读取文件内容
  var fs = require('fs')
  let ftpconfdata = fs.readFileSync(ftpconfpath, 'utf8')
  // 替换配置中的字符串为新ip
  ftpconfdata = ftpconfdata.replace(/192\.168\.\d{1,3}\.\d{1,3}<\/Host>\n\t\t\t<Port>2121<\/Port>/g, ip + '</Host>\n\t\t\t<Port>2121</Port>')
  fs.writeFileSync(ftpconfpath, ftpconfdata)
}
module.exports = conf
