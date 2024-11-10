<template>
  <div class="menubox">
    <div class="clipbtn" @click="togglekeyfile()">
      <i class="fa fa-key"/>
    </div>
    <div class="clipbtn" v-if="!isclear" @click="clearWindow(false)">
      <i class="fa fa-square-o"/>
      <i class="fa fa-caret-right"/>
    </div>
    <div class="clipbtn" v-if="isclear" @click="clearWindow(true)">
      <i class="fa fa-square-o"/>
      <i class="fa fa-caret-left"/>
    </div>
    <div class="clipbtn" @click="boot()" title="启动配置的所有boot/boot up all boots in conf">
      <i class="fa fa-angle-up"/>
      <i class="fa fa-chevron-up"/>
    </div>
    <div class="clipbtn" @click="shut()" title="关闭所有用户进程/kill all apps">
      <i class="fa fa-times"/>
      <i class="fa fa-times"/>
    </div>
    <div class="clipbtn" @click="toggleconf()">
      <i class="fa fa-cog"/>
    </div>
    <div class="clipbtn" @click="minbtn()">-</div>
    <div class="clipbtn" @click="maxbtn()">□</div>
    <div class="clipbtn" @click="closebtn()">x</div>
  </div>
</template>
<script>
export default {
  name: 'menubox',
  data: function() {
    return {
      isclear: false
    }
  },
  methods: {
    boot: function() {
      this.$ipc.send('bootenv')
    },
    closebtn: function() {
      this.$ipc.send('closeapp')
    },
    maxbtn: function() {
      this.$ipc.send('maxapp')
    },
    minbtn: function() {
      this.$ipc.send('minapp')
    },
    shut: function() {
      this.$ipc.send('shut')
    },
    toggleconf: function() {
      this.$bus.emit('toggleconf')
    },
    togglekeyfile: function() {
      this.$bus.emit('togglekeyfile')
    },
    clearWindow: function(is) {
      this.isclear = !is
      this.$bus.emit('setShowTool', is)
      this.$bus.emit('setShowStarter', is)
    }
  }
}
</script>
<style lang="stylus" scoped>
.menubox
  position fixed
  right 2rem
  top 2rem
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
