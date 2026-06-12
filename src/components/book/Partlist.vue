<template>
  <div class="bookbtn" @mouseenter="togglebtns(true)" @mouseleave="togglebtns(false)">
    <div class="clipbtn" @click="openBook()" style="text-align: center;">
      {{ book.name }}
    </div>
    <div class="clipbtn" v-show="isshowbtns" title="关系" @click="isshowrelations=islock?isshowrelations:!isshowrelations">
      <i class="fa fa-link"></i>
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
    <div v-show="isshow">
      <Part v-for="(partid, i) in partlist"
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
    </div>
    <Bookrelation v-if="isshowrelations" :book="book" @close="isshowrelations=false"></Bookrelation>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js'
import Bookrelation from './Relation.vue'
import Part from './Part.vue'
import req from '../../js/req.js'
import data from '../../js/data.js'

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
      zmax: 0
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
    showUnlockPad() {
      this.passSource = 'saw'
      this.isshowUnlockPad = true
    },
    unlock() {
      if (this.pass === this.passSource) {
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
      const res = await req.post('bookparts', { id: this.book.id })
      if (res !== 'mis' && res.data != null) {
        var pt = {}
        res.data.forEach(p => {
          pt[p.id] = p
        })
        pt[this.book.id] = this.book
        this.$store.commit('initParts', {id: this.book.id, partlist: pt})
      }
    },
    openOne(partid) {
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
    Bookrelation
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
