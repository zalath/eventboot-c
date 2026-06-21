<template>
  <div v-if="show" class="relationpad" @contextmenu="toggleShow()">
    <div class="relationedit">
      <div class="">
        <div v-if="part.type==1" class="flex">
          <div class="t clipbtn" disabled>{{ part.name }}</div>
          <div class="t clipbtn" @click="showrelation=true">{{ direction===1?relation.name:relation.revname }} - {{ direction===1?relation.revname:relation.name }}</div>
          <div class="t clipbtn" @click="showrole=true">{{ to.name }}</div>
        </div>
        <div v-else class="pad">
          <div v-for="r in options" :key="r.id" :class="tos.includes(r.id)?'choosed':''" class="paditem clipbtn" @click="choose(r.id)">{{ r.name }}</div>
          <div class="part-space"></div>
          <div class="part-space"></div>
        </div>
        <br/>
        <div v-if="part.type==1" class="flex">
          <div class="t"></div>
          <div class="t clipbtn" style="width:20% !important" @click="direction=Math.abs(direction-1)"><i class="fa fa-refresh"></i></div>
          <div class="t"></div>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="part-btns">
        <div class="clipbtn" @click="toggleShow()">
          <i class="fa fa-times"></i>
        </div>
        <div class="clipbtn" @click="saveEdit()">
          <i class="fa fa-check"></i>
        </div>
      </div>
    </div>
    <div v-if="showrelation" class="pad" @contextmenu="showrelation=false">
      <div class="paditem clipbtn" v-for="r in relationtypelist[bookid]" :key="r.id" @click="relation=r;showrelation=false">{{ r.name}}-{{ r.revname }}</div>
    </div>
    <div v-if="showrole" class="pad" @contextmenu="showrole=false">
      <div class="paditem clipbtn" v-for="r in options" :key="r.id" @click="to=r;showrole=false">{{ r.name }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req.js';
export default {
  name: 'Relationedit',
  data() {
    return {
      bookid: 0,
      partid: 0,
      part: {},
      show: false,
      direction: 1,
      relation: {
        id: 2,
        name: '选择关系',
        revname: ''
      },
      to: {
        id: 0,
        name: '名字'
      },
      tos: [],
      showrole: false,
      showrelation: false
    }
  },
  methods: {
    choose(id) {
      if (this.part.id === id) {
        return
      }
      if (this.tos.indexOf(id) >= 0) {
        this.tos.splice(this.tos.indexOf(id), 1)
      } else {
        this.tos.push(id)
      }
    },
    async saveEdit() {
      if (this.part.type === 1) {
        if (this.part.id === this.to.id) {
          this.$bus.emit('popuperror', '两个节点不能一样')
          return
        }
        if (this.part.type === 1 && this.relation.id === 2) {
          this.$bus.emit('popuperror', '请选择关系')
          return
        }
        if (this.to.id === 0) {
          this.$bus.emit('popuperror', '请选择目标')
          return
        }
        await this.doSave(this.part.id, this.to.id, this.relation.id, this.direction)
        this.show = false
        this.$bus.emit('popupcheck')
      } else {
        if (this.tos.length === 0) {
          this.$bus.emit('popuperror', '请选择目标')
          return
        }
        for (var i = 0; i < this.tos.length; i++) {
          await this.doSave(this.part.id, this.tos[i], this.relation.id, this.direction)
        }
        this.show = false
        this.$bus.emit('popupcheck')
      }
    },
    async doSave(partid, toid, relationid, direction) {
      // TODO: 查询两者是否已经存在关系，并返回关系名称
      var param = {
        p1: partid,
        p2: toid,
        relationid: relationid,
        direction: direction
      }
      req.post('bookmakerelation', param).then((res) => {
        if (res !== 'mis') {
          this.$store.commit('addRelation', {id: this.bookid, partid: partid, relation: param, type: this.part.type})
          this.$store.commit('addRelation', {id: this.bookid, partid: toid, relation: param, type: this.part.type})
        }
      })
      // // TODO: 查询两者是否已经存在关系，并返回关系名称
      // var param = {
      //   p1: this.part.id,
      //   p2: this.to.id,
      //   relationid: this.relation.id,
      //   direction: this.direction
      // }
      // req.post('bookmakerelation', param).then((res) => {
      //   if (res !== 'mis') {
      //     this.$store.commit('addRelation', {id: this.bookid, partid: this.part.id, relation: param, type: this.part.type})
      //     this.$store.commit('addRelation', {id: this.bookid, partid: this.to.id, relation: param, type: this.part.type})
      //     this.show = false
      //     this.$bus.emit('popupcheck')
      //   }
      // })
    },
    toggleShow(bookid, partid) {
      console.log('toggle show add relation')
      this.show = !this.show
      this.bookid = bookid
      this.partid = partid
      this.tos = []
      this.part = bookid ? this.parts[this.bookid][this.partid] : {}
    }
  },
  computed: {
    ...mapState({
      relationtypelist: state => state.relationtypelist,
      parts: state => state.parts
    }),
    options() {
      return Object.values(this.parts[this.bookid]).filter(p => p && p.type === 1);
    }
  }
}
</script>

<style lang="stylus" scoped>
.relationpad
  position fixed
  width 90%
  top 50%
  left 50%
  transform translate(-50%, -50%)
.relationedit
  padding 100px 20px
  border solid 1px red
  background-color black
.flex
  display flex
  flex-wrap wrap
  width 100%
  .t
    flex 1
    text-align center
.pad
  position fixed
  top 0
  left 0
  background-color black
  border solid 2px red
  height 100%
  overflow auto
.paditem
  margin 8px 15px !important
.choosed
  background-color red !important
  color white
</style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
