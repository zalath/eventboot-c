'use strict'

const { default: req } = require('./req');

class conf { }
conf.getconfig = function() {
  var path = process.cwd() + '/c.json'
  var fs = require('fs')
  fs.readFile(path, 'utf8', function (err, data) {
    if (!err) {
      global.gconf = JSON.parse(data)
    } else {
      const defaultConf = '{"starter":[],"boot":[],"conf":{"api":"http://192.168.2.1:10488/","src":""}}'
      conf.setconfig(null, JSON.parse(defaultConf))
    }
  });
}
conf.getapi = function(win) {
  var pre = global.gconf.conf.api.substring(0, global.gconf.conf.api.lastIndexOf('.') + 1)
  for (let i = 1; i < 256; i++) {
    var fullip = pre + i + ':10488/';
    // console.log(fullip)
    this.checkapi(pre + i, fullip, win)
  }
}
conf.checkapi = function(ip, url, win) {
  var ipreq = url + 'ping';
  req.ipget(ipreq).then((res) => {
    if (res.data.message === 'pong') {
      global.gconf.conf.api = url
      this.setconfig(null, global.gconf)
      win.webContents.send('loaded', global.gconf)
      win.webContents.send('taskreload')
      this.changeFTPip(ip)
    }
  }).catch((res) => {
    // console.log(res)
    // console.log('api check error 0')
  })
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
