<template>
  <div>
    <div class="loading loadanime1"></div>
    <div class="loading loadanime2" @click="reloadapi()"></div>
  </div>
</template>
<script>
export default {
  methods: {
    reloadapi() {
      this.$ipc.send('reloadapi')
    },
    handleKeydown(event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        this.reloadapi()
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>
<style lang="stylus" scoped>

.loading
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  margin auto
  height 100px
  width 100px
  box-shadow 20px 20px 30px rgba(255,255,255,0.5)
.loadanime1
  background-color rgba(255,255,255,0.2)
  animation loading 1200ms infinite
.loadanime2
  background-color rgba(200,255,200,0.2)
  animation loading2 1200ms infinite
@keyframes loading
  from
    clip-path polygon(18% 15%, 82% 0%, 100% 82%, 20% 100%)
  20%
    clip-path polygon(0% 20%, 100% 10%, 82% 100%, 10% 88%)
  40%
    clip-path polygon(0% 10%, 82% 0%, 100% 78%, 23% 100%)
  60%
    clip-path polygon(0% 20%, 100% 30%, 83% 83%, 0% 100%)
  80%
    clip-path polygon(0% 0%, 80% 20%, 100% 100%, 10% 77%)
  to
    clip-path polygon(18% 15%, 82% 0%, 100% 82%, 20% 100%)
@keyframes loading2
  from
    clip-path polygon(0% 10%, 82% 0%, 100% 78%, 23% 100%)
  20%
    clip-path polygon(0% 20%, 100% 30%, 83% 83%, 0% 100%)
  40%
    clip-path polygon(15% 0%, 85% 0%, 100% 85%, 20% 100%)
  60%
    clip-path polygon(0% 0%, 80% 20%, 100% 100%, 10% 77%)
  80%
    clip-path polygon(18% 15%, 82% 0%, 100% 82%, 20% 100%)
  to
    clip-path polygon(0% 10%, 82% 0%, 100% 78%, 23% 100%)
</style>
