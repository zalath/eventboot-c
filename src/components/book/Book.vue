<template>
  <div class="bookbox">
    <div v-if="isshowbook">
      <div class="gap">
        <div class="clipbtn" @click="showNewBook=true">
          <i class="fa fa-plus"></i>
        </div>
        <div v-if="showNewBook" class="clipbtn">
          <i class="fa fa-times" @click="showNewBook=false"></i>
          &nbsp;&nbsp;
          <input v-model="newName" placeholder="新书名"/>
          &nbsp;&nbsp;
          <i class="fa fa-check" @click="addBook()"></i>
        </div>
      </div>
      <div class="gap" v-for="(v,i) in this.booklist" :key="i">
        <partlist :book="v"></partlist>
      </div>
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
      showNewBook: false,
      isshowbook: true,
      booklist: [],
      newName: ''
    }
  },
  created() {
    this.$ipc.on('taskreload', this.getbook)
  },
  methods: {
    addBook() {
      req.post('booknewbook', {name: this.newName}).then((res) => {
        this.booklist.push({
          id: res.data,
          name: this.newName
        })
      })
    },
    getbook() {
      req.get('booklist', '').then((res) => {
        this.booklist = res.data
      })
        .catch((err) => {
          console.log(err)
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
.gap
  height 1px
  margin-bottom 3rem
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
