<template>
  <div id="app" class="app">
    <div class="tlist" v-if="showStarter">
      <stLine v-for="(line,ind) in stList" :line="line" :key="ind"></stLine>
      <div class="cp clipbtn" @click="setShowStarter(false)">
        <i class="fa fa-caret-right"/>
      </div>
    </div>
    <div class="tlist" v-else>
      <div class="cp clipbtn" @click="setShowStarter(true)">
        <i class="fa fa-caret-left"/>
      </div>
    </div>
  </div>
</template>

<script>
import stLine from './Starterline'
export default {
  name: 'App',
  components: {
    stLine
  },
  data: function() {
    return {
      stList: [],
      closetitle: 'starterclose',
      stlLeft: 0,
      showStarter: true
    }
  },
  created: function() {
    this.$bus.on('setShowStarter', this.setShowStarter)
    this.initstart()
  },
  methods: {
    initstart: function() {
      this.stList = this.$store.state.conf.starter
    },
    setShowStarter: function(is) {
      this.showStarter = is
    }
  }
}
</script>

<style scoped lang="stylus">
.tlist
  position fixed
  top 50%
  right 10px
  transform translate(0%,-50%)
  max-height 90%
  max-width 80%
  overflow-y auto
  padding 3px
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
