<template>
  <div class="popupcheck" v-if="ispopup">
    <div v-if="ispopupcheck">
      <a class='checktxt fa fa-check'/>
    </div>
    <div v-if="iscopy">
      <a class='checktxt fa fa-copy'/>
    </div>
    <div v-if="iserror">
      <a class="checktxt fa fa-times" />
      <p>{{ errormsg }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data: function() {
    return {
      ispopup: false,
      ispopupcheck: false,
      iscopy: false,
      iserror: false,
      errormsg: ''
    }
  },
  created() {
    this.$bus.on('popupcheck', this.show)
    this.$bus.on('popupcopyed', this.showcopy)
    this.$bus.on('popuperror', this.showerror)
  },
  methods: {
    show() {
      this.ispopup = true
      this.ispopupcheck = true
      this.hide()
    },
    showcopy() {
      this.ispopup = true
      this.iscopy = true
      this.hide()
    },
    showerror(msg) {
      console.log(msg)
      this.ispopup = true
      this.iserror = true
      this.errormsg = msg
      this.hide()
    },
    hide() {
      setTimeout(() => {
        this.ispopup = false
        this.ispopupcheck = false
        this.iscopy = false
        this.iserror = false
        this.errormsg = ''
      }, 300);
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
