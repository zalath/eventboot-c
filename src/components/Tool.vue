<template>
  <div>
    <div id="app" v-if="showTool">
      <div class="largeTarget" :class="{hide: !isLargeTarget}" @contextmenu="toggleLarge()">
        <div class="pre fullsize">
          <pre v-if="isjson" class="fullsize ov">{{targetval}}</pre>
          <div v-else-if="isqr" class="qr fullsize ov" ref="qrCodeBox">
          </div>
          <textarea v-else v-model="targetval" class="fullsize ov"/>
        </div>
        <div class="pre fullsize">
        </div>
      </div>
      <div class="toolbox">
        <div class="txtbox">
          <div class="fullsize origin pa" :class="{txttop: !showTarget}" @click="toggleTarget(false)">
            <textarea placeholder="原文" v-model="originval" class="fullsize ov"/>
          </div>
          <div class="fullsize target pa" :class="{txttop: showTarget}">
            <textarea placeholder="处理后" v-model="targetval" class="fullsize ov"/>
          </div>
        </div>
        <div class="cb"/>
        <div class="clipbtn" @click="setShowTool(false)">
          <i class="fa fa-caret-down"/>
        </div>
        <div>
          <div class="clipbtn fr" @click="deQrcode()">
            <i class="fa fa-circle"/>
            <input type="file" style="display:none" ref="qrde" @change="deQrcodeFile($event)">
          </div>
          <div class="clipbtn fr" @click="toggleLarge()">
            <i class="fa fa-sort"/>
          </div>
          <div class="clipbtn fr" @click="toggleTarget()">
            <i class="fa fa-retweet"/>
          </div>
          <div class="clipbtn fr" @click="copy(targetval)">
            <i class="fa fa-copy"/>
          </div>
          <div class="clipbtn fr" @click="()=>{originval=''}">
            <i class="fa fa-refresh"/>
          </div>
        </div>
        <div class="cb"/>
        <div class="toolbtn clipbtn" @click="base64()">
          b64.en
        </div>
        <div class="toolbtn clipbtn" @click="debase64()">
          b64.de
        </div>
        <div class="toolbtn clipbtn" @click="url()">
          url.en
        </div>
        <div class="toolbtn clipbtn" @click="deurl()">
          url.de
        </div>
        <div class="toolbtn clipbtn" @click="md5()">
          md5
        </div>
        <div class="toolbtn clipbtn" @click="jsonconvert()">
          json
        </div>
        <div class="toolbtn clipbtn" @click="qrcode()">
          QR
        </div>
        <div class="cb"/>
        <div class="toolbtn clipbtn" @click="timeconvert()">
          time
        </div>
        <div class="toolbtn clipbtn" @click="copy(ip)">
          {{ip}}
        </div>
        <div class="toolbtn clipbtn" @click="deQrcode()">
          读取二维码
        </div>
        <div class="toolbtn clipbtn" @click="getclist()">
          加密测试
        </div>
        <div class="cb"/>
        <div class="toolbtn clipbtn" @click="copy(timestamps)">
          {{timestamps}}
        </div>
        <div class="toolbtn clipbtn" @click="copy(timestamp)">
          {{timestamp}}
        </div>
        <div class="toolbtn clipbtn" @click="copy(dateval)">
          {{dateval}}
        </div>
        <div class="toolbtn clipbtn" @click="settime()">
          <i class="fa fa-refresh"/>
        </div>
      </div>
      <input ref="inputCopy" value="for copy" style="opacity:0;position:absolute" />
      <br/>
    </div>
    <div class="toolbox" v-if="!showTool">
      <div class="clipbtn" @click="setShowTool(true)">
        <i class="fa fa-caret-up"/>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import QRCode from 'qrcodejs2'
import jsQR from 'jsqr'
const Ip = require('ip')
const base64 = require('js-base64').Base64
export default {
  name: 'Tool',
  components: {
  },
  data: function() {
    return {
      dateval: '',
      timestamp: '',
      timestamps: '',
      originval: '',
      targetval: '',
      ip: Ip.address(),
      isLargeTarget: false,
      showTarget: false,
      isjson: false,
      isqr: false,
      showTool: true,
      qrdeResult: null,
      qrdeError: null,
      qrdeDragover: false
    }
  },
  created: function() {
    this.$bus.on('setShowTool', this.setShowTool)
    this.settime()
  },
  methods: {
    genclist: function() {
      this.$ipc.send('genclist')
    },
    settime: function() { // 重置时间块到当前时间
      this.timestamp = new Date().valueOf()
      this.timestamps = parseInt(this.timestamp / 1000)
      this.dateval = this.datefmt(new Date())
    },
    timeconvert: function() { // 将输入框中的值转化后展示在时间块内
      this.timestamp = Date.parse(this.originval)
      this.timestamps = Date.parse(this.originval) / 1000
      if (isNaN(this.timestamp)) {
        this.timestamps = this.datefmt(new Date(this.originval * 1000))
      }
      this.toggleTarget(false)
    },
    jsonconvert: function() {
      if (!this.originval) return
      this.targetval = JSON.parse(this.originval)
      this.toggleLarge(true)
      this.isjson = true
    },
    copy: function(text) {
      navigator.clipboard.writeText(text)
    },
    datefmt(date) {
      var fmt = 'yyyy-MM-dd hh:mm:ss'
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + ''));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
      return fmt;
    },
    base64: function() {
      console.log(this.originval)
      console.log(this.targetval)
      this.targetval = base64.encode(this.originval)
      console.log(this.originval)
      console.log(this.targetval)
      this.toggleTarget(true)
    },
    debase64: function() {
      this.targetval = base64.decode(this.originval)
      this.toggleTarget(true)
    },
    url: function() {
      this.targetval = encodeURIComponent(this.originval)
      this.toggleTarget(true)
    },
    deurl: function() {
      this.targetval = decodeURIComponent(this.originval)
      this.toggleTarget(true)
    },
    md5: function() {
      this.targetval = md5(this.originval)
      this.toggleTarget(true)
    },
    qrcode: function() {
      this.isqr = true
      this.toggleLarge(true)
      var that = this
      setTimeout(function() {
        that.$refs.qrCodeBox.innerHTML = null
        var qr = new QRCode(that.$refs.qrCodeBox, {
          text: that.originval,
          width: 500,
          height: 500,
          colorDark: '#333',
          colorLight: '#fff',
          correctLevel: QRCode.CorrectLevel.H
        })
        qr.width = 1000
      }, 500)
    },
    deQrcode: function() {
      // var file = 'data:image/png;base64,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';
      this.$refs.qrde.click();
    },
    deQrcodeFile: function(event) {
      console.log('infileupload')
      event.preventDefault();
      var file = this.$refs.qrde.files[0]
      console.log(file)
      var fr = new FileReader()
      console.log('reader new')
      fr.onload = function(e) {
        console.log('1')

        // const data = png.decode(e.target.result);
        // const out = {
        //   data: new Uint8ClampedArray(png.toRGBA8(data)[0]),
        //   height: data.height,
        //   width: data.width
        // };
        // const code = jsQR(out.data, out.width, out.height);
        var f = e.target.result
        console.log(f)
        var img = new Image()
        img.src = f
        console.log(img.width, img.height)
        var code = jsQR(f, img.width, img.height)
        console.log(code)
      }
      fr.readAsDataURL(file)
    },
    getclist() {
      console.log('in')
      this.$ipc.send('genclist', '');
    },
    toggleTarget: function(is) {
      this.showTarget = typeof is === typeof true ? is : !this.showTarget
    },
    toggleLarge: function(is) {
      this.isLargeTarget = typeof is === typeof true ? is : !this.isLargeTarget
      this.isjson = this.isLargeTarget === false ? false : this.isjson
      this.isqr = this.isLargeTarget === false ? false : this.isqr
    },
    toggleShow: function(is) {
      this.isShowJson = true
    },
    setShowTool: function(is) {
      this.showTool = is
    }
  }
}
</script>

<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
<style scoped lang="stylus">
lv = #00d944
textareaScroll(lv)
textarea
  background-color black
  border solid 1px red
  color red
  outline none
.toolbox
  position fixed
  right 20px
  bottom 20px
.txtbox
  position relative
  width 100%
  height 3rem
  margin .8rem .2rem
.fullsize
  position relative
  height 100%
  width 100%
  font-size 1.2rem
.txttop
  z-index 20
.target
  left -5px
  .fullsize
    border solid 1px lv
    color lv
  &::before
    cursor pointer
    content ""
    background lv
    position absolute
    left -5px
    width 5px
    top 0
    height 1.2rem
    clip-path polygon(0 0,100% 0,100% 100%,0 70%)

.origin
  top -5px
  &::before
    cursor pointer
    content ""
    background red
    position absolute
    top -5px
    height 5px
    width 1.5rem
    clip-path polygon(0 0,70% 0,100% 100%,0 100%)
.largeTarget
  position fixed
  width 60%
  height 60%
  left 50%
  top 50%
  transform translate(-50%,-50%)
  z-index 20
  font-size 1.2rem
  font-weight bold
  &::before
    content ""
    position absolute
    left -.7rem
    top -1px
    width .7rem
    height 15rem
    background lv
    clip-path polygon(0 0,100% 0,100% 100%,0 95%)
  pre,.qr,textarea
    padding 1rem
    background black
    border solid 1px lv
    color lv
    margin 0
  textarea::-webkit-resizer
    border-right solid 1px lv
    border-bottom solid 1px lv
.toolbtn
  margin .3rem .2rem
.hide
  display none
.cb
  clear both
.ov
  overflow scroll
.pa
  position absolute
.fr
  float right
</style>
<style lang="stylus">
.qr
  img
    position absolute
    left 50%
    top 50%
    transform translate(-50%,-50%)
</style>
