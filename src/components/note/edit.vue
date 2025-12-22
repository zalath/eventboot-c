<template>
  <div class="edit" v-if="isshow">
    <div v-if="title == 'new'" class="tc"><i class="fa fa-plus"/></div>
    <div v-if="title == 'edit'" class="tc"><i class="fa fa-pencil"/></div>
    <div>
      <textarea class="input" rows="2" v-model="lin.title" />
    </div>
    <div>
      <textarea class="input" rows="2" v-model="lin.cmt" />
    </div>
    <div :class="'contentbox ' + contentFullPlace"></div>
    <div :class="contentFullStyle">
      <div class="contentbtns">
        <button class="fa fa-expand" @click="contentFull()"/>
        <button :class="'fa fa-link ' + editcontent" @click="contentInsert('link')"/>
        <button :class="'fa fa-image ' + editcontent" @click="contentInsert('image')"/>
      </div>
      <div :class="'contentbox ' + contentH100">
        <div :class="'content editpart '+editcontent">
          <textarea ref="contentEdit" class="input" rows="20" v-model="lin.content" @contextmenu="contentSwitch()" @change="renderTxt($event, lin.content)"/>
        </div>
        <div :class="'content showpart '+showcontent" @contextmenu="contentSwitch()" v-html="renderedMarkdown"></div>
      </div>
      <div style="clear:both"/>
    </div>
    <file :lin="lin" :filefrom="'note'"/>
    <div class="btns">
      <button class="fa fa-check" v-on:click="submit()" />
      <button class="fa fa-times" v-on:click="close()" />
    </div>
  </div>
</template>
<script>
import req from '../../js/req';
import file from '../File';
export default {
  name: 'edit',
  components: {
    file
  },
  data: function () {
    return {
      isshow: false,
      pid: '',
      lin: {},
      title: '',
      renderedMarkdown: '',
      contentFullStyle: '',
      contentFullPlace: 'hide',
      editcontent: 'hide',
      showcontent: '',
      contentH100: ''
    };
  },
  created() {
    this.$bus.off('nedit')
    this.$bus.off('nnew')
    this.$bus.on('nedit', this.edit);
    this.$bus.on('nnew', this.new);
  },
  methods: {
    renderTxt(event, txt) {
      this.toMarkdown(txt)
    },
    toMarkdown(txt) {
      var mdi = require('markdown-it')()
      this.renderedMarkdown = mdi.render(txt);
    },
    replaceMarkdownUrl(to) {
      const t = '**--==--**'
      const baseurl = this.$store.state.conf.conf.api
      this.t(baseurl)
      if (!this.lin.content) return
      if (to === 'a-url') {
        this.t('t to url')
        this.lin.content = this.lin.content.replace(t, baseurl)
      } else if (to === 'url-a') {
        this.t('url to t')
        this.lin.content = this.lin.content.replace(baseurl, t)
      }
    },
    submit() {
      this.$bus.off('editalldone')
      this.$bus.on('editalldone', this.editClose)
      this.replaceMarkdownUrl('url-a')
      if (this.title === 'edit') {
        this.doedit();
      } else if (this.title === 'new') {
        this.donew();
      }
    },
    doedit() {
      console.log('saving')
      req.post('nsave', this.lin).then((res) => {
        if (res.data === 'done') {
          this.$bus.emit('editdone', this.lin)
        }
      });
    },
    donew() {
      this.lin.pid = this.pid;
      req.post('nnew', this.lin).then((res) => {
        if (res.data !== 'mis') {
          this.lin.id = res.data
          this.$bus.emit('editdone', this.lin)
        }
      });
    },
    donewAddLin() {
      req.post('nel', { id: this.lin.id}).then((res) => {
        if (res.status) {
          this.t(res.data, 'adding lin return')
          this.$bus.emit('nnew' + this.pid, res.data);
        }
      });
    },
    edit(da) {
      if (this.isshow === true) this.isshow = false
      else {
        this.lin = da.lin;
        this.replaceMarkdownUrl('a-url')
        this.pid = da.lin.pid;
        this.toMarkdown(this.lin.content)
        this.show('edit');
      }
    },
    new(da) {
      this.pid = da.pid;
      this.lin = {};
      this.toMarkdown('')
      this.show('new');
      this.contentSwitch('edit')
    },
    show(title) {
      this.title = title;
      this.isshow = true;
    },
    editClose() {
      this.t('nedit close')
      if (this.title === 'new') {
        this.t('is new adding lin to parent')
        this.donewAddLin()
      }
      this.close()
    },
    close() {
      this.contentSwitch('show')
      this.isshow = false;
    },
    contentSwitch(type) {
      if (type === 'edit') {
        this.editcontent = ''
        this.showcontent = 'hide'
      } else if (type === 'show') {
        this.editcontent = 'hide'
        this.showcontent = ''
      } else {
        this.editcontent = this.editcontent === 'hide' ? '' : 'hide'
        this.showcontent = this.showcontent === 'hide' ? '' : 'hide'
      }
    },
    contentFull() {
      this.contentFullStyle = this.contentFullStyle === 'contentfull' ? '' : 'contentfull'
      this.contentFullPlace = this.contentFullPlace === 'hide' ? '' : 'hide'
      this.contentH100 = this.contentH100 === '' ? 'h100' : ''
    },
    contentInsert(type) {
      switch (type) {
      case 'link':
        this.insertTxt(this.$refs.contentEdit, '[ ]( )')
        break;
      case 'image':
        this.insertTxt(this.$refs.contentEdit, '![ ](  "")')
        break;
      default:
        break;
      }
    },
    insertTxt(obj, t) {
      this.t(obj)
      this.t(obj.selectionStart)
      if (document.selection) {
        this.t('give')
        var sel = document.selection.createRange();
        sel.text = t
      } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        this.t('insert')
        var startPos = obj.selectionStart
        var endPos = obj.selectionEnd
        var cursorPos = startPos
        var tmpStr = obj.value
        obj.value = tmpStr.substring(0, startPos) + t + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += t.length
        obj.selectionStart = obj.selectionEnd = cursorPos
      } else {
        this.t('add')
        obj.value += t
      }
    },
    t(a, txt = '') {
      console.log('Note Edit--------------------------------------------------------------------')
      if (txt !== '') console.log(txt)
      console.log(a)
    }
  }
};
</script>
<style scoped lang="stylus">
.edit
  position fixed
  top 50%
  left 50%
  transform translate(-50%,-50%)
  background-color black
  border solid 1px red
  width 80%
  text-align left
  padding 1rem
  z-index 20
.btns
  float right
.input
  width 100%
  border none
  border-bottom solid 1px red
  background-color black
  color aqua
  outline none
.content
  width 100%
  height 100%
  position absolute
  background black
.showpart
  position relative
  border-bottom solid 1px red
  overflow-y: scroll
.contentbox
  height 20rem
  position relative
.contentfull
  position fixed
  top 0px
  left 0px
  height 100%
  width 100%
  background black
  z-index 20
.h100
  height 100%
.content textarea
  height 100%
.cb
  clear both
.hide
  display none
.tc
  text-align center
.showpart
  color aqua
</style>
