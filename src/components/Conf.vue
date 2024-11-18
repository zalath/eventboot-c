<template>
  <div id="app" class="noselect">
    <div class="tlist">
      <svg class="svg-defs">
        <defs>
          <clipPath id="s-clip" clipPathUnits="objectBoundingBox" transform="scale(0.0027472 0.0064102)">
            <path fill-rule="evenodd" fill="rgb(0, 0, 0)" d="M347.014,0.001 L363.999,16.987 L363.999,155.999 L-0.000,155.999 L-0.000,-0.001 L347.014,-0.001 L347.014,0.001 Z"/>
          </clipPath>
        </defs>
      </svg>
      <h2>starter</h2>
      <div v-for='(s,ind) in config.starter' :key='ind'>
        <div v-if='s != ""' class="line">
          <div class="line startline dragbar" v-light="ind">
            <div class="lincontent">
              <div class="mid">
                <div><input class="name" @change='changeval($event,"starter",ind,"name")' :value='s.name'/></div>
                <div><input class="path" @change='changeval($event,"starter",ind,"path")' :value='s.path'/></div>
              </div>
              <div v-if="s != ''" class="l">
                <div class="type" @click="choosetype[ind] = !choosetype[ind]">
                  <div v-if="s.type === 'app'" class="fa fa-rocket"></div>
                  <div v-else-if="s.type === 'project'" class="fa fa-code"></div>
                  <div v-else-if="s.type === 'file'" class="fa fa-file-o"></div>
                  <div v-else-if="s.type === 'folder'" class="fa fa-folder-o"></div>
                  <div v-else-if="s.type === 'link'" class="fa fa-link"></div>
                  <div v-else class="fa fa-chevron-down"></div>
                </div>
                <div class="choosetype" v-if="choosetype[ind]">
                  <div class="fa fa-rocket" @click="changeval('app','starter',ind,'type')"></div>
                  <div class="fa fa-code" @click="changeval('project','starter',ind,'type')"></div>
                  <div class="fa fa-file-o" @click="changeval('file','starter',ind,'type')"></div>
                  <div class="fa fa-folder-o" @click="changeval('folder','starter',ind,'type')"></div>
                  <div class="fa fa-link" @click="changeval('link','starter',ind,'type')"></div>
                </div>
              </div>
              <div class="r">
                <div class="fa fa-times cp close" @click="del('starter',ind)"></div>
                <br/>
                <div class="fa fa-reorder cp move" v-drag="ind"></div>
              </div>
            </div>
          </div>
          <div class="num" v-if="s != ''">
            {{ind}}
          </div>
        </div>
        <div v-else class="line empty dragbar" v-light="ind">
          <div class="r">
            <div class="fa fa-chevron-left cp" @click="addLine(ind,0)"></div>
            <div class="fa fa-chevron-right cp" @click="addLine(ind,1)"></div>
            <div class="fa fa-times cp" @click="del('starter',ind)"></div>
            <div class="fa fa-reorder cp" v-drage="ind"></div>
          </div>
        </div>
        <div class="cb" v-if="s == ''">
          <br />
        </div>
      </div>
      <br/>
      <div class="cb"></div>
      <div>
        <div class="fa fa-plus cp" @click="add('starter')"></div>
      </div>
      <h2>boot</h2>
      <div v-for='(s,ind) in config.boot' :key='ind'>
        <span>{{ind}}:</span>&emsp;
        <input @change='changeval($event,"boot",ind,"")' :value='s'/>
        <div class="fa fa-times cp" @click="del('boot',ind)"></div>
      </div>
      <br/>
      <div>
        <div class="fa fa-plus cp" @click="add('boot')"></div>
      </div>
      <h2>conf</h2>
      <div>
        <span>api:</span>&emsp;
        <input v-if='config.conf' @change='changeval($event,"conf","api","")' :value='config.conf.api'/>
      </div>
      <br/>
      <div class="fa fa-times cp save" @click="this.$bus.emit('toggleconf')"></div>
      <div class="fa fa-pencil cp save confirm" @click="setconf()"></div>
    </div>
  </div>
</template>

<script>
import move from '../js/move'
export default {
  name: 'Conf',
  components: {
  },
  data: function() {
    return {
      config: {},
      closetitle: 'confclose',
      moving: 0,
      movto: 0,
      choosetype: []
    }
  },
  created: function() {
    if (this.$store.state.confReady === 1) {
      this.initstarter(this.$store.state.conf)
    }
    this.$ipc.on('confsaved', (event, e) => {
      this.$bus.emit('popupcheck')
    })
  },
  computed: {
    confReady: function() {
      return this.$store.state.confReady
    }
  },
  watch: {
    confReady: function(newval, oldval) {
      if (newval === 1) {
        this.initstarter(this.$store.state.conf)
      }
    }
  },
  directives: {
    drag(el, binding) {
      el.onmousedown = function(e) {
        var elv = el
        var ev = binding.instance;
        el = el.parentNode.parentNode.parentNode.parentNode;
        move.draging(el, ev, e, binding)
        el = elv
      }
    },
    drage(el, binding) {
      el.onmousedown = function(e) {
        var elv = el
        var ev = binding.instance;
        el = el.parentNode.parentNode;
        move.draging(el, ev, e, binding)
        el = elv
      }
    },
    light(el, binding) {
      el.onmouseenter = function(e) {
        if (binding.instance.movis) {
          el.style.borderRight = 'solid 4px red'
          el.onmouseleave = function() {
            if (binding.instance.movis) {
              el.style.borderRight = ''
              el.onmouseleave = el.onmouseup = null
            }
          }
          el.onmouseup = function() {
            if (binding.instance.movis) {
              binding.instance.movto = binding.value
              binding.instance.move()
              el.style.borderRight = ''
            }
          }
        }
      }
    }
  },
  methods: {
    initstarter(e) {
      if (e !== null) {
        this.config = e
      }
    },
    addLine(id, pos) {
      console.log(id, pos)
      console.log(id + pos)
      this.config.starter.splice(id + pos, 0, {name: '', path: ''})
    },
    add(type) {
      switch (type) {
      case 'starter':
        this.config.starter.push('')
        break
      case 'menu':
        this.config.boot.push({name: '', url: ''})
        break
      case 'boot':
        this.config.boot.push('')
        break
      }
    },
    setconf() {
      var c = JSON.parse(JSON.stringify(this.config))
      this.$ipc.send('setconfig', c)
    },
    changeval(e, part, ind, col = '') {
      if (typeof e !== 'string') {
        e = e.target.value
      }
      if (col === '') {
        this.config[part][ind] = e
      } else {
        this.config[part][ind][col] = e
      }
      this.choosetype[ind] = false
    },
    del(type, i) {
      switch (type) {
      case 'starter':
        this.config.starter.splice(i, 1)
        break
      case 'menu':
        this.config.menu.splice(i, 1)
        break
      case 'boot':
        this.config.boot.splice(i, 1)
        break
      }
    },
    emptyline(i) {
      this.config.starter.splice(i, 0, '')
    },
    move() {
      move.move(this.movi, this.movto, this.config.starter, this.movis)
    }
  }
}
</script>

<style scoped lang="stylus">
.tlist
  overflow auto
  height 100%
  width 100%
  overflow auto
  position relative
.cp
  cursor pointer
.save
  position fixed
  right 1rem
  bottom 1rem
  font-size 2rem
.confirm
  right 4rem
.movbar
  position absolute
.noselect
  user-select none
  position: fixed;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  height: 67%;
  width: 100%;
  background: black;
  border-top: solid 1px red;
  border-bottom: solid 1px red;
input
  background-color black
  border none
  color red
  outline none
  font-size 1rem
  &:focus
    border-bottom solid 1px red
.line
  height 4rem
  position relative
  margin .5rem
  width 17rem
  float left
  background black
.linbox
  position relative
  float left
.num
  position absolute
  top 0rem
  left 1.3rem
  font-size .8rem
  background black
  padding 0 .4rem
  color red
  font-weight bold
.startline
  padding 1px
  clip-path url(#s-clip)
  background red
  .lincontent
    clip-path url(#s-clip)
    background black
    width 100%
    height 100%
  &:hover
    .r
      display block
  .l
    position absolute
    left 0
    width 3rem
    font-size 2rem
    font-size 1.5rem
    line-height 4rem
    margin-left .3rem
    .choosetype
      position absolute
      bottom -1px
      left 2rem
      width 10rem
      border solid 1px red
      background black
      div
        height 4rem
        line-height 4rem
        width 2rem
        text-align center
        &:hover
          background red
          color white
  .mid
    padding-left 3rem
    position absolute
    .name
      font-size 1.5rem
      width 12rem
    .path
      font-size .8rem
      width 12rem
  .r
    display none
    position absolute
    right .2rem
    height 2.9rem
    bottom 0rem
.cb
  clear both
.empty
  line-height 4rem
  width 7.1rem
  .r
    div
      padding 0.5rem .5rem
      &:hover
        background red
        color white
        clip-path polygon(0% 0%,80% 0%,100% 20%,100% 100%,20% 100%,0% 80%)
.svg-defs
  position absolute
  width 0
  height 0
</style>
