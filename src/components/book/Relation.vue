<template>
  <div class="relationbox">
    <div class="part-titlebar" v-drag>
      {{ book.name }}
      <div class="part-titlebtn" @click="close">
        <i class="fa fa-times"></i>
      </div>
    </div>
    <div class="content">
      <br/>
      <div class="flex" v-for="(relation, i) in relationtypelist" :key="i">
        <div class="t names">{{ relation.name }}&emsp;&lt;-&gt;&emsp;{{ relation.revname }}</div>
        <div class="t">
          <div class="clipbtn" @click="deleteRelation(relation.id)"><i class="fa fa-times"></i></div>
          <div class="clipbtn" @click="toEditRelation(i)"><i class="fa fa-pencil"></i></div>
        </div>
      </div>
      <br/>
    </div>
    <div class="part-btns">
      <div class="clipbtn" @click="toNewRelation">
        <i class="fa fa-plus"></i>
      </div>
    </div>
    <div class="newrelationbox" v-show="isshowEditRelation" @contextmenu="isshowEditRelation=false">
      <div class="detail">
        <div>
          name:
          <textarea class="part-input" v-model="relation.name" ></textarea>
        </div>
        <div>
          revname:
          <textarea class="part-input" v-model="relation.revname" ></textarea>
        </div>
        <br/>
        <div>
          <div class="clipbtn" @click="isshowEditRelation = !isshowEditRelation">取消</div>
          <div class="clipbtn" v-if="relation.id === undefined" @click="comfirmNewRelation">确定</div>
          <div class="clipbtn" v-else @click="editRelation">更新</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import req from '../../js/req'
import data from '../../js/data'
import move from '../../js/move';

export default {
  name: 'Bookrelation',
  props: {
    book: {}
  },
  data() {
    return {
      isshowEditRelation: false,
      relation: {},
      relationtypelist: []
    }
  },
  async created() {
    if (this.$store.state.relationtypelist[this.book.id] === undefined) {
      await data.initBookRelationType(this.$store, this.book.id)
    }
    this.relationtypelist = this.$store.state.relationtypelist[this.book.id]
  },
  methods: {
    toNewRelation() {
      this.relation = {}
      this.isshowEditRelation = true
    },
    comfirmNewRelation() {
      this.relation.bookid = this.book.id
      if (this.relation.name === '' || this.relation.revname === '') {
        this.$bus.emit('popuperror', '请输入完整信息')
        return
      }
      req.post('bookcreaterelationtype', this.relation).then(
        res => {
          if (res.data !== 'mis') {
            this.$store.commit('updateRelationType', { id: this.book.id, relation: res.data })
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '添加失败')
          }
        }
      )
      this.isshowEditRelation = false
    },
    deleteRelation(id) {
      req.post('bookdelrelationtype', { id: id }).then(
        res => {
          if (res.data === 'done') {
            this.$store.commit('deleteRelationType', { id: this.book.id, relationid: id })
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '删除失败')
          }
        }
      )
    },
    toEditRelation(i) {
      this.relation = this.relationtypelist[i]
      this.isshowEditRelation = true
    },
    editRelation() {
      if (this.relation.name === '' || this.relation.revname === '') {
        this.$bus.emit('popuperror', '请输入完整信息')
        return
      }
      req.post('bookupdaterelationtype', this.relation).then(
        res => {
          if (res.data !== 'mis') {
            this.$store.commit('updateRelationType', { id: this.book.id, relation: this.relation })
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '修改失败')
          }
        }
      )
      this.isshowEditRelation = false
    },
    close() {
      this.$emit('close')
    }
  },
  directives: {
    drag(el, binding) {
      el.onmousedown = function (e) {
        var elv = el
        var ev = binding.instance
        el = el.parentNode
        move.draging(el, ev, e, binding, 0, 'fixed', true)
        el = elv
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.relationbox
  width 60vw
  height 40vh
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  border solid 1px red
  background-color black
  display flex
  flex-direction column
.content
  overflow-y auto
.flex
  display flex
  text-align center
  align-items center
  width 100%
  margin-top 5px
  .t
    flex 1
  &:hover
    .names
      border-bottom solid 1px red
.names
  height 100%
.newrelationbox
  width 100%
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  background-color black
  border solid 1px red
  .detail
    margin auto
    padding 40px 20px
    display flex
</style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
