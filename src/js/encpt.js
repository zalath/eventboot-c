'use strict'

const cyt = require('crypto');
class encpt { }
encpt.getencyt = function() {
  return cyt.getHashes()
}
encpt.encemp = function(win) {
  // encpt.test()
  var str = 'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd' +
  'sdafjlsajdadsfassdfasddddsdfasdfadfasdfassadfgfdgjhgjhfgjkfhjlfghjsdfgsadfasasdfasdfasdfasdfddd';
  console.log('源')
  console.log(str)
  const enced = encpt.enc(str)
  console.log('加密')
  console.log(enced)
  const dec = encpt.dec(enced, win)
  console.log('解密')
  console.log(dec)
  if (str === dec) {
    console.log('================')
  } else {
    console.log('xxxxxxxxxxxxxxx')
  }
}
encpt.password = 'FnJL7EDzjqWjcaY9'
encpt.encpass = function(pass, val, win) {
  this.password = pass
  var res = this.enc(val)
  console.log(res)
  return res;
}
encpt.enc = function(str) {
  var encing = '';
  var enced = '';
  var password = this.password;
  const iv = 'FnJL7EDzjqWjcaY9';
  const crypto = require('crypto');
  while (str.length) {
    encing = str.slice(0, 15)
    str = str.slice(15)
    const cipher = crypto.createCipheriv('aes-128-cbc', password, iv);
    cipher.update(encing, 'utf8', 'hex')
    const data3 = cipher.final('hex');
    enced = enced + data3 + '-V-';
  }
  return enced
}
encpt.decpass = function(pass, val, win) {
  this.password = pass
  var res = this.dec(val, win)
  return res
}
encpt.dec = function(enced, win) {
  var dec = ''
  const deencing = enced.split('-V-')
  var password = this.password;
  const iv = 'FnJL7EDzjqWjcaY9';
  const crypto = require('crypto');
  for (var i = 0; i < deencing.length; i++) {
    if (deencing[i] === '') break;
    const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);
    decipher.update(deencing[i].toString(), 'hex', 'utf8')
    try {
      const data4 = decipher.final().toString()
      dec = dec + data4
    } catch (e) {
      console.log(e)
      win.webContents.send('passcopy', 'error')
      return
    }
  }
  return dec
}
module.exports = encpt
