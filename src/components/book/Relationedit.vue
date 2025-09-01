<template>
  <div class="relationedit" v-show="isShow">
    <div>{{ editingrelation.name }}</div>

    <select v-model="choosedrelation">
      <option v-for="r in relationlist" :key="r.id" :value="r.id">{{ r.name }}</option>
    </select>

    <select v-model="choosedp2">
      <option v-for="p in parts" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>

  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req.js';
export default {
  name: 'Relationedit',
  props: ['book'],
  data() {
    return {
      isShow: false,
      choosedrelation: '',
      choosedp2: ''
    }
  },
  created() {
  },
  watch: {
    editingrelation(val) {
      if (val) this.isShow = true
      else this.isShow = false
    }
  },
  components: {},
  methods: {
    saveEdit() {
      req.post(this.$store.state.conf, 'bookeditrelation', {
        p1: this.editingrelation.id,
        p2: this.choosedp2,
        relationid: this.choosedrelation
      }).then((res) => {
        if (res !== 'mis') {
          this.$store.commit('addRelation', {id: this.book.id, partid: this.editingrelation.id, relation: res})
          this.$store.commit('addRelation', {id: this.book.id, partid: this.choosedp2, relation: res})
          this.$bus.emit('popupcheck')
          this.$store.commit('toEditRelation', {id: this.book.id, val: null})
        }
      })
    }
  },
  computed: mapState({
    relationlist: state => state.relationlist[this.book.id] || [],
    parts: state => state.parts[this.book.id] || [],
    editingrelation: state => state.editingrelation[this.book.id] || []
  })
}
</script>

<style lang="stylus" scoped>

</style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
