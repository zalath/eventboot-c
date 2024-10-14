<template>
  <a class='fa fa-pencil' @click='edit()'></a>
</template>
<script>
export default {
  name: 'Taskline_btn_edit',
  props: {
    lin: {}
  },
  data: function () {
    return {
      tlin: this.lin
    }
  },
  methods: {
    edit() {
      this.$bus.emit('edit', { lin: this.tlin })
    }
  }
}
</script>
