<template>
  <div class="bookbtn" @mouseenter="togglebtns(true)" @mouseleave="togglebtns(false)">
    <div class="clipbtn" @click="openBook()" style="text-align: center;">
      {{ book.name }}
    </div>
    <div class="clipbtn" v-show="isshowbtns" title="关系" @click="isshowrelations=!isshowrelations">
      <i class="fa fa-link"></i>
      <!-- edit relationType -->
    </div>
    <div v-show="isshow">
      <Part v-for="(partid,i) in partlist" :key="i" :partid="partid" :bookid="book.id" @openOne="openOne(partid)" ></Part>
    </div>
    <Bookrelation v-if="isshowrelations" :book="book"></Bookrelation>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js'
import Bookrelation from './Bookrelation.vue'
import req from '../../js/req.js'
import Part from './Part.vue'
import data from '../../js/data.js'

export default {
  name: 'Partlist',
  props: {
    book: {}
  },
  data() {
    return {
      partlist: [],
      istoggle: false,
      isshow: false,
      isshowbtns: false,
      isshowrelations: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    togglebtns(isshow) {
      this.isshowbtns = isshow;
    },
    async openBook() {
      if (!this.istoggle) {
        this.istoggle = true;
        await this.loadrelation()
        await this.loadbook()
        this.partlist.push(this.book.id)
        this.isshow = !this.isshow;
      } else {
        this.isshow = !this.isshow;
      }
    },
    async loadrelation() {
      await data.initBookRelation(this.$store, this.book.id)
    },
    async loadbook() {
      const res = await req.post(this.$store.state.conf, 'bookparts', { id: this.book.id })
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
      this.partlist.push(partid);
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
