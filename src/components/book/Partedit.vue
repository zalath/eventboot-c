<template>
  <div class="partedit" v-show="isShowEdit">
    <div>pic:<input v-model="editpart.pic"/></div>
      <div>name:<input v-model="editpart.name"/></div>
      <div>age:<input v-model="editpart.age"/></div>
      <div>desc:<input v-model="editpart.desc"/></div>
      <div>type:<input v-model="editpart.type"/></div>
      <div>
        <button @click="isShowEdit = !isShowEdit">取消</button>
        <button @click="saveEdit">确定</button>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
export default {
  name: 'Partedit',
  props: {
    book: {}
  },
  data: function() {
    return {
      editpart: {
        partid: '',
        pic: '',
        name: '',
        age: 0,
        desc: '',
        type: 'new'
      },
      isShowEdit: false
    }
  },
  created() {
    // 注册事件监听，获取要编辑的partid，$store.state.parts更新editpart
    this.$bus.on('editPart', (partid) => {
      this.editpart = this.$store.state.parts[this.book.id][partid]
    })
  },
  methods: {
    saveEdit() {
      if (this.editingpart.type === 'new') {
        this.$store.emit('addParts')
      }
    }
  },
  computed: mapState({
    relationlist: state => state.relationlist,
    parts: state => state.parts,
    editingpart: state => state.editingpart
  })
}
</script>
<style lang="stylus" scoped>

</style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
