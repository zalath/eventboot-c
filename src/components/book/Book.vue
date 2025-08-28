<template>
  <div class="bookbox">
    <bookdetail class="booklist" v-show="isshowbook"></bookdetail>
    <a  class="clipbtn" @click="isshowbook=!isshowbook">
      <i class="fa fa-book"></i>
    </a>
  </div>
</template>

<script>
import bookdetail from './Bookdetail.vue'
export default {
  name: 'Book',
  components: {
    bookdetail
  },
  data: function() {
    return {
      isshowbook: true
    }
  },
  created() {
  },
  methods: {
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
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
