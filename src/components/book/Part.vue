<template>
  <div class="part">
    <div>{{ part.name }}</div>
    <div>
      {{ part.age }}
      {{ part.desc }}
    </div>
    <div class="divider"></div>
    <div>
      <div v-for="(r1,i) in relation1" :key="i" @click="openPart(p1)">
        {{ r1.p1 === partid ?parts[r1.p2].name:parts[r1.p1].name }}
        :{{ r1.p1 === partid ?relationlist[r1.relationid].revname:relationlist[r1.relationid].name }}
        <!-- 删除 -->
      </div>
      <div>
        <div class="clipbtn" @click="toEditRelation()">
          <i class="fa fa-plus"></i>
          <i class="fa fa-link"></i>
        </div>
        <div class="clipbtn" @click="toEditPart('new')">
          <i class="fa fa-plus"></i>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div>
      <div v-for="(r2,j) in relation2" :key="j">
        {{ p2.name }}
        <!-- 删除 -->
      </div>
      <div class="clipbtn" @click="openEdit('new')">
        <i class="fa fa-plus"></i>
      </div>
    </div>
    <div class="divider"></div>
    <div>
      <!-- delete this part-->
    </div>
    <Partedit v-if="isShowPartEdit" :type="editType" :partid="partid" :bookid="bookid"></Partedit>
    <Relationedit v-if="isShowRelationEdit" :partid="partid" :bookid="bookid"></Relationedit>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req';
import Partedit from './Partedit.vue'
import Relationedit from './Relationedit.vue'
export default {
  name: 'Part',
  props: {
    partid: Number,
    bookid: Number
  },
  data() {
    return {
      relation1: [],
      relation2: [],
      part: {},
      editType: '',
      isShowPartEdit: false,
      isShowRelationEdit: false
    }
  },
  created() {
    // 获得本模块儿的子项关系
    this.part = this.parts[this.bookid][this.partid]
    req.post(this.$store.state.conf, 'bookparts', { id: this.partid }).then(
      (res) => {
        if (res !== 'mis') {
          this.$store.commit('initPartRelation', {id: this.bookid, partid: this.partid, relations: res.data})
          this.relation1 = res.data.filter(p => p.type === 1);
          this.relation2 = res.data.filter(p => p.type === 2);
        }
      }
    )
  },
  mounted() {
  },
  methods: {
    openPart(id) {
      this.emit('openOne', id)
    },
    toEditRelation() {
      // 为当前节点，绑定关系子节点
      this.isShowRelationEdit = true
    },
    toEditPart(type) {
      // 为当前节点，增加子节点
      this.editType = type
      this.isShowPartEdit = true
    },
    saveEdit() {
      if (this.isShowAdd) {
        this.editpart.p1 = this.part.id
        this.editpart.relationid = this.choosedrelation.id
        this.editpart.relationpos = this.choosedrelation.pos
        req.post(this.$store.state.conf, 'booknewpart', this.editpart).then(res => {
          this.isShowAdd = false
          res.Relationname = this.choosedrelation.pos === 1 ? this.choosedrelation.name : this.choosedrelation.revname
        })
      } else {
      }
    },
    deletePart() {
      // 删除当前节点
    }
  },
  components: {
    Partedit,
    Relationedit
  },
  computed: mapState({
    parts: state => state.parts,
    relationlist: state => state.relationlist
  })
}
</script>
<style lang="stylus" scoped>
.part
  position fixed
  width 50vw
  height 50vh
  top 50%
  left 50%
  transform translate(-50%, -50%)
  border solid 1px red
  background-color black
  overflow-y scroll
.divider
  clear both
  height 1px
  width 90%
  background-color red
  margin auto
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
