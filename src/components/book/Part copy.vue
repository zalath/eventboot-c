<template>
  <div class="part" @click="setzindex" :style="'z-index:' + zindex">
    <div class="titlebar" v-drag>
      {{ part.id + ' - ' + part.name }}
      <div v-if="partid != bookid" class="titlebtn" @click="closePart"><i class="fa fa-times"></i></div>
      <div v-else class="titlebtn" @click="$emit('minimize')"><i class="fa fa-minus"></i></div>
    </div>
    <div class="content">
      <div>
        {{ part.age==0?"":part.age }}
        {{ part.desc }}
      </div>
      <div class="clipbtn" @click="toEditPart('edit', 1)">
        <i class="fa fa-pencil"></i>
      </div>
      <div class="divider"></div>
      <div class="partlist">
        <div v-for="(r1, i) in parts[bookid][partid].relations" :key="i">
          <div class="partline" v-if="parts[bookid][partid].type == '1'"
            @click.stop="openPart(r1.p1, r1.p2)">
            {{ partName(r1) }} {{ partRelation(r1) }}
          </div>
        </div>
        <div v-if="partid == bookid" class="clipbtn" @click="toEditPart('new', 1)">
          <i class="fa fa-plus"></i>&nbsp;
          <i class="fa fa-user"></i>
        </div>
        <div v-else class="clipbtn" @click="toEditRelation()">
          <i class="fa fa-plus"></i>&nbsp;
          <i class="fa fa-link"></i>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div class="divider"></div>
      <div>
        <div v-for="(r2, j) in part2" :key="j">
          {{ p2.name }}
          <!-- 删除 -->
        </div>
        <div class="clipbtn" @click="toEditPart('new', 2)">
          <i class="fa fa-plus"></i>&nbsp;
          <i class="fa fa-file-text"></i>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div class="divider"></div>
      <div>
        <!-- delete this part-->
      </div>
    </div>
    <Partedit v-if="isShowPartEdit"
      :parttype="partType"
      :partid="partid"
      :bookid="bookid"
      :edittype="editType"
      @close="isShowPartEdit = false">
    </Partedit>
    <Relationedit v-if="isShowRelationEdit"
      :partid="partid"
      :bookid="bookid"
      @close="isShowRelationEdit = false">
    </Relationedit>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req';
import Partedit from './Partedit.vue'
import Relationedit from './Partrelation.vue'
import move from '../../js/move';

export default {
  name: 'Part',
  props: {
    partid: Number,
    bookid: Number,
    ind: Number,
    zindex: Number
  },
  data() {
    return {
      part: {},
      editType: '',
      partType: '',
      isShowPartEdit: false,
      isShowRelationEdit: false,
      part2: [] // 剧情类节点列表
    }
  },
  created() {
    // 获得本模块儿的子项关系
    // console.log('id check', this.bookid, this.partid)
    this.part = this.parts[this.bookid][this.partid]
    req.post('bookpartrelationlist', { id: this.partid }).then(
      (res) => {
        // console.log('getting part relation')
        // console.log(res)
        if (res !== 'mis') {
          this.$store.commit(
            'initPartRelation',
            { id: this.bookid, partid: this.partid, relations: res.data }
          )
        }
      }
    )
  },
  mounted() {
  },
  methods: {
    openPart(p1, p2) {
      var id = p1
      if (p1 === this.partid) id = p2
      this.$emit('openOne', id)
    },
    closePart() {
      // this.$emit('closeOne', this.partid)
      console.log(this.ind)
      this.$emit('closeOne', this.ind)
    },
    setzindex() {
      this.$emit('setzindex', this.ind)
    },
    toEditRelation() {
      // 为当前节点，绑定关系子节点
      this.isShowRelationEdit = !this.isShowRelationEdit
    },
    toEditPart(type, partType) {
      // 增加或编辑节点
      this.editType = type
      this.partType = partType
      this.isShowPartEdit = !this.isShowPartEdit
    },
    minimizePart() {
      this.$emit('closeOne', this.ind)
    },
    partName(r1) {
      if (r1.p1 === this.partid && this.parts[this.bookid][r1.p2].type === 1) {
        // 正向关系 - 取右侧节点名称 和 关系右侧的名称
        return this.parts[this.bookid][r1.p2].name
      } else if (r1.p2 === this.partid && this.parts[this.bookid][r1.p1].type === 1) {
        // 反向关系 - 取左侧节点名称 和 关系左侧的名称
        return this.parts[this.bookid][r1.p1].name
      }
      return ''
    },
    partRelation(r1) {
      if (r1.relationid === 1 || r1.relationid === 2) {
        return ''
      }
      if (r1.p1 === this.partid && this.parts[this.bookid][r1.p2].type === 1) {
        return '(' + this.relationtypelist[this.bookid][r1.relationid].name + ')'
      } else if (r1.p2 === this.partid && this.parts[this.bookid][r1.p1].type === 1) {
        return '(' + this.relationtypelist[this.bookid][r1.relationid].revname + ')'
      }
      return ''
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
.titlebar
  height 30px
  width 100%
  text-align center
  cursor pointer
  background-color red
  color white
  user-select none
  line-height 30px
.titlebtn
  float right
  width 30px
  line-height 30px
  &:hover
    background-color white
    color red
.part
  position fixed
  width 50%
  height 50%
  top  50%
  left 50%
  transform translate(-50%, -50%)
  border solid 1px red
  background-color black
  overflow-y auto
.divider
  clear both
  height 1px
  width 90%
  background-color red
  margin 30px auto
.partline
  display inline-block
  cursor pointer
  padding 5px
  &:hover
    background-color red
    color white
.content
  padding 0 4%
.clipbtn
  float right !important
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
