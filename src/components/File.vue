<template>
  <div class="filelistbox">
    <div class="filelist">
      <div class="filebox" v-for="(file,index) in fileshow" :key="index">
        <pgbar v-if="fileup[index] && fileup[index] < 100" :now="fileup[index]"/>
        <div v-if="files[index] != 'del'" @mouseover="showname(index)" @mouseout="showname('')">
          <img :class="fileup[index] > 0  && fileup[index] < 100 ? 'fileuploading' : 'file'" @click="toBigpic(index)" :src="file" @error="e => { e.target.src = blankimg }"/>
          <div>
            <div class="fileboxbtn fa fa-refresh" @click="changeFile(index)" />
            <div class="fileboxbtn fa fa-times" @click="delFile(index)"/>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="filename">&nbsp;{{filename}}</div>
    </div>
    <button class="fileadd fa fa-plus" v-on:click="addFile()" />
    <input type="file" ref="file" class="hide" @change="tempFile($event)"/>
    <div :style="'width:' + bigpic.boxwidth + ';height:' + bigpic.boxheight" class="bigpicdisplay" v-if="bigpic.isshow">
      <div class="imgbox">
        <img @mousedown="zoommove" @mousewheel="zoom" :style="'left:' + bigpic.imgleft + 'px;top:' + bigpic.imgtop + 'px;width:' + bigpic.imgwidth + '%;height:' + bigpic.imgheight + '%;'" :src="bigpic.pic" @contextmenu="bigpic.isshow=false;bigpic.imgwidth=100;bigpic.imgheight=100" @error="e => { e.target.src = blankimg }">
        <!-- <img @mousedown="zoommove" @mousewheel="zoom" :style="'left:' + bigpic.imgleft + 'px;top:' + bigpic.imgtop + 'px;width:' + bigpic.imgwidth + '%;'" :src="bigpic.pic" @contextmenu="bigpic.isshow=false;bigpic.imgwidth=100;bigpic.imgheight=100" @error="e => { e.target.src = blankimg }"> -->
      </div>
      <pgbar class="middle" v-if="downloadRate > 0 && downloadRate < 100" :now="downloadRate" :h="1.5"/>
      <div class="bottom bigpicfilename">
        <span>&nbsp;{{bigpic.filename}}</span>
      </div>
      <div class="bottom bigpicfilebtn">
        <button v-if="bigpic.isdownload" class="bigpicbtn fa fa-download" @click="download()" />
        <button class="bigpicbtn fa fa-eye" @click="resize()" />
        <button class="bigpicbtn fa fa-arrows-alt" @click="setimgheight()" />
      </div>
    </div>
  </div>
</template>

<script>
import req from '../js/req'
import blankimg from '../assets/blank.png'
import pgbar from './com/progressbar'
// 文件上传及展示模块
export default {
  name: 'file',
  components: {
    pgbar
  },
  props: {
    lin: {},
    filefrom: String
  },
  data: function() {
    return {
      blankimg,
      filename: '',
      baseurl: '',
      bigpic: {
        filename: '',
        pic: '',
        isshow: false,
        isdownload: true,
        index: 0,
        boxwidth: '50%',
        boxheight: '50%',
        imgleft: 0,
        imgtop: 0,
        imgwidth: 100,
        imgheight: 100,
        imgheightval: 100,
        imgzoom: 100
      },
      downloadRate: 0,
      fileup: [],
      filelist: [],
      fileshow: [],
      files: [],
      flin: {},
      refreshindex: false,
      refreshfin: 0,
      refreshmax: 0,
      newindex: 0
    }
  },
  created: function() {
    this.t('reg file part')
    this.$bus.off('editdone')
    this.$bus.on('editdone', this.confirm)
    this.$ipc.removeAllListeners('downloadRate')
    this.$ipc.on('downloadRate', (event, e) => {
      this.setDownloadRate(e)
    })
    this.flin = this.lin
    this.filelist = this.flin.file && this.flin.file !== '' ? this.flin.file.split(',') : []
    this.baseurl = this.$store.state.conf.conf.api
    for (var i in this.filelist) {
      this.fileshow[i] = this.baseurl + this.filelist[i]
    }
    this.newindex = this.filelist.length
  },
  watch: {
    'bigpic.imgheightval'(newval, oldval) {
      this.bigpic.imgheight = this.bigpic.imgheight ? newval : false
    }
  },
  methods: {
    // 文件预览
    toBigpic(i) {
      this.bigpic.isshow = true
      this.bigpic.pic = this.fileshow[i]
      this.bigpic.filename = this.getfilename(i)
      this.bigpic.isdownload = !(this.filelist[i] === undefined)
      this.bigpic.index = i
      this.resetzoom()
    },
    showname(i) {
      this.filename = this.getfilename(i)
    },
    getfilename(i) {
      if (i === '') {
        return ''
      }
      return this.filelist[i] === undefined ? this.files[i].name : this.filelist[i].substring(2)
    },
    setDownloadRate(e) {
      this.t(e)
      if (e === 'shut') e = 0
      this.downloadRate = e
    },
    download() {
      var i = this.bigpic.index
      this.downloadRate = 0
      this.electronDownload(i)
    },
    resize() {
      this.bigpic.boxwidth = this.bigpic.boxwidth === '100%' ? '50%' : '100%'
      this.bigpic.boxheight = this.bigpic.boxheight === '100%' ? '50%' : '100%'
      this.resetzoom()
    },
    resetzoom() {
      this.bigpic.imgleft = 0
      this.bigpic.imgtop = 0
      this.bigpic.imgwidth = 100
      this.bigpic.imgheightval = 100
    },
    zoom(e) {
      // console.log(e.deltaY)
      if (e.deltaY > 0) { // zoom in
        this.bigpic.imgleft += 15;
        this.bigpic.imgtop += 15;
        this.bigpic.imgwidth -= 15;
        this.bigpic.imgheightval -= 15;
      } else {
        this.bigpic.imgleft -= 15;
        this.bigpic.imgtop -= 15;
        this.bigpic.imgwidth += 15;
        this.bigpic.imgheightval += 15;
      }
    },
    zoommove(e) {
      e.preventDefault()
      e.target.addEventListener('mousemove', this.moving)
      var that = this
      e.target.addEventListener('mouseup', function(el) {
        e.target.removeEventListener('mousemove', that.moving);
      })
    },
    moving(e) {
      this.bigpic.imgleft += e.movementX
      this.bigpic.imgtop += e.movementY
    },
    setimgheight() {
      this.bigpic.imgheight = this.bigpic.imgheight ? false : this.bigpic.imgheightval
    },
    electronDownload(i) {
      var d = {
        path: this.baseurl + this.filelist[i],
        name: this.getfilename(i)
      }
      this.$ipc.send('download', d)
    },
    // end文件预览
    // 文件操作
    changeFile(i) {
      this.refreshindex = i
      this.refreshtype = 'update'
      this.$refs.file.click()
    },
    delFile(i) {
      this.files[i] = 'del'
      this.filename = ''
    },
    addFile() {
      this.refreshindex = this.newindex
      this.refreshtype = 'new'
      this.$refs.file.click()
    },
    tempFile(event) {
      event.preventDefault()
      var file = this.$refs.file.files[0]
      this.files[this.refreshindex] = file
      var img = new FileReader()
      img.addEventListener('load', (e) => {
        if (e.loaded < 20 * 1024 * 1024) this.fileshow[this.refreshindex] = e.target.result
        else this.fileshow[this.refreshindex] = e
        if (this.refreshtype === 'new') this.newindex += 1
      })
      img.addEventListener('progress', (e) => {
        this.fileup[this.refreshindex] = (e.loaded / e.total) * 100
      })
      img.onloadstart = ({ target }) => {
        this.fileshow[this.refreshindex] = this.blankimg
      }
      img.readAsDataURL(file)
    },
    confirm(nlin) {
      this.tlin = nlin
      this.t('')
      this.t('')
      this.t('')
      this.t('indone------------------------------')
      this.t(this.filelist, 'filelist')
      this.t(this.files, 'files')
      this.t(this.fileshow, 'fileshow')
      for (var i in this.files) {
        this.refreshmax += 1
      }
      if (this.refreshmax === 0) this.$bus.emit('editalldone')
      for (i in this.files) {
        if (this.files[i] === 'del') {
          this.toDel(i)
        } else if (!this.filelist[i]) {
          this.toUpload(i)
        } else {
          this.toDel(i)
          this.toUpload(i)
        }
      }
    },
    toUpload(i) {
      var formData = new FormData()
      formData.append('file', this.files[i])
      this.t('upload')
      this.t(i, 'upload')
      var uploadProgress = (pEvent) => {
        this.fileup[i] = Number(
          ((pEvent.loaded / pEvent.total) * 95).toFixed(2)
        )
      }
      req.upload(this.$store.state.conf, 'fupload', formData, uploadProgress).then((res) => {
        if (res.status) {
          if (res.data !== 'mis') {
            this.filelist[i] = res.data
            this.fileshow[i] = this.baseurl + res.data
            this.files[i] = null
            this.fileup[i] = 100
            this.refreshfin += 1
            this.checkfin()
          }
        }
      })
    },
    toDel(i) {
      var file = this.filelist[i]
      this.t('del--')
      this.t(i, 'del')
      this.t(file, 'del')
      if (file === undefined) {
        this.t('nofile', 'del')
        this.refreshfin += 1
        this.filelist[i] = ''
        this.checkfin()
        return
      }
      req.post('fdel', {del: file}).then((res) => {
        if (res.status) {
          if (res.data === 'done') {
            this.t('done', 'del')
            this.refreshfin += 1
            this.filelist[i] = ''
            this.checkfin()
          } else {
            this.t('mis', 'del')
          }
        }
      })
    },
    checkfin() {
      this.t('isfin-----------------------------')
      this.t(this.refreshfin + '--' + this.refreshmax)
      if (this.refreshfin === this.refreshmax) {
        this.saveNote()
      }
    },
    saveNote() {
      this.t('saving file')
      this.t(this.filelist, 'save1')
      for (var i in this.filelist) {
        while (this.filelist[i] === '') {
          this.filelist.splice(i, 1)
        }
      }
      this.t(this.filelist, 'save2')
      this.flin.file = this.filelist.join(',')
      this.t(this.flin.file, 'save3')
      var cmd = 'save'
      if (this.filefrom === 'note') {
        cmd = 'nsave'
      }
      req.post(this.$store.state.conf, cmd, this.flin).then((res) => {
        this.t('save back')
        this.$bus.emit('editalldone', this.tlin)
      })
    },
    // end文件操作
    t(a, txt = '') {
      console.log('FILE--------------------------------------------------------------------')
      if (txt !== '') console.log(txt)
      console.log(a)
    }
  }
}
</script>

<style lang="stylus" scoped>
.filebox
  display inline-block
  width 6rem
  transform rotate3d(40,-200,-20,55deg)
  transform-origin left
  margin-left -3rem
  padding-top 1rem
  &:hover
    padding-top 0rem
    .fileboxbtn{
      display inline-block
    }
.file
  border solid 1px red
  height 6rem
  width 6rem
.fileuploading
  border solid 1px red
  height 5rem
  width 5rem
  margin .5rem
.fileboxbtn
  display none
  width 45%
  margin-left 2%
  text-align center
  background none
  border solid 1px red
  color red
  &:hover
    color white
    background red
.filelist
  margin-left 4rem
  height 8rem
.filelistbox
  margin 2rem 0px
.fileadd
  margin .5rem 0px
.hide
  display none
.bigpicdisplay
  position fixed
  top 50%
  left 50%
  transform translate(-50%,-50%)
  color white
  font-size 11px
  line-height 1.5rem
  text-align center
.bigpicdisplay .imgbox
  position relative
  height 100%
  width 100%
  border solid 1px red
  overflow hidden
.bigpicdisplay img
  position absolute
.bigpicdisplay .bottom
  width 100%
  position absolute
  bottom -1.7rem
  border solid 1px red
.bigpicfilename
  background red
.bigpicfilebtn
  height 1.5rem
  &:hover
    .bigpicbtn
      display inline-block
.bigpicbtn
  display none
  float right
  background red
  border none
  color white
  font-size 1rem
  padding 0px .7rem
  line-height 1.5rem
  clip-path polygon(0% 0%,80% 0%,100% 20%,100% 100%,20% 100%,0% 80%)
  &:hover
    background white
    color red
.middle
  position absolute
  top 50%
  left 50%
  transform translate(-50%,-50%)
.filename
  text-align center
</style>
