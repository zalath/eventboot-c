<template>
  <div class="relationedit">
    <div>{{ part.name }}</div>

    <select v-model="choosedrelation">
      <option v-for="r in relationlist[bookid]" :key="r.id" :value="r.id">{{ r.name }} -- {{ r.revname }}</option>
    </select>

    <select v-model="choosedp2">
      <option v-for="p in parts[bookid]" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>

  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req.js';
export default {
  name: 'Relationedit',
  props: {
    bookid: Number,
    partid: Number
  },
  data() {
    return {
      choosedrelation: 0,
      choosedp2: 0,
      part: {}
    }
  },
  created() {
    console.log('in Relationedit created')
    this.part = this.parts[this.bookid][this.partid]
    console.log(this.part)
  },
  components: {},
  methods: {
    saveEdit() {
      req.post(this.$store.state.conf, 'bookmakerelation', {
        p1: this.part.id,
        p2: this.choosedp2,
        relationid: this.choosedrelation
      }).then((res) => {
        if (res !== 'mis') {
          this.$store.commit('addRelation', {id: this.bookid, partid: this.part.id, relation: res})
          this.$store.commit('addRelation', {id: this.bookid, partid: this.choosedp2, relation: res})
          this.$bus.emit('popupcheck')
        }
      })
    }
  },
  computed: mapState({
    relationlist: state => state.relationlist,
    parts: state => state.parts,
    editingrelation: state => state.editingrelation
  })
}
</script>

<style lang="stylus" scoped>
.relationedit
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
