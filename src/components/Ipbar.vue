<template>
  <div class='ipbar' >
    <div class='clipbtn' @click='copy()' @contextmenu="setapi()">
    {{ipval}}
    </div>
    <input ref="inputCopy" value="for copy" style="opacity:0;position:absolute" />
  </div>
</template>

<script>
export default {
  name: 'ipbar',
  data: function() {
    return {
      ipval: ''
    }
  },
  created: function() {
    this.resetipval()
    this.$ipc.on('taskreload', this.resetipval)
  },
  methods: {
    copy() {
      const input = this.$refs.inputCopy
      input.value = this.ipval
      input.select()
      document.execCommand('copy')
    },
    setapi() {
      this.$bus.emit('showsetapi')
    },
    resetipval() {
      this.ipval = this.$store.state.conf.conf.api
    }
  }
}
</script>
<style lang="stylus" scoped>
.ipbar
  position fixed
  top 2rem
  left 50%
  transform translate(-50%, 0%)
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
