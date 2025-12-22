<template>
  <div class="part">
    <div>{{ part.name }}</div>
    <div>
      {{ part.age }}
      {{ part.desc }}
    </div>
    <div class="divider"></div>
    <div class="partlist">
      <div v-for="(r1,i) in parts[bookid][partid].relations" :key="i" @click="openPart(p1)">
        <div v-if="r1.p1 == partid">
          <div v-if="parts[bookid][r1.p2].type == 1">
            {{ parts[bookid][r1.p2].name }}
            --{{ relationtypelist[bookid][r1.relationid].revname }}
            <!-- 删除 -->
          </div>
        </div>
        <div v-else>
          <div v-if="parts[bookid][r1.p1].type == 1">
            {{ parts[bookid][r1.p1].name }}
            --{{ relationtypelist[bookid][r1.relationid].name }})
          </div>
        </div>
      </div>
      <div>
        <div class="clipbtn" @click="toEditRelation()">
          <i class="fa fa-plus"></i>
          <i class="fa fa-link"></i>
        </div>
        <div class="clipbtn" @click="toEditPart('new', 1)">
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
      <div class="clipbtn" @click="toEditPart('new', 2)">
        <i class="fa fa-plus"></i>
      </div>
    </div>
    <div class="divider"></div>
    <div>
      <!-- delete this part-->
    </div>
    <Partedit v-if="isShowPartEdit" :parttype="partType" :partid="partid" :bookid="bookid" :edittype="editType" @close="isShowPartEdit=false"></Partedit>
    <Relationedit v-if="isShowRelationEdit" :partid="partid" :bookid="bookid" @close="isShowRelationEdit=false"></Relationedit>
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
      part: {},
      editType: '',
      partType: '',
      isShowPartEdit: false,
      isShowRelationEdit: false
    }
  },
  created() {
    // 获得本模块儿的子项关系
    this.part = this.parts[this.bookid][this.partid]
    req.post('bookpartrelationlist', { id: this.partid }).then(
      (res) => {
        console.log('getting part relation')
        console.log(res)
        if (res !== 'mis') {
          this.$store.commit(
            'initPartRelation',
            {id: this.bookid, partid: this.partid, relations: res.data}
          )
        }
      }
    )
  },
  mounted() {
  },
  methods: {
    openPart(id) {
      this.$emit('openOne', id)
    },
    toEditRelation() {
      // 为当前节点，绑定关系子节点
      this.isShowRelationEdit = !this.isShowRelationEdit
    },
    toEditPart(type, partType) {
      // 为当前节点，增加子节点
      this.editType = type
      this.partType = partType
      this.isShowPartEdit = !this.isShowPartEdit
    },
    deletePart() {
      // 删除当前节点
    }
  },
  components: {
    Partedit,
    Relationedit
  },
  computed: {
    ...mapState({
      parts: state => state.parts,
      relationtypelist: state => state.relationtypelist
    })
  }
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
