<template>
  <div class="bookbtn" @mouseenter="isshowbtns=true" @mouseleave="isshowbtns=false">
    <div class="clipbtn" @click="openBook()" style="text-align: center;">
      {{ book.name }}
    </div>
    <div class="clipbtn" v-show="isshowbtns" title="关系" @click="isshowrelations=!isshowrelations">
      <i class="fa fa-link"></i>
      <!-- edit relationType -->
    </div>
    <div v-show="isshow">
      <Part :partid="book.id" :bookid="book.id"></Part>
      <Part v-for="(partid,i) in partlist" :key="i" :partid="partid" :bookid="bookid" @openOne="openOne" ></Part>
    </div>
    <Bookrelation v-show="isshowrelations" :book="book"></Bookrelation>
    <Partedit :book="book"></Partedit>
    <Relationedit :book="book"></Relationedit>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js'
import Bookrelation from './Bookrelation.vue'
import Part from './Part.vue'
import Partedit from './Partedit.vue'
import Relationedit from './Relationedit.vue'

export default {
  name: 'Partlist',
  props: {
    book: {}
  },
  data() {
    return {
      partlist: [],
      istoggle: false,
      isshow: true,
      isshowbtns: false,
      isshowrelations: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openBook() {
      if (!this.istoggle) {
        this.istoggle = true;
        // 获取该书的关系列表
        this.$store.commit('initrelationlist', {id: this.book.id})
        this.$store.commit('initParts', {book: this.book})
        this.isshow = !this.isshow;
      } else {
        this.isshow = !this.isshow;
      }
    },
    openOne(res) {
      this.partlist.push(res);
    }
  },
  components: {
    Part,
    Bookrelation,
    Partedit,
    Relationedit
  },
  computed: mapState({
    parts: state => state.parts[this.book.id] || [],
    relationlist: state => state.relationlist[this.book.id] || []
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
