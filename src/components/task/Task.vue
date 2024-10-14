<template>
  <div id="app">
    <div class="tlist">
      <Taskwin :title="'t2'"/>
      <Taskedit/>
    </div>
  </div>
</template>

<script>
import Taskwin from './Taskwin.vue'
import Taskedit from './Taskedit.vue'
export default {
  name: 'Task',
  components: {
    Taskwin,
    Taskedit
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
