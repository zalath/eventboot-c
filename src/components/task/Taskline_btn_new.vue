<template>
  <a class='fa fa-plus' @click='newl()'></a>
</template>
<script>
export default {
  name: 'Taskline_btn_new',
  props: {
    lin: {}
  },
  data: function () {
    return {
      tlin: this.lin
    }
  },
  methods: {
    newl() {
      this.$bus.emit('new', { pid: this.tlin.id })
    }
  }
}
</script>
