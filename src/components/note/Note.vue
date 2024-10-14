<template>
  <div id="app">
    <div class="tlist">
      <win :title="'t2'"/>
      <edit/>
    </div>
  </div>
</template>

<script>
import win from './win.vue'
import edit from './edit.vue'
export default {
  name: 'Note',
  components: {
    win,
    edit
  },
  data: function() {
    return {
      closetitle: 'taskclose'
    }
  }
}
</script>

<style scoped lang="stylus">
.tlist
  margin-top 30px
</style>
