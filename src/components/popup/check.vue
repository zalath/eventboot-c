<template>
  <div class="popupcheck" v-if="ispopupcheck">
    <a v-if="iscopy" class='checktxt fa fa-copy'/>
    <a class='checktxt fa fa-check'/>
  </div>
</template>
<script>
export default {
  name: '',
  data: function() {
    return {
      ispopupcheck: false,
      iscopy: false
    }
  },
  created() {
    this.$bus.on('popupcheck', this.show)
    this.$bus.on('popupcopyed', this.showcopy)
  },
  methods: {
    show() {
      this.ispopupcheck = true
      this.hide()
    },
    showcopy() {
      this.iscopy = true
      this.ispopupcheck = true
      this.hide()
    },
    hide() {
      setTimeout(() => {
        this.ispopupcheck = false
        this.iscopy = false
      }, 200);
    }
  }
}
</script>
<style lang="stylus" scoped>
.popupcheck
  background-color black
  position fixed
  left 50%
  top 50%
  transform translate(-50%,-50%)
  padding 40px
  border solid 1px red
.checktxt
  font-size 50px
</style>
