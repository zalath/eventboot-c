<template>
  <div class="partedit">
    <div>pic:<input v-model="editpart.pic"/></div>
      <div>name:<input v-model="editpart.name"/></div>
      <div>age:<input v-model="editpart.age"/></div>
      <div>desc:<input v-model="editpart.desc"/></div>
      <div v-if="this.relationpos == 1">relation:
        <select v-model="relationid">
          <option v-for="r in relationtypelist[this.bookid]" :key="r.id" :value="r.id">{{ r.name }} => {{ r.revname }}</option>
        </select>
      </div>
      <div v-if="this.relationpos == 2">relation:
        <select v-model="relationid">
          <option v-for="r in relationtypelist[this.bookid]" :key="r.id" :value="r.id">{{ r.revname }} => {{ r.name }}</option>
        </select>
      </div>
      <div>relationpos：
        <select v-model="relationpos">
          <option key="1" value="1">正向</option>
          <option key="2" value="2">反向</option>
        </select>
      </div>
      <div>
        <div class="clipbtn" @click="$emit('close')">
          <i class="fa fa-times"></i>
        </div>
        <div class="clipbtn" @click="saveEdit()">
          <i class="fa fa-check"></i>
        </div>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req.js'
export default {
  name: 'Partedit',
  props: {
    edittype: String, // edit or new
    parttype: String, // 1角色part,2剧情part
    partid: Number,
    bookid: Number
  },
  data: function() {
    return {
      editpart: {},
      relationid: Number,
      relationpos: 1
    }
  },
  created() {
    if (this.edittype !== 'new') {
      this.editpart = this.parts[this.bookid][this.partid]
    } else {
      this.editpart = {
        pic: '',
        name: '',
        age: 0,
        desc: ''
      }
    }
  },
  methods: {
    saveEdit() {
      if (this.edittype === 'new') {
        this.editpart.type = this.parttype
        this.editpart.pct = 0
        this.editpart.p1 = this.partid
        this.editpart.relationid = this.relationid
        this.editpart.relationpos = this.relationpos
        this.editpart.bookid = this.bookid
        console.log(this.editpart)
        req.post('booknewpart', this.editpart).then(res => {
          console.log(res)
          if (res === 'mis') {
            this.$bus.emit('popuperror', '创建失败')
            this.$emit('close')
          } else {
            this.$store.commit('addParts', {id: this.bookid, partid: res.data.id, part: res.data})
            // this.$store.commit('addRelation', {id: this.bookid, partid: res.data.id, relation: })
            this.$bus.emit('popupcheck')
            this.$emit('close')
          }
        })
      } else {}
    }
  },
  computed: mapState({
    relationtypelist: state => state.relationtypelist,
    parts: state => state.parts
  })
}
</script>
<style lang="stylus" scoped>
.partedit
  position fixed
  width 90%
  height 50%
  top 50%
  left 50%
  transform translate(-50%, -50%)
  border solid 1px red
  background-color black
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
