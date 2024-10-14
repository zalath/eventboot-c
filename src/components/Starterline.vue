<template>
  <div class="cb" v-if="line == ''">&nbsp;</div>
  <div v-else class="linepoz" @mouseenter="ishlight=1" @mouseleave="ishlight=0">
    <div class="stline clipbtn" @click="click()" @contextmenu="contentMenu()">
      <div class="line">
        <div class="linename">{{line.name}}</div>
      </div>
      <div class="mark">
        <i v-if="line.type === 'app'" class="fa fa-rocket"/>
        <i v-else-if="line.type === 'project'" class="fa fa-code"/>
        <i v-else-if="line.type === 'file'" class="fa fa-file-o"/>
        <i v-else-if="line.type === 'folder'" class="fa fa-folder-o"/>
        <i v-else-if="line.type === 'link'" class="fa fa-link"/>
        <i v-else class="fa fa-chevron-down"/>
      </div>
    </div>
    <div v-if="line.type === 'project'" class="stline clipbtn" @click="bash(line.path)">
      <div class="line fa fa-terminal"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'stLine',
  components: {
  },
  props: {
    line: {}
  },
  data: function() {
    return {
      stlLeft: 0,
      ishlight: 0
    }
  },
  methods: {
    click: function() {
      switch (this.line.type) {
      case 'project' :
        this.openProject(this.line.path)
        break;
      case 'app' :
        this.$ipc.send('stt', this.line.path)
        break;
      case 'file' :
        this.openProject(this.line.path)
        break;
      case 'folder' :
        this.openFolder(this.line.path)
        break;
      case 'link' :
        this.$ipc.send('tobrowser', this.line.path)
        break;
      }
    },
    contentMenu: function() {
      switch (this.line.type) {
      case 'project' :
        this.openFolder(this.line.path)
        break;
      }
    },
    openProject: function(path) {
      this.$ipc.send('openProject', path)
    },
    openFolder: function(path) {
      this.$ipc.send('openFolder', path)
    },
    bash: function(path) {
      this.$ipc.send('openbash', path)
    }
  },
  created() {
  }
}
</script>
<style lang="stylus" scoped>
.linepoz
  font-size 1.1rem
  float right
  margin 0 .5rem
.cb
  clear both
  height .7rem
.mark
  position absolute
  left .3rem
  top -.8rem
  background black
  font-size .8rem
  padding 0 .3rem
</style>
<style lang="stylus" src='../css/cyber.styl' scoped>
</style>
