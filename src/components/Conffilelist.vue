<template>
  <div>
<!-- TODO: put this window in the center of the screen-->
      <div class="conflist" style="margin:auto" v-if="$store.state.isshowconffilelist">
        <div class="confbtns">
          <div class="clipbtn" v-for="item in conflist" :key="item.id" @click="loadConfig(item)">
            {{ item }}
          </div>
          <div class="clipbtn" @click="$store.commit('toggleConfFileList', false)">
            <i class="fa fa-times"></i>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Conffilelist',
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
      this.$store.commit('toggleConfFileList', false)
      this.$store.commit('setConfFileName', item)
    }
  }
}
</script>

<style scoped lang="stylus">
.conflist
  position fixed
  top 50%
  left 50%
  width 40%
  transform translate(-50%, -50%)
  background-color black
  .list-item
    margin-bottom 10px
.confbtns
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
</style>
<style lang="stylus" src="../css/cyber.styl"></style>
