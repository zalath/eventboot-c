<template>
  <div class="home">
    <template v-if="isloading">
      <loading></loading>
    </template>
    <template v-else>
      <box></box>
    </template>
  </div>
</template>

<script>
import Box from '@/components/Box'
import Loading from '@/components/Loading'

export default {
  name: 'Home',
  components: {
    Box,
    Loading
  },
  data: function() {
    return {
      config: {},
      isloading: true
    }
  },
  created() {
    var that = this
    console.log('starting')
    // setTimeout(() => {
    this.$ipc.send('getconfig')
    this.$ipc.on('nload', function(event, e) {
      setTimeout(() => {
        that.$ipc.send('getconfig')
      }, 1000);
    })
    this.$ipc.on('loaded', function(event, e) {
      that.isloading = false
      that.$store.commit('setConf', e)
      that.$store.commit('setConfReady', 1)
    })
    this.$ipc.send('getkeyfile')
    // }, 2000)
  },
  methods: {
  }
}
</script>
<style lang="stylus" scoped>
.savebtn
  position absolute
  color red
  border solid 1px red
  left 0px
  cursor pointer
</style>
