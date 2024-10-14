<template>
  <a class='fa fa-pencil' @click='edit()'></a>
</template>
<script>
export default {
  name: 'btn_edit',
  props: {
    lin: {}
  },
  data: function () {
    return {
      tlin: this.lin
    }
  },
  created() {
    this.$bus.on('editalldown', this.updatefile)
  },
  methods: {
    pudatefile(file) {
      if (file) this.tlin.file = file
    },
    edit() {
      this.$bus.emit('nedit', { lin: this.tlin })
    }
  }
}
</script>
