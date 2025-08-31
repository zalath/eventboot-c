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
      <Part v-for="(part,i) in partlist" :key="i" :part="part"></Part>
    </div>
    <Bookrelation v-show="isshowrelations" :book="book"></Bookrelation>
  </div>
</template>

<script>
import req from '../../js/req';
import Bookrelation from './Bookrelation.vue';
import Part from './Part.vue';

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
        this.openOne(this.book);
        // 获取该书的管理列表
        this.$store.commit('setBookRelationType', {id: this.book.id})
      } else {
        this.isshow = !this.isshow;
      }
    },
    openOne(part) {
      req.post(this.$store.state.conf, 'bookparts', {id: part.id}).then(res => {
        part.parts = res.data
        this.partlist.push(part)
        this.$store.commit('setParts', {id: this.book.id, parts: res.data})
        return res.data
      })
    }
  },
  components: {
    Part,
    Bookrelation

  }
}
</script>

<style lang="stylus" scoped>
.bookbtn
  float left
  width 50vw

</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
