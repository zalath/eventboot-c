<template>
  <div>
    <div class="clipbtn" @click="isshowconflist = !isshowconflist">
      <i class="fa fa-refresh"></i>
    </div>
<!-- TODO: put this window in the center of the screen-->
    <div class="conflist" v-if="isshowconflist">
      <div class="clipbtn" v-for="item in conflist" :key="item.id" @click="loadConfig(item)">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confRefresh',
  data() {
    return {
      conflist: [],
      isshowconflist: false
    }
  },
  created: function () {
    this.$ipc.on('conflist', this.setconflist)
    this.$ipc.send('getconflist')
  },
  methods: {
    setconflist(event, data) {
      this.conflist = data
    },
    loadConfig(item) {
      this.$ipc.send('setconfname', item)
      this.isshowconflist = false
    }
  }
}
</script>

<style scoped lang="stylus">
.conflist
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  border solid 1px red
  padding 10px 20px
  .list-item
    margin-bottom 10px

</style>
<style lang="stylus" src="../css/cyber.styl"></style>
