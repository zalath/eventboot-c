<template>
  <div class='space' v-if="showknote">
    <div class="btns">
      <div class="btn clipbtn clipinput">
        <input class="txt newtxt" v-model="newtxt"/>
      </div>
      <div class="btn clipbtn" @click="add()">
        <i class="fa fa-plus"></i>
      </div>
      <div class="btn clipbtn" @click="setnotes()">
        <i class="fa fa-check"></i>
      </div>
      <div class="btn clipbtn" @click="this.showknote = false">
        <i class="fa fa-times"></i>
      </div>
    </div>
    <div class="noteLines">
      <div class="btn clipbtn clipinput w90 noteLine" v-for="(l, ind) in this.notes" :key="ind" @mouseenter="lines[ind] = {}, lines[ind].btn=true" @mouseleave="lines[ind].btn=false">
        <!-- <i>{{ ind }}</i>&emsp; -->
        <!-- <textarea :rows=(l.txt.match(/\n/g)?(l.txt.match(/\n/g)).length+2:2) :title="l.txt" class="txt noteContent" v-model="l.txt" @change="setnotes()" /> -->
        <textarea :rows=(l.txt.match(/\n/g)?(l.txt.match(/\n/g)).length+2:2) class="txt noteContent" v-model="l.txt" @change="setnotes()" />
        <div class="linebtns">
          <div v-if="lines[ind] && lines[ind].btn" class="btn clipbtn" @click="del(ind)">
            <i class="fa fa-times"></i>
          </div>
          <div v-if="lines[ind] && lines[ind].btn" class="btn clipbtn" @click="copy(l.txt)">
            <i class="fa fa-copy"></i>
          </div>
          <div v-if="lines[ind] && lines[ind].btn" class="btn clipbtn" @click="move(ind)">
            <i class="fa fa-reorder"></i>
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
// api接口ip设置面板
export default {
  name: 'setapi',
  components: {
  },
  data: () => {
    return {
      showknote: true,
      notes: [],
      newtxt: '',
      lines: []
    }
  },
  created() {
    this.getnotes()
    this.$bus.on('showknote', this.toggleshowknote)
  },
  methods: {
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
      req.get(this.$store.state.conf, 'readknote').then((res) => {
        this.notes = JSON.parse(res.data)
      })
    },
    setnotes() {
      req.post(this.$store.state.conf, 'setknote', {content: JSON.stringify(this.notes)}).then((res) => {
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
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
