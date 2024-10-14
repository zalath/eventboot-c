<template>
  <div class='space'>
    <div class="btns">
      <a class='tik tikall' @click='withtik(-1)' />
      <a class='tik tik0' @click='withtik(0)' />
      <a class='tik tik1' @click='withtik(1)' />
      <a class='tik tik2' @click='withtik(2)' />
      <a class='fa fa-search' @click='opensearch()' />
    </div>
    <searchpad></searchpad>
    <taskline v-if="dataready" :lin='lin' :key='lin.id'/>
  </div>
</template>
<script>
import taskline from './Taskline';
import req from '../../js/req';
import searchpad from './Task_search_pad';
export default {
  name: 'Taskwin',
  props: {
    title: String
  },
  components: {
    taskline,
    searchpad
  },
  data: function() {
    return {
      lin: {},
      dataready: false
    }
  },
  created: function() {
    // this.getlins();
    this.$bus.on('taskreload', this.getlins)
    this.$ipc.on('taskreload', this.getlins)
  },
  methods: {
    getlins() {
      var that = this
      req.post(this.$store.state.conf, 'el', { id: 0 }).then((res) => {
        that.lin = res.data;
        req.post(this.$store.state.conf, 'list', { id: 0 }).then((res) => {
          that.lin.Child = res.data
          that.dataready = true
          console.log('task reloaded')
        });
      }).catch(function(error) {
        console.log(error)
        if (that.lin === {}) that.$bus.emit('showsetapi', true)
      });
    },
    withtik(tik) {
      this.$bus.emit('withtik', tik)
    },
    opensearch() {
      this.$bus.emit('showsearch')
    }
  }
}
</script>
<style lang="stylus" scoped>
a
  margin-left 10px
a
  &:hover {
    width 20px
    height 20px
    font-size 25px
  }
.btns
  line-height 30px
</style>
<style lang="stylus">
.tik0
  background-color gray
.tikname0
  color gray
.tik1
  background-color #00d944
.tikname1
  color #00d944
.tik2
  background-color red
.tikname2
  color red
.tikall
  background-color white
.tiknameall
  color white
.tik
  width 10px
  height 10px
  display inline-block
  border-bottom-right-radius 50%
  border-top-right-radius 50%
  border-bottom-left-radius 50%
a
  cursor pointer
</style>
