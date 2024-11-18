<template>
  <div class='ipbar' >
    <div class='clipbtn' @click='copy()' @contextmenu="setapi()">
    {{ipval}}
    </div>
    <div class="btn clipbtn" @click="toggleknote()">
      <i class="fa fa-book"></i>
    </div>
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
      navigator.clipboard.writeText(this.ipval);
    },
    setapi() {
      this.$bus.emit('showsetapi')
    },
    resetipval() {
      this.ipval = this.$store.state.conf.conf.api
    },
    toggleknote() {
      this.$bus.emit('showknote')
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
