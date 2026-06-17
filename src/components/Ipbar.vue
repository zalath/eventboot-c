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
import { mapState } from 'vuex/dist/vuex.cjs.js';
export default {
  name: 'ipbar',
  methods: {
    copy() {
      navigator.clipboard.writeText(this.ipval);
    },
    setapi() {
      this.$bus.emit('showsetapi')
    },
    toggleknote() {
      this.$bus.emit('showknote')
    }
  },
  computed: mapState({
    ipval: state => state.api
  })
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
