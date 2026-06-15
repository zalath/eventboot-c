<template>
  <div class="bookbtn" @mouseenter="togglebtns(true)" @mouseleave="togglebtns(false)">
    <div class="clipbtn" @click="openBook()" style="text-align: center;">
      {{ book.name }}
    </div>
    <div class="clipbtn" v-show="isshowbtns" title="关系" @click="showRelations()">
      <i class="fa fa-link"></i>
    </div>
    <div class="clipbtn" v-show="isshowbtns" title="关系图" @click="showMap()">
      <i class="fa fa-gears"></i>
    </div>
    <div class="clipbtn" v-show="isshowbtns" @click="lock">
      <i v-if="islock" class="fa fa-lock"></i>
      <i v-else class="fa fa-unlock"></i>
    </div>
    <div class="clipbtn" v-show="isshowbtns" v-if="isshowUnlockPad">
      <!-- <span>{{ passSource }}</span> -->
      <input v-model="pass" type="password"/>
      <span @click="unlock">
        <i class="fa fa-check"></i>
      </span>
    </div>
    <Part v-show="isshow" v-for="(partid, i) in partlist"
      :key="partid"
      :partid="partid"
      :bookid="book.id"
      :ind = i
      :zindex=partlistzind[i]
      @openOne="openOne"
      @closeOne="closeOne"
      @setzindex="setzindex"
      @minimize="isshow=!isshow"
    ></Part>
    <Bookrelation :style="'z-index:'+relationzindex" v-show="isshowrelations" :book="book" @close="isshowrelations=false"></Bookrelation>
    <Partmap :style="'z-index:'+mapzindex" v-show="isshowmap" :isshow="isshowmap" :book="book" @openOne="openOne" @close="isshowmap=false"></Partmap>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js'
import Bookrelation from './Relation.vue'
import Part from './Part.vue'
import data from '../../js/data.js'
import Partmap from './Partmap.vue'

export default {
  name: 'Partlist',
  props: {
    book: {}
  },
  data() {
    return {
      passSource: '',
      pass: '',
      isshowUnlockPad: false,
      islock: false,

      partlist: [],
      partlistzind: [],
      istoggle: false,
      isshow: false,
      isshowbtns: false,
      isshowrelations: false,
      zmax: 0,

      mapzindex: 0,
      relationzindex: 0,
      isshowmap: false
    }
  },
  methods: {
    lock() {
      if (!this.islock) {
        this.islock = true
        this.isshowrelations = false
        this.isshow = false
        this.partlist = []
        this.partlistzind = []
        this.istoggle = false
      } else {
        this.showUnlockPad()
      }
    },
    showRelations() {
      this.isshowrelations = this.islock ? this.isshowrelations : !this.isshowrelations
      this.zmax++
      this.relationzindex = this.zmax
    },
    showMap() {
      this.isshowmap = this.islock ? this.isshowmap : !this.isshowmap
      this.zmax++
      this.mapzindex = this.zmax
    },
    showUnlockPad() {
      this.passSource = 'saw'
      this.isshowUnlockPad = true
    },
    unlock() {
      if (this.pass === this.passSource) {
        this.pass = ''
        this.islock = false
        this.isshowUnlockPad = false
      }
    },
    togglebtns(isshow) {
      this.isshowbtns = isshow;
      this.isshowUnlockPad = false
    },
    async openBook() {
      if (this.islock) {
        return
      }
      if (this.istoggle === false) {
        this.istoggle = true;
        try {
          await Promise.all([
            this.loadrelation(),
            this.loadbook()
          ])
        } catch (e) {
          console.log(e)
        }
        this.partlist.push(this.book.id)
        this.partlistzind.push(this.partlist.length)
        this.isshow = !this.isshow;
      } else {
        this.isshow = !this.isshow;
      }
    },
    async loadrelation() {
      await data.initBookRelationType(this.$store, this.book.id)
    },
    async loadbook() {
      await data.initBookParts(this.$store, this.book)
    },
    openOne(partid) {
      if (this.isshow === false) this.isshow = true
      const index = this.partlist.indexOf(partid);
      if (index === -1) {
        this.zmax++
        this.partlist.push(partid)
        this.parts[this.book.id][partid].isopen = true
        this.partlistzind.push(this.zmax)
      } else {
        this.setzindex(index)
      }
    },
    closeOne(ind) {
      if (ind > -1) {
        this.parts[this.book.id][this.partlist[ind]].isopen = false
        this.partlist.splice(ind, 1);
        this.partlistzind.splice(ind, 1);
      }
    },
    setzindex(ind) {
      this.zmax++
      this.partlistzind[ind] = this.zmax
    }
  },
  components: {
    Part,
    Bookrelation,
    Partmap
  },
  computed: mapState({
    parts: state => state.parts,
    relationlist: state => state.relationlis
  })
}
</script>

<style lang="stylus" scoped>
.bookbtn
  float left
  width 50vw

</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
