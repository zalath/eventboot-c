<template>
  <a class='fa fa-refresh' @click='refresh()'></a>
</template>
<script>
import req from '../../js/req'
export default {
  name: 'btn_refresh',
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
    refresh() {
      this.tlin.Child = null
      var that = this
      req.post('nel', { id: this.tlin.id }).then((res) => {
        res.type = 'el'
        that.$bus.emit('nrefreshel' + that.tlin.id, res)
        that.$parent.getlins()
      })
    }
  }
}
</script>
