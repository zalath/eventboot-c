<template>
  <div class='space' v-if="showsearch">
    <div class="inputbar">
      <input class="fs30" type="text" v-model="searchval" />
      <a class='fs30 fa fa-search' @click='search()' />
    </div>
    <a class="fs25 fa fa-refresh" @click="reset()"></a>
    &emsp;
    <a class="fs30 fa fa-times" @click="toshowsearch()"></a>
    <noteline v-for="(lin) in lins" :lin='lin' :key='lin.id'/>
  </div>
</template>
<script>
import noteline from './line';
import req from '../../js/req';
// import { tSThisType } from '@babel/types';
export default {
  name: 'searchpad',
  props: {
    title: String
  },
  components: {
    noteline
  },
  data: function() {
    return {
      lins: {},
      searchval: '',
      showsearch: false
    }
  },
  created: function() {
    this.$bus.on('nshowsearch', this.toshowsearch)
  },
  methods: {
    toshowsearch() {
      this.showsearch = !this.showsearch
    },
    search() {
      this.lins = {}
      // var that = tSThisType
      var that = this
      if (this.searchval === '') {
        console.log('err')
        return
      }
      req.post(this.$store.state.conf, 'nfind', { key: this.searchval}).then((res) => {
        that.lins = res.data
      })
    },
    reset() {
      this.lins = []
      this.searchval = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.space
  position absolute
  width 90%
  background-color black
  z-index 10
  text-align center
  padding .5rem
  border solid 1px red
.inputbar
  width 100%
.inputbar input
  width 90%
  display inline-block
  border none
  border-bottom solid 1px red
  background-color black
  color aqua
  outline none
.fs30
  font-size 30px
.fs25
  font-size 25px
.fa-search
  display inline-block
</style>
