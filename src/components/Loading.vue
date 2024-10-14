<template>
  <div>
    <div class="loading"></div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
.loading
  margin auto
  height 100px
  width 100px
  background-color white
  animation loading 200ms infinite
@keyframes loading
  from
    clip-path polygon(10% 20%, 20% 10%, 100% 10%, 90% 70%, 80% 90%,0 90%)
  to
    clip-path polygon(10% 20%, 20% 10%, 100% 10%, 90% 70%, 80% 90%,0 90%)
</style>
