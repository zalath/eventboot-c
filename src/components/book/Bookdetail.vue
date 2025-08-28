<template>
  <div>
    <div v-for="(v,i) in this.booklist" :key="i">
      <partlist :book="v"></partlist>
      <div class="divider"></div>
    </div>
  </div>
</template>

<script>
import req from '../../js/req'
import partlist from './Partlist.vue'
export default {
  name: 'bookdetail',
  props: {
  },
  components: {
    partlist
  },
  data() {
    return {
      parts: [],
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
  }
}
</script>

<style scoped lang="stylus">
.divider
  height 1px
  margin .5rem 0
  clear both
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
