<template>
  <div class="bookbox">
    <div v-for="(v,i) in this.booklist" :key="i">
      <partlist :book="v"></partlist>
      <div class="divider"></div>
    </div>
    <a  class="clipbtn" @click="isshowbook=!isshowbook">
      <i class="fa fa-book"></i>
    </a>
  </div>
</template>

<script>
import req from '../../js/req'
import partlist from './Partlist.vue'
export default {
  name: 'Book',
  components: {
    partlist
  },
  data: function() {
    return {
      isshowbook: true,
      booklist: []

    }
  },
  created() {
    this.getbook()
  },
  methods: {
    getbook() {
      console.log('in getbook')
      req.get(this.$store.state.conf, 'booklist', '').then((res) => {
        this.booklist = res.data
      })
    }
  },
  mounted() {
    this.isshowbook = true
  }
}
</script>

<style scoped lang="stylus">
.bookbox
  position fixed
  bottom 1rem
  left 1rem
.divider
  height 1px
  margin 3rem 0
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
