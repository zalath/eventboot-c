<template>
  <div class="part" ref="partContainer" @click.stop="setzindex" :style="'z-index:' + zindex" v-if="show">
    <div class="titlebar" v-drag>
      {{ part.id + ' - ' + part.name }}
      <div class="titlebtn" @click="closePart">
        <i v-if="part.type !== 0" class="fa fa-times"></i>
        <i v-else class="fa fa-minus"></i>
      </div>
    </div>
    <div class="content">
      <div class="part-infobar">
        <div class="info part-pic">
          <img :src="part.pic?$store.state.api + part.pic:defaultpic" @click.stop="zoomPic=!zoomPic" loading="lazy"/>
        </div>
        <div class="info part-txt">
          <div class="part-space"></div>
          <div><span class="part-input" disabled rows="2" placeholder="NAME">{{part.name}}</span></div>
          <div class="part-space"></div>
          <div><span class="part-input" disabled rows="2" placeholder="AGE">{{part.age}}</span></div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="partlist">
        <div class="partline" v-if="part.type === 2">
          <span @click.stop="openPart(bookid, 0)">{{ partName({p2: bookid}) }}</span>
        </div>
        <div class="partline" v-for="(r1, i) in parts[bookid][partid].relations" :key="i">
          <span @click.stop="openPart(r1.p1, r1.p2)">{{ partName(r1) }} {{ partRelation(r1) }}</span>
          <span v-if="!(part.type !== 0 && r1.p1 === bookid)" class="delbtn" @click.stop="partDelete(r1, i)">
            <i class="fa fa-times"></i>
          </span>
        </div>
        <div v-if="partid == bookid" class="clipbtn" @click="toEditPart('new', 1)">
          <i class="fa fa-plus"></i>&nbsp;
          <i class="fa fa-user"></i>
        </div>
        <div v-else class="clipbtn" @click="toAddRelation()">
          <i class="fa fa-plus"></i>&nbsp;
          <i class="fa fa-link"></i>
        </div>
      </div>
      <div v-if="parts[bookid][partid].relations2 && parts[bookid][partid].relations2.length > 0" class="divider"></div>
      <div v-if="parts[bookid][partid].relations2 && parts[bookid][partid].relations2.length > 0"  class="partlist">
        <div class="partline" v-for="(r2, j) in parts[bookid][partid].relations2" :key="j" @click.stop="openPart(r2.p1, r2.p2)">
          {{ partName(r2) }}
          <span v-if="part.type === 0" class="delbtn" @click.stop="partDelete(r2, i)">
            <i class="fa fa-times"></i>
          </span>
        </div>
        <div v-if="partid == bookid" class="clipbtn" @click="toEditPart('new', 2)">
          <i class="fa fa-plus"></i>&nbsp;
          <i class="fa fa-file-text"></i>
        </div>
      </div>
      <div class="divider"></div>
      <div class="part-desc" v-html="renderedMarkdown"></div>
      <div class="part-btns">
        <div class="clipbtn" @click="toEditPart('edit', 1)"><i class="fa fa-pencil"></i></div>
        <div class="clipbtn" @click="show=false;show=true;"><i class="fa fa-refresh"></i></div>
      </div>
      <div class="resizeBtn" @mousedown="startResize">
      </div>
      <div class="zoompic" v-if="zoomPic" @click="zoomPic=false">
        <img :src="$store.state.api + part.pic" loading="lazy"/>
      </div>
    </div>
    <Partedit ref="partedit">
    </Partedit>
    <Relationedit ref="relationedit">
    </Relationedit>
  </div>
</template>

<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req';
import Partedit from './Partedit.vue'
import Relationedit from './Partrelation.vue'
import move from '../../js/move';
import data from '../../js/data'
import defaultpic from '../../assets/defaultpic.png'
import mdi from '../../js/markdown.js'

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
      defaultpic,
      part: {},
      show: true,
      // 新增：用于存储拖拽状态
      isResizing: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      zoomPic: false
    }
  },
  created() {
    // 获得本模块的子项关系
    this.part = this.parts[this.bookid][this.partid]
    var conditionRelation = {}
    var conditionRelation2 = {}
    switch (this.part.type) {
    case 0:
      conditionRelation = { p1: this.partid, relationid: 1, p2: 0 }
      conditionRelation2 = { p1: this.partid, relationid: 2, p2: 0 }
      break
    case 2:
      conditionRelation = { p1: this.partid, relationid: 2, p2: 0 }
      conditionRelation2 = false
      break
    case 1:
      conditionRelation = { p1: this.partid, relationid: 0, p2: this.partid }
      conditionRelation2 = { p1: 0, relationid: 2, p2: this.partid }
    }
    req.post('bookpartrelationlist', conditionRelation).then(
      (res) => {
        if (res !== 'mis') {
          this.$store.commit(
            'initPartRelation',
            { id: this.bookid, partid: this.partid, relations: res.data }
          )
        }
      }
    )
    if (conditionRelation2) {
      req.post('bookpartrelationlist', conditionRelation2).then(
        (res) => {
          if (res !== 'mis') {
            this.$store.commit(
              'initPartRelation2',
              { id: this.bookid, partid: this.partid, relations: res.data }
            )
          }
        }
      )
    }
  },
  methods: {
    openPart(p1, p2) {
      console.log('call open')
      var id = p1
      if (p1 === this.partid) id = p2
      this.$emit('openOne', id)
    },
    closePart() {
      if (this.partid === this.bookid) {
        this.$emit('minimize')
      } else {
        this.$emit('closeOne', this.ind)
      }
    },
    setzindex() {
      this.$emit('setzindex', this.ind)
    },
    toAddRelation() {
      console.log('call add relation')
      this.$refs.relationedit.toggleShow(this.bookid, this.partid)
    },
    toEditPart(type, partType) {
      this.$refs.partedit.toggleShow(this.bookid, this.partid, type, partType)
    },
    minimizePart() {
      this.$emit('closeOne', this.ind)
    },
    partName(r1) {
      const book = this.parts[this.bookid]
      if (!book) return ''
      if (this.bookid === this.partid || this.part.type === 2) {
        return book[r1.p2]?.name || ''
      }
      if (r1.p1 === this.partid) {
        return book[r1.p2]?.name || ''
      } else {
        return book[r1.p1]?.name || ''
      }
    },
    partRelation(r1) {
      if (r1.relationid === 1 || r1.relationid === 2) {
        return ''
      }
      var relation = this.relationtypelist[this.bookid][r1.relationid]
      if (this.part.id === r1.p1) {
        return '(' + (r1.direction === 1 ? relation.revname : relation.name) + ')'
      } else {
        return '(' + (r1.direction === 1 ? relation.name : relation.revname) + ')'
      }
    },
    async partDelete(relation, index) {
      if (!window.confirm('确定要删除此项吗？')) {
        return; // 用户点击取消，直接返回
      }
      if (this.part.type === 0) {
        req.post('fdel', {del: this.parts[this.bookid][relation.p2].pic }).then((res) => {})
        data.cleanPartRelation(this.$store, this.bookid, relation.p2)
        req.post('bookdelpart', { id: relation.p2 }).then((res) => {
          if (res !== 'mis') {
            this.$store.commit('delPart', { bookid: this.bookid, partid: relation.p2 })
          }
        })
      } else {
        req.post('bookdelrelation', { id: relation.id }).then((res) => {
          if (res !== 'mis') {
            this.$store.commit('delRelationById', { bookid: this.bookid, partid: this.partid, id: relation.id })
          }
        })
      }
    },
    /**
     * 开始调整大小
     */
    startResize(e) {
      e.preventDefault();
      e.stopPropagation();

      this.isResizing = true;
      this.startX = e.clientX;
      this.startY = e.clientY;

      // 获取当前容器的初始宽高
      const container = this.$refs.partContainer;
      if (container) {
        this.startWidth = container.offsetWidth;
        this.startHeight = container.offsetHeight;

        // 绑定全局移动和松开事件，防止鼠标移出按钮区域后失效
        document.addEventListener('mousemove', this.doResize);
        document.addEventListener('mouseup', this.stopResize);
      }
    },

    /**
     * 执行调整大小
     */
    doResize(e) {
      if (!this.isResizing) return;

      const container = this.$refs.partContainer;
      if (!container) return;

      // 计算鼠标移动的距离
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;

      // 计算新宽高 (最小宽度/高度限制，例如 200px)
      const newWidth = Math.max(200, this.startWidth + deltaX);
      const newHeight = Math.max(200, this.startHeight + deltaY);

      // 应用新样式
      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
    },

    /**
     * 停止调整大小
     */
    stopResize() {
      this.isResizing = false;
      // 移除全局监听器
      document.removeEventListener('mousemove', this.doResize);
      document.removeEventListener('mouseup', this.stopResize);
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
    }),
    renderedMarkdown: function () {
      return mdi.render(this.part.desc)
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
  },
  beforeUnmount() {
    // 确保组件销毁时清理事件监听，防止内存泄漏
    document.removeEventListener('mousemove', this.doResize);
    document.removeEventListener('mouseup', this.stopResize);
  }
}
</script>
<style lang="stylus" scoped>
.part
  position fixed
  width 50%
  height 50%
  top 50%
  left 50%
  transform translate(-50%, -50%)
  border solid 1px red
  background-color black
  display flex
  flex-direction column
  overflow hidden
.titlebar
  height 30px
  width 100%
  /* 3. 固定高度，不伸缩 */
  flex-shrink 0
  text-align center
  cursor pointer
  background-color red
  color white
  user-select none
  line-height 30px
  z-index 10
.titlebtn
  float right
  width 30px
  line-height 30px
  &:hover
    background-color white
    color red
.content
  padding 0 4%
  flex-grow 1
  overflow-y auto
  overscroll-behavior smooth
.partlist
  display flex
  flex-wrap wrap
  gap 5px
.partline
  display flex
  cursor pointer
  padding 5px
  &:hover
    background-color red
    color white
.clipbtn
  float right !important
.resizeBtn
  position absolute
  bottom 0
  right 0
  width 15px
  height 15px
  cursor nwse-resize
  background-color red
  z-index 20
.zoompic
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  display flex
  justify-content center
  vertical-align middle
  background-color rgba(0, 0, 0, 0.8)
  img
    max-width 100%
    object-fit contain
</style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
