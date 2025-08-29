<template>
  <div class="relationbox">
    <div>{{ book.name }}</div>
    <div>
      <div v-for="(relation,i) in relationlist" :key="i">{{ relation.name }}</div>
    </div>
    <div class="clipbtn">
      <i class="fa fa-plus"></i>
    </div>
    <div class="newrelationbox" v-show="isshowNewRelation">
      <div>
        name:
        <input :value="name" />
      </div>
      <div>
        revname:
        <input :value="revname" />
      </div>
      <div>
        <button @click="isshowNewRelation = !isshowNewRelation">取消</button>
        <button @click="comfirmNewRelation">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import req from '../../js/req'
export default {
  name: 'Bookrelation',
  props: {
    book: {}
  },
  data() {
    return {
      isshowNewRelation: false,
      name: '',
      revname: ''
    }
  },
  created() {
  },
  methods: {
    comfirmNewRelation() {
      const newRelation = { name: this.name, revname: this.revname, bookid: this.book.id }
      req.post(this.$store.state.conf, 'bookaddrelation', newRelation).then(
        res => {
          if (res === 'done') {
            this.$store.emit('addRelation', {id: this.book.id, relation: newRelation})
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '添加失败')
          }
        }
      )
      this.isshowNewRelation = false
    },
    deleteRelation(id) {
      req.post(this.$store.state.conf, 'bookdeleterelation', {id: id}).then(
        res => {
          if (res === 'done') {
            this.$store.emit('deleteRelation', {id: this.book.id, relationId: id})
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '删除失败')
          }
        }
      )
    },
    editRelation(id) {
      // TODO 编辑关系，后续实现
    }
  },
  computed: {
    relationlist() {
      return this.$store.state.bookrelation[this.book.id]
    }
  }
}
</script>
<style lang="stylus" scoped>
.relationbox
  width 50vw
  height 50vh
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  border solid 1px red
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
