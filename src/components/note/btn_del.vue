<template>
  <i>
    <a class='fa fa-times' @click='isdel=!isdel'></a>
    <div class='isdel' v-if='isdel'>
      ?
      <a class='fa fa-check' @click='del()' />
    </div>
  </i>
</template>
<script>
import req from '../../js/req'
export default {
  name: 'btn_del',
  props: {
    lin: {}
  },
  data: function () {
    return {
      gconf: this.$store.state.conf,
      tlin: this.lin,
      isdel: false
    }
  },
  methods: {
    del() {
      req.post('ndel', { id: this.tlin.id }).then((res) => {
        if (res.data === 'done') {
          if (this.tlin.file !== '') req.post('fdel', {del: this.tlin.file})
          this.$bus.emit('ndel' + this.tlin.pid, { id: this.tlin.id, tik: this.tlin.tik})
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.isdel
  display inline-block
i
  text-align left
  margin-left 10px
</style>
