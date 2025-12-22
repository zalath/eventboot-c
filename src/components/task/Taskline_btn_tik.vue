<template>
  <div class="tikbox" @click='tik()'>
    <div :class="'tik tikborder tik'+tlin.tik"></div>
    <div :class="'tik tikborder tikshadow tik'+tlin.tik"></div>
  </div>
</template>
<script>
import req from '../../js/req'
export default {
  name: 'Taskline_btn_tik',
  props: {
    lin: {}
  },
  data: function () {
    return {
      gconf: this.$store.state.conf,
      tlin: this.lin
    }
  },
  created() {

  },
  methods: {
    tik() {
      if (this.tlin.tik === 2) {
        this.tlin.tik = 0
      } else {
        this.tlin.tik += 1
      }
      req.post('tik', { id: this.tlin.id, tik: this.tlin.tik })
    }
  }
}
</script>
<style lang="stylus" scoped>
.tikbox
  position relative
  display inline-block
  cursor pointer
.tik
  border-radius 0
.tikshadow
  opacity 0.6
  position absolute
  left 3px
  top 10px
.tikborder
  clip-path polygon(10% 20%, 20% 10%, 100% 10%, 90% 70%, 80% 90%,0 90%)
</style>
