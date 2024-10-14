<template>
  <div class="pg" :style="'height:' + height + 'rem'">
    <div class="bar" :style="'width:' + now + '%'"/>
  </div>
</template>

<script>
export default {
  name: 'progressbar',
  props: {
    now: Number,
    h: Number
  },
  data: () => {
    return {
      height: 0.3
    }
  },
  created() {
    if (this.h && this.h > 0) this.height = this.h
  }
}
</script>

<style lang="stylus" scoped>
.pg
  border solid 1px red
  width 100%
.bar
  background red
  height 100%
</style>
