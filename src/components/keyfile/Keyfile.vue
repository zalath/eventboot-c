<template>
  <div class='keyfilepage mainpage noselect'>
    <div class="btns">
      <div class="menubtn clipbtn" @click="close()">
        <i class="fa fa-times"></i>
      </div>
      <div class="menubtn clipbtn" @click="foldall()">
        <i class="fa fa-angle-left bold"></i>
        <i class="fa fa-angle-left bold"></i>
      </div>
      <div class="menubtn clipbtn" @click="showpass = true">
        <i class="fa fa-key bold"></i>
      </div>
      <div class="menubtn">
        <div v-if="!isSync" title="同步到后台sync to backend" class="clipbtn" @click="this.isSync=true">
          <i class="fa fa-upload bold"></i>
        </div>
        <div v-if="isSync" class="clipbtn colbtn" @click="this.isSync=false;">
          <i class="fa fa-times bold"></i>
        </div>
        <div v-if="isSync" class="clipbtn colbtn" @click="synckeyfile">
          <i class="fa fa-check bold"></i>
        </div>
      </div>
      <div class="menubtn">
        <div v-if="!isDownload" title="从后台下载download from backend" class="clipbtn" @click="this.isDownload=true">
          <i class="fa fa-download bold"></i>
        </div>
        <div v-if="isDownload" class="clipbtn colbtn" @click="this.isDownload=false">
          <i class="fa fa-times bold"></i>
        </div>
        <div v-if="isDownload" class="clipbtn colbtn" @click="downloadkeyfile">
          <i class="fa fa-check bold"></i>
        </div>
      </div>
    </div>
    <div class="box">
      <div class='keyfileline' v-for='(l, ind) in this.lines' :key='ind' @mouseenter="showFuncBtn(ind)"
        @mouseleave="hideFuncBtn(ind)" v-dragto="ind">
        <span :class="l.foldto !== undefined? folds[l.foldto] === false? 'foldclose':'foldopen':''">
          <span v-if="l.type == 'fold'">
            <a @click="copy(l.name)">
              --&emsp;&emsp;{{ l.name }}
            </a>
            &nbsp;
            <a class="funcbtn" @click="fold(ind)">
              <i class="fa fa-angle-down bold"></i>
            </a>
          </span>
          <span v-else>
            <span><a @click="copy(l.name)">{{ l.name }}</a>&emsp;--&emsp;
              <a v-if="l.type === 'url'" @click="openUrlOut(l.ct)">{{ l.ct }}</a>
              <a v-if="l.type === 'pwd'" @click="copypwd(l.ct)">{{ l.ct }}</a>
              <a v-if="l.type === 'txt'" @click="copy(l.ct)">{{ l.ct }}</a>
            </span>
          </span>
          &nbsp;
          <btns v-show="l.isfuncbtn" :l="l" :i="ind" />
          &nbsp;
          <a v-show="l.isfuncbtn" class="funcbtn" v-drag="ind">
            <i class="fa fa-reorder"></i>
          </a>
          <a v-show="l.ismoveto" class="funcbtn">
            <i class="fa fa-arrow-left"></i>
          </a>
        </span>
      </div>
      <a @click="showadd = true">
        <i class="fa fa-plus"></i>
      </a>
      <div v-if="showadd" class="add keyfilepage addpage">
        <a class="clipbtn menubtn" @click="this.showadd = false, this.showedit = false">
          <i class="fa fa-times" />
        </a>
        <div>
          <p />
          name: <input class="input" v-model="newnode.name" />
          <p />
          content: <input class="input" v-model="newnode.ct" />
          <p />
          type: <select class="input" v-model="newnode.type">
            <option value="txt">文本/txt</option>
            <option value="pwd">密码/pwd</option>
            <option value="url">链接/link</option>
            <option value="fold">折叠/fold</option>
          </select>
        </div>
        <p>&nbsp;</p>
        <div>
          <a class="clipbtn menubtn" @click="save()">Save</a>
        </div>
      </div>
      <div v-if="showpass" class="add keyfilepage addpage">
        <a class="clipbtn menubtn" @click="this.showpass = false;this.passtype = ''">
          <i class="fa fa-times" />
        </a>
        <div>
          <p />
          pass: <input class="input" v-model="keypass" />
        </div>
        <p>&nbsp;</p>
        <div>
          <a class="clipbtn menubtn" @click="setkeypass()">Set</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import btns from './btns.vue'
import encpt from '../../js/encpt'
import req from '../../js/req'
import move from '../../js/move'
export default {
  components: {
    btns
  },
  name: 'keyfile',
  data: () => {
    return {
      lines: {},
      showadd: false,
      showedit: false,
      newnode: {
        name: '',
        ct: '',
        type: 'url'
      },
      editnode: {},
      i: 0,
      moving: 0,
      movto: 0,
      passforread: '', // 即将解密的密码内容
      keypass: '', // 密码项的加密密码
      showpass: false, // 是否显示密码输入框
      passtype: '', // 后续密码操作的类型，s/r
      folds: [],
      isSync: false,
      isDownload: false
    }
  },
  created: function () {
    this.$ipc.on('keyfileloaded', this.initpage)
    this.$ipc.on('keyfilesaved', this.saved)
  },
  provide() {
    return {
      delLine: this.del,
      openAdd: this.openAdd,
      openEdit: this.openEdit
    }
  },
  directives: {
    drag(el, binding) {
      el.onmousedown = function (e) {
        var elv = el
        var ev = binding.instance;
        el = el.parentNode;
        move.draging(el, ev, e, binding)
        el = elv
      }
    },
    dragto(el, binding) {
      el.onmouseenter = function (e) {
        if (binding.instance.movis) {
          binding.instance.lines[binding.value].isfuncbtn = false
          binding.instance.lines[binding.value].ismoveto = true
          el.onmouseleave = function () {
            if (binding.instance.movis) {
              el.onmouseleave = el.onmouseup = null
              binding.instance.lines[binding.value].ismoveto = false
            }
          }
          el.onmouseup = function () {
            if (binding.instance.movis) {
              binding.instance.movto = binding.value
              binding.instance.lines[binding.value].ismoveto = false
              binding.instance.move()
            }
          }
        }
      }
    }
  },
  methods: {
    initpage(event, e) {
      this.lines = e
      this.makefoldorder()
    },
    // 组织各折叠项和后面跟随项的关系
    makefoldorder() {
      var f = 0
      this.folds = []
      for (var i = 0; i < this.lines.length; i++) {
        if (this.lines[i].type === 'fold') {
          f = i
          this.folds[i] = true
        } else {
          this.lines[i].foldto = f
        }
      }
    },
    openUrlOut(url) {
      this.$ipc.send('openurlout', url);
    },
    close() {
      this.$bus.emit('togglekeyfile');
    },
    copy(t) {
      if (t === 'error') {
        return
      }
      navigator.clipboard.writeText(t);
      this.$bus.emit('popupcopyed')
    },
    showFuncBtn(i) {
      this.lines[i].isfuncbtn = true
    },
    hideFuncBtn(i) {
      this.lines[i].isfuncbtn = false
      this.lines[i].todel = false
    },
    openAdd(ind) {
      this.i = ind
      this.showadd = true
      this.resetNewNode({ name: '', ct: '', type: '' })
    },
    openEdit(ind) {
      this.i = ind
      this.showadd = true
      this.showedit = true
      this.resetNewNode(this.lines[ind])
      this.editnode = JSON.parse(JSON.stringify(this.lines[ind]))
    },
    resetNewNode(line) {
      this.newnode = line
    },
    save() {
      if ((this.editnode.type === 'pwd' && this.newnode.type === 'pwd' && this.editnode.ct !== this.newnode.ct) ||
          (this.editnode.type !== 'pwd' && this.newnode.type === 'pwd') ||
          (this.newnode.type === 'pwd' && this.showedit === false)
      ) {
        var keypass = this.readkeypass('s')
        if (!keypass) return
        this.$ipc.send('encpass', {pass: keypass, val: this.newnode.ct})
        try {
          var res = encpt.encpass(keypass, this.newnode.ct, null)
        } catch (e) {
          this.$bus.emit('popuperror', e.message)
          this.showpass = true
          return
        }
        this.newnode.ct = res
      }
      this.saveline()
    },
    saveline() {
      var c = 0;
      if (this.showedit) c = 1
      this.lines.splice(this.i, c, JSON.parse(JSON.stringify(this.newnode)))
      this.saveKeyFile()
      this.i = 0
      this.showadd = false
      this.showEdit = false
    },
    del(i) {
      this.lines.splice(i, 1)
      this.saveKeyFile()
      this.i = 0
    },
    saveKeyFile() {
      var savedata = this.formdata()
      this.$ipc.send('setkeyfile', savedata)
      this.makefoldorder()
    },
    formdata() {
      var savedata = JSON.parse(JSON.stringify(this.lines))
      for (var i = 0; i < savedata.length; i++) {
        delete savedata[i].isfuncbtn
        delete savedata[i].todel
        delete savedata[i].foldto
        delete savedata[i].ismoveto
      }
      return savedata
    },
    saved() {
      this.$bus.emit('popupcheck')
    },
    move() {
      move.move(this.movi, this.movto, this.lines, this.movis)
      this.saveKeyFile()
    },
    copypwd(val) {
      this.passforread = val
      var pass = this.readkeypass('r')
      if (!pass) return
      try {
        var res = encpt.decpass(pass, val, null)
        this.copy(res)
      } catch (e) {
        this.$bus.emit('popuperror', e.message)
        this.showpass = true
      }
    },
    setkeypass() {
      this.$store.commit('setKeypass', this.keypass)
      this.showpass = false
      if (this.passtype === 'r') {
        this.copypwd(this.passforread)
      } else if (this.passtype === 's') {
        this.save()
      }
    },
    readkeypass(type) {
      this.passtype = type
      var pass = this.$store.state.keypass
      if (!pass) {
        // 读服务端
        // this.showpass = true
        this.readkeypassRemote()
        return
      }
      return pass
    },
    // 自动从后端服务器拿加密密码
    readkeypassRemote() {
      req.post(this.$store.state.conf, 'keygetbyname', {name: 'keypass'}).then((res) => {
        // if (!res.status) return
        if (res.data.val === '') {
          this.showpass = true
        } else {
          this.keypass = res.data.val
          this.setkeypass()
        }
      }).catch((e) => {
        this.showpass = true
      })
    },
    fold(i) {
      this.folds[i] = !this.folds[i]
    },
    foldall() {
      for (var i = 0; i < this.folds.length; i++) {
        this.folds[i] = false
      }
    },
    // 同步文件到后台
    synckeyfile() {
      this.isSync = false
      var data = JSON.stringify(this.formdata())
      req.post(this.$store.state.conf, 'setkeyfile', {content: data}).then((res) => {
        if (res.data) {
          this.$bus.emit('popupcheck')
        }
      }).catch((e) => {
        this.$bus.emit('popuperror')
      })
    },
    downloadkeyfile() {
      this.isDownload = false
      req.get(this.$store.state.conf, 'readkeyfile').then((res) => {
        this.lines = JSON.parse(res.data)
        this.saveKeyFile()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.keyfilepage
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  padding-left 1rem
  background-color black
  border solid 1px red
.addpage
  width 90%
.mainpage
  width 80%
  height 90%
.keyfileline
  width 100%
  overflow-wrap break-word
  line-height 2rem
.funcbtn
  float none !important
  line-height 1rem
.menubtn
  float right !important
.hidden
  display none
.input
  width 100%
  border none
  border-bottom solid 1px red
  background-color black
  color aqua
  outline none
.noselect
  user-select none
.foldopen
  display block
.foldclose
  display none
.bold
  font-weight bold
.box
  position relative
  height 100%
  overflow scroll
.btns
  z-index 2
  position absolute
  right 0
  padding 1rem
.colbtn
  float none !important
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
