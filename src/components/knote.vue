<template>
  <div class='space' v-if="showknote">
    <div class="btns">
      <div class="btn clipbtn clipinput pad01">
        <textarea class="txt newtxt" v-model="newtxt" />
      </div>
      <div class="btn clipbtn" title="添加" @click="add()">
        <i class="fa fa-plus"></i>
      </div>
      <div class="btn clipbtn" title="上传" @click="setnotes()">
        <i class="fa fa-check"></i>
      </div>
      <div class="btn clipbtn" @click="this.showknote = false">
        <i class="fa fa-times"></i>
      </div>
    </div>
    <div class="noteLines">
      <div class="btn clipbtn clipinput w90 noteLine" v-for="(l, ind) in this.notes" :key="ind" @mouseenter="lines[ind] = {}, lines[ind].btn=true" @mouseleave="lines[ind].btn=false" v-dragto="ind">
        <!-- <i>{{ ind }}</i>&emsp; -->
        <!-- <textarea :rows=(l.txt.match(/\n/g)?(l.txt.match(/\n/g)).length+2:2) :title="l.txt" class="txt noteContent" v-model="l.txt" @change="setnotes()" /> -->
        <textarea :rows=(l.txt.match(/\n/g)?(l.txt.match(/\n/g)).length+2:2) class="txt noteContent" v-model="l.txt" @change="setnotes()" />
        <div class="linebtns">
          <div v-if="lines[ind] && lines[ind].btn && this.movis===false" class="btn clipbtn" @click="del(ind)">
            <i class="fa fa-times"></i>
          </div>
          <div v-if="lines[ind] && lines[ind].btn && this.movis===false" class="btn clipbtn" @click="copy(l.txt)">
            <i class="fa fa-copy"></i>
          </div>
          <div v-if="lines[ind] && lines[ind].btn && this.movis===false" class="btn clipbtn" v-drag="ind">
            <i class="fa fa-reorder"></i>
          </div>
          <div v-if="lines[ind] && lines[ind].btn && this.movis===true" class="btn clipbtn">
            <i class="fa fa-arrow-left"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 拖动排序 - 拆出单独的文件
 * add框，改为textarea
 */
import req from '../js/req'
import move from '../js/move'
// api接口ip设置面板
export default {
  name: 'setapi',
  components: {
  },
  data: () => {
    return {
      showknote: false,
      notes: [],
      newtxt: '',
      lines: [],
      movi: 0,
      movto: 0,
      movis: false
    }
  },
  created() {
    this.$ipc.on('taskreload', this.getnotes)
    this.$bus.on('showknote', this.toggleshowknote)
  },
  directives: {
    drag(el, binding) {
      el.onmousedown = function (e) {
        var elv = el
        var ev = binding.instance;
        el = el.parentNode.parentNode;
        move.draging(el, ev, e, binding, 70)
        el = elv
      }
    },
    dragto(el, binding) {
      el.onmouseenter = function (e) {
        if (binding.instance.movis) {
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
    move() {
      move.move(this.movi, this.movto, this.notes, this.movis)
      this.setnotes()
    },
    add() {
      this.notes.splice(0, 0, {txt: this.newtxt})
      this.setnotes()
    },
    del(i) {
      this.notes.splice(i, 1)
      this.setnotes()
    },
    copy(t) {
      navigator.clipboard.writeText(t);
      this.$bus.emit('popupcopyed')
    },
    toggleshowknote() {
      this.showknote = !this.showknote
    },
    getnotes() {
      req.get('readknote').then((res) => {
        this.notes = JSON.parse(res.data)
      })
    },
    setnotes() {
      req.post('setknote', {content: JSON.stringify(this.notes)}).then((res) => {
        this.$bus.emit('popupcheck')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.space
  position fixed
  top 7rem
  left 50%
  transform translate(-50%,0%)
  background-color black
  text-align center
  height 50%
  padding .5rem
  width 100%
  @media screen and (min-width: 768px)
    width 60%
.btns
  position fixed
  top -2rem
  left 50%
  transform translate(-50%,0)
.noteLines
  max-height 100%
  width 100%
  overflow-y scroll
  padding .5rem
.noteLine
  margin-top .7rem !important
  user-select none
  float none !important
.fa
  cursor pointer
.txt
  background-color black
  color white
  outline none
  border none
  font-size 1rem
  width 100%
.notecontent
  width 100%
.newtxt
  width 5rem
  height 1rem
.clipinput
  position relative
  &:hover
    background-color black !important
.w90
  width 90%
.linebtns
  z-index 20
  top -.1rem
  position absolute
  right -.4rem
  background-color black
.pad01
  padding .1rem !important
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
