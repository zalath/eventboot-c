<template>
  <div>
    <div class="taskline" v-if='isshow' v-on='{ mouseenter: mouseInOut, mouseleave: mouseInOut }'>
      <btntik :lin="tlin"></btntik>
      <a :class="'tikname' + tlin.tik" @click='showlins()'>{{ tlin.title }}
        <!-- <a v-if='tlin.ct > 0'>{{ tlin.ct }}</a> -->
        <i v-if="tlin.file != ''" class="fa fa-image image"></i>
      </a>
      <template v-if="lin.tikc.length > 0">
        <a v-for="(t) in tlin.tikc" :key="t.tik">
          <a :class="'fa tikname'+t.tik" @click="showtik(t.tik)">{{t.c}}</a>
        </a>
      </template>
      <template v-if='isbtn'>
        <btnnew :lin="tlin"></btnnew>
        <btnedit :lin="tlin"></btnedit>
        <btnrefresh :lin="tlin"></btnrefresh>
        <btndel :lin="tlin"></btndel>
      </template>
      <pre class='cmt' v-if='tlin.cmt != ""'>{{ tlin.cmt }}</pre>
    </div>
    <div v-if='showchild'>
      <Taskline v-for='li in tlin.Child' :lin='li' :key='li.id' />
    </div>
  </div>
</template>
<script>
import req from '../../js/req';
import btntik from './Taskline_btn_tik';
import btnnew from './Taskline_btn_new';
import btnedit from './Taskline_btn_edit';
import btndel from './Taskline_btn_del';
import btnrefresh from './Taskline_btn_refresh';
export default {
  name: 'Taskline',
  components: {
    btntik,
    btnnew,
    btnedit,
    btndel,
    btnrefresh
  },
  props: {
    lin: {}
  },
  data: function () {
    return {
      showchild: false,
      isbtn: false,
      isshow: true,
      tlin: this.lin,
      ishlight: 0,
      gconf: this.$store.state.conf,
      box: 0
    }
  },
  created() {
    if (this.tlin.pid === -1) {
      this.showchild = true
    }
    this.$bus.off('new' + this.tlin.id)
    this.$bus.off('edit' + this.tlin.id)
    this.$bus.off('del' + this.tlin.id)
    this.$bus.off('refreshel' + this.tlin.id)
    this.$bus.off('boxed' + this.tlin.id)
    this.$bus.on('new' + this.tlin.id, this.donew)
    this.$bus.on('edit' + this.tlin.id, this.doedit)
    this.$bus.on('del' + this.tlin.id, this.dodel)
    this.$bus.on('refreshel' + this.tlin.id, this.refreshel)
    this.$bus.on('boxed' + this.tlin.id, this.setbox)
    this.$bus.on('withtik', this.withtik)
    this.$bus.on('withtik-' + this.tlin.pid, this.withtik)
  },
  methods: {
    setbox(isbox) {
      this.box = isbox
    },
    // type: show/light
    sendbox(type) {
      this.$bus.emit(type + 'box' + this.tlin.id)
    },
    showlins() {
      if (this.tlin.ct > 0) {
        if (this.tlin.Child == null) this.getlins()
        this.showchild = !this.showchild
      } else {
        this.$bus.emit('edit', { lin: this.tlin })
      }
    },
    refreshel(val) {
      if (val.type === 'el') {
        this.tlin = val.data
      } else if (val.type === 'child') {
        this.tlin.Child = val.data
      }
    },
    showtik(tik) {
      if (this.tlin.Child != null) {
        this.showchild = true
        this.$bus.emit('withtik-' + this.tlin.id, tik)
      } else {
        this.showlins();
      }
    },
    getlins() {
      var that = this
      req.post(this.gconf, 'list', { id: this.tlin.id }).then((res) => {
        res.type = 'child'
        that.$bus.emit('refreshel' + that.tlin.id, res)
      })
    },
    donew(da) {
      if (this.tlin.Child == null) this.tlin.Child = []
      this.tlin.Child.splice(0, 0, da)
      this.tlin.ct += 1
      var i = this.tlin.tikc.map((item) => item.tik).indexOf(1)
      if (i === -1) {
        this.tlin.tikc.push({ tik: 1, c: 1})
      } else {
        this.tlin.tikc[i].c += 1
      }
    },
    doedit(da) {
      this.tlin = da
    },
    dodel(val) {
      this.tlin.ct -= 1
      var i = this.tlin.Child.map((item) => item.id).indexOf(val.id)
      this.tlin.Child.splice(i, 1)
      i = this.tlin.tikc.map((item) => item.tik).indexOf(val.tik)
      this.tlin.tikc[i].c -= 1
    },
    mouseInOut() {
      this.isbtn = !this.isbtn
      this.sendbox('light')
    },
    withtik(tik) {
      console.log(tik)
      if (tik === -1) {
        this.isshow = true
      } else if (this.tlin.tik === tik) {
        this.isshow = true
      } else {
        this.isshow = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
div
  text-align left
  margin-left 10px
  margin-top 5px
a
  text-align left
  margin-left 10px
.cmt
  margin-left 30px
  color #999
  word-break break-all
  word-wrap break-word
  white-space pre-wrap
.isdel
  display inline-block
.fblack
  color black
  padding 3px
.image
  color white
  margin-left 10px
</style>
