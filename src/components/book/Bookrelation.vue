<template>
  <div class="relationbox">
    <div>{{ book.name }}</div>
    <div>
      <div v-for="(relation,i) in relationlist" :key="i">
        {{ relation.name }}
        &emsp;&lt;-&gt;
        {{ relation.revname }}
        <button @click="deleteRelation(relation.id)">删除</button>
      </div>
    </div>
    <div class="clipbtn" @click="isshowNewRelation=true">
      <i class="fa fa-plus"></i>
    </div>
    <div class="newrelationbox" v-show="isshowNewRelation">
      <div>
        name:
        <input v-model="relation.name" />
      </div>
      <div>
        revname:
        <input v-model="relation.revname" />
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
import data from '../../js/data'

export default {
  name: 'Bookrelation',
  props: {
    book: {}
  },
  data() {
    return {
      isshowNewRelation: false,
      relation: {},
      relationlist: []
    }
  },
  async created() {
    if (this.$store.state.relationlist[this.book.id] === undefined) {
      await data.initBookRelation(this.$store, this.book.id)
    }
    this.relationlist = this.$store.state.relationlist[this.book.id]
  },
  methods: {
    comfirmNewRelation() {
      this.relation.bookid = this.book.id
      console.log(this.relation)
      if (this.relation.name === '' || this.relation.revname === '') {
        this.$bus.emit('popuperror', '请输入完整信息')
        return
      }
      req.post(this.$store.state.conf, 'bookcreaterelationtype', this.relation).then(
        res => {
          if (res.data !== 'mis') {
            this.$store.commit('addRelationType', {id: this.book.id, relation: res.data})
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '添加失败')
          }
        }
      )
      this.isshowNewRelation = false
    },
    deleteRelation(id) {
      req.post(this.$store.state.conf, 'bookdelrelationtype', {id: id}).then(
        res => {
          if (res.data === 'done') {
            this.$store.commit('deleteRelationType', {id: this.book.id, relationId: id})
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
