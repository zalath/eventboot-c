<template>
  <div v-if="show" class="partedit">
    <div class="part-edit">
      <div class="part-space"></div>
      <div class="part-infobar">
        <div class="info part-pic">
          <div class="part-picbtn">
            <div class="clipbtn">
              <i>{{ picdisplay.length>0?picindex+1:"0" }}</i>
            </div>
            <br/>
            <div class="clipbtn" @click="nextpic(-1)">
              <i class="fa fa-chevron-left"></i>
            </div>
            <br/>
            <div class="clipbtn">
              <i>{{ picdisplay.length>0?picdisplay.length:"0" }}</i>
            </div>
          </div>
          <div class="part-pics">
            <img v-if="picdisplay.length === 0" :src="defaultpic"/>
            <img v-else :src="picdisplay[picindex].url" @click="zoompic()"/>
            <input type="file" style="display:none;" ref="file" multiple @change="tempPic($event)"/>
          </div>
          <div class="part-picbtn">
            <div>
              <div class="clipbtn" @click.stop="$refs.file.click()">
                <i class="fa fa-plus"></i>
              </div>
              <br/>
              <div class="clipbtn" @click="nextpic(1)">
                <i class="fa fa-chevron-right"></i>
              </div>
              <br/>
              <div class="clipbtn" @click="delpic()">
                <i class="fa fa-times"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="info part-txt">
          <div class="part-space"></div>
          <textarea class="part-input" rows="2" placeholder="NAME" v-model="editpart.name"></textarea>
          <textarea class="part-input" rows="2" placeholder="AGE" v-model="editpart.age"></textarea>
        </div>
      </div>
      <div class="part-space"></div>
      <div class="desc">
        <div
          class="highlight-layer"
          ref="highlightLayer"
          v-show="isSearch && matchCount > 0"
          v-html="highlightedContent"
          :style="'font-size:'+contentFontSize+'px;'"
        ></div>
        <textarea
          ref="descTextarea"
          class="part-input"
          :class="{ searching: isSearch && matchCount > 0 }"
          :style="'font-size:'+contentFontSize+'px;caret-witch=4px;'"
          placeholder="DESC"
          v-model="editpart.desc"
          @keydown.tab="handleTab"
          @emacs-save="handleEmacsSave"
          @emacs-search="handleSearch"
          @emacs-replace-current="handleReplaceCurrent"
          @emacs-replace-all="handleReplaceAll"
          @scroll="syncHighlightScroll"
          >
        </textarea>
        <div class="searchbox" v-if="isSearch">
          <div class="search-row">
            <input
              ref="searchInput"
              class="search-input"
              type="text"
              v-model="searchText"
              placeholder="搜索..."
              @input="doSearch"
              @keydown="onSearchKeydown"
            />
            <span class="search-count" v-if="searchText">{{ currentMatch + 1 }} / {{ matchCount }}</span>
            <span class="search-count" v-else>0 / 0</span>
            <span class="search-btn" @click="prevMatch"><i class="fa fa-chevron-left"></i></span>
            <span class="search-btn" @click="nextMatch"><i class="fa fa-chevron-right"></i></span>
            <span class="search-btn" @click="closeSearch"><i class="fa fa-times"></i></span>
          </div>
          <div class="search-row">
            <input
              ref="replaceInput"
              class="search-input"
              type="text"
              v-model="replaceText"
              placeholder="替换为..."
              @keydown="onReplaceKeydown"
            />
            <span class="search-btn replace-btn" @click="replaceCurrent" :title="'替换当前 (Ctrl+R)'"><i class="fa fa-check"></i></span>
            <span class="search-btn replace-btn" @click="replaceAll" :title="'全部替换 (Ctrl+Shift+R)'"><i class="fa fa-recycle"></i></span>
          </div>
        </div>
      </div>
      <div class="part-space"></div>
      <div class="part-space"></div>
      <div class="part-btns">
        <div v-if="editpart.desc!==''" class="clipbtn noborder">{{ editpart.desc.length }}</div>
        <div class="clipbtn" @click="fontsize(2)">
          <i class="fa fa-plus"></i>
        </div>
        <div class="clipbtn" @click="fontsize(-2)">
          <i class="fa fa-minus"></i>
        </div>
        <div class="clipbtn" @click="saveEdit()">
          <i class="fa fa-check"></i>
        </div>
        <div class="clipbtn" @click="toggleShow()">
          <i class="fa fa-times"></i>
        </div>
      </div>
      <div class="zoompic" v-if="zoomPic" @click="zoompic()">
        <img :src="picdisplay[picindex].url" loading="lazy"/>
        <div v-if="picdisplay.length > 1" class="pic-nav">
          <span @click.stop="nextpic(-1)" class="clipbtn"><i class="fa fa-chevron-left"></i></span>
          <span class="nav-info">{{ picindex + 1 }} / {{ picdisplay.length }}</span>
          <span @click.stop="nextpic(1)" class="clipbtn"><i class="fa fa-chevron-right"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
import req from '../../js/req.js'
import keybinding from '../../js/keybinding.js';
import defaultpic from '../../assets/defaultpic.png';
export default {
  name: 'Partedit',
  mixins: [keybinding],
  data: function() {
    return {
      defaultpic,
      edittype: 'new', // edit or new
      parttype: 1, // 1角色part,2剧情part
      partid: 0,
      bookid: 0,
      show: false,
      editpart: {},
      relationid: Number,
      relationpos: 1,
      contentFontSize: 14,
      picdisplay: [],
      pic: [],
      isPicChanged: false,
      picindex: 0,
      zoomPic: false,
      isSearch: false,
      searchText: '',
      replaceText: '',
      matchCount: 0,
      currentMatch: 0,
      matchPositions: [],
      resizeObserver: null
    }
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },
  methods: {
    tempPic(event) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.picdisplay.push({ url: e.target.result, file: file });
          this.picindex = this.picdisplay.length - 1;
        });
        reader.readAsDataURL(file);
      });
      this.isPicChanged = true;
    },
    handleTab(e) {
      e.preventDefault(); // 阻止默认的焦点切换行为
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      // 在光标位置插入制表符
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      this.editpart.desc = newValue;
      // 使用 $nextTick 确保 DOM 更新后再设置光标位置
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
    },
    handleEmacsSave(e) {
      // 处理 Ctrl+X Ctrl+S 或 Ctrl+X S 触发的保存事件
      console.log('Emacs save triggered');
      this.saveEdit();
    },
    handleSearch() {
      if (this.isSearch && this.searchText) {
        // 搜索状态下，再次按Ctrl+S则跳转到下一个匹配
        this.nextMatch()
      } else {
        this.isSearch = !this.isSearch
        if (this.isSearch) {
          this.$nextTick(() => {
            if (this.$refs.searchInput) {
              this.$refs.searchInput.focus()
            }
          })
        } else {
          this.closeSearch()
        }
      }
    },
    handleReplaceCurrent() {
      if (!this.isSearch) {
        // 如果搜索面板未打开，先打开
        this.isSearch = true
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      } else {
        this.replaceCurrent()
      }
    },
    handleReplaceAll() {
      if (!this.isSearch) {
        // 如果搜索面板未打开，先打开
        this.isSearch = true
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      } else {
        this.replaceAll()
      }
    },
    doSearch() {
      const text = this.editpart.desc || ''
      const query = this.searchText
      this.matchPositions = []
      if (query && text) {
        let pos = 0
        while ((pos = text.indexOf(query, pos)) !== -1) {
          this.matchPositions.push(pos)
          pos += query.length
        }
      }
      this.matchCount = this.matchPositions.length
      this.currentMatch = 0
      if (this.matchPositions.length > 0) {
        this.gotoMatch(0)
      }
    },
    onSearchKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        this.closeSearch()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this.prevMatch()
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        this.nextMatch()
      }
    },
    gotoMatch(index) {
      if (this.matchPositions.length === 0) return
      if (index < 0) index = this.matchPositions.length - 1
      if (index >= this.matchPositions.length) index = 0
      this.currentMatch = index
      const textarea = this.$refs.descTextarea
      if (!textarea) return
      const pos = this.matchPositions[index]
      const queryLen = this.searchText.length
      // 在搜索/替换框中输入时不抢焦点，避免后续字符打进正文
      const active = document.activeElement
      const typingInSearch = active === this.$refs.searchInput || active === this.$refs.replaceInput
      if (!typingInSearch) {
        textarea.focus()
      }
      textarea.setSelectionRange(pos, pos + queryLen)
      // 等高亮层按新渲染结果更新后再滚动定位
      this.$nextTick(() => {
        this.scrollToMatch(index)
      })
    },
    scrollToMatch(index) {
      const textarea = this.$refs.descTextarea
      const layer = this.$refs.highlightLayer
      if (!textarea || !layer || this.matchCount === 0) return
      const span = layer.querySelectorAll('span')[index]
      if (!span) return
      // 用镜像层中高亮 span 的实际位置定位，兼容自动换行（line-height normal 时 parseFloat 为 NaN，不能按行号估算）
      // 必须加回 layer.scrollTop 换算成内容坐标：远距离跳转时镜像层还停留在旧滚动位置，直接用视口差值会偏差一个旧偏移量
      const layerRect = layer.getBoundingClientRect()
      const spanRect = span.getBoundingClientRect()
      const top = spanRect.top - layerRect.top + layer.scrollTop
      textarea.scrollTop = Math.max(0, top - (textarea.clientHeight - spanRect.height) / 2)
      this.syncHighlightScroll()
    },
    prevMatch() {
      if (this.matchPositions.length === 0) return
      this.gotoMatch(this.currentMatch - 1)
    },
    nextMatch() {
      if (this.matchPositions.length === 0) return
      this.gotoMatch(this.currentMatch + 1)
    },
    closeSearch() {
      this.isSearch = false
      this.searchText = ''
      this.replaceText = ''
      this.matchCount = 0
      this.currentMatch = 0
      this.matchPositions = []
      const textarea = this.$refs.descTextarea
      if (textarea) textarea.focus()
    },
    onReplaceKeydown(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (e.shiftKey) {
          this.replaceAll()
        } else {
          this.replaceCurrent()
        }
      }
    },
    replaceCurrent() {
      if (this.matchPositions.length === 0 || !this.searchText) return
      const textarea = this.$refs.descTextarea
      if (!textarea) return
      const pos = this.matchPositions[this.currentMatch]
      const queryLen = this.searchText.length
      const newText = textarea.value.substring(0, pos) + this.replaceText + textarea.value.substring(pos + queryLen)
      textarea.value = newText
      this.editpart.desc = newText
      // 重新搜索
      this.doSearch()
      // 光标定位到替换后的位置
      this.$nextTick(() => {
        textarea.focus()
        const newPos = pos + this.replaceText.length
        textarea.setSelectionRange(newPos, newPos)
        // 如果还有匹配项，跳转到下一个
        if (this.matchPositions.length > 0) {
          this.gotoMatch(this.currentMatch)
        }
      })
    },
    replaceAll() {
      if (this.matchPositions.length === 0 || !this.searchText) return
      const textarea = this.$refs.descTextarea
      if (!textarea) return
      const text = textarea.value
      const replaced = text.split(this.searchText).join(this.replaceText)
      textarea.value = replaced
      this.editpart.desc = replaced
      // 重新搜索
      this.doSearch()
      this.$nextTick(() => {
        textarea.focus()
        if (this.matchPositions.length > 0) {
          this.gotoMatch(0)
        }
      })
    },
    syncHighlightScroll() {
      const textarea = this.$refs.descTextarea
      const layer = this.$refs.highlightLayer
      if (textarea && layer) {
        // textarea 出现滚动条后内容宽度变窄，镜像层必须同步为同样的宽度，否则换行位置错开导致高亮偏移
        layer.style.width = textarea.clientWidth + 'px'
        layer.scrollTop = textarea.scrollTop
        layer.scrollLeft = textarea.scrollLeft
      }
    },
    async saveEdit() {
      if (this.picdisplay.length > 0) {
        const picPaths = [];
        for (const item of this.picdisplay) {
          if (item.file) {
            const formData = new FormData();
            formData.append('del', '');
            formData.append('file', item.file);
            const res = await req.upload('fupload', formData, {});
            picPaths.push(res.data);
          } else {
            const pathStart = item.url.indexOf('/f/');
            picPaths.push(item.url.substring(pathStart + 1));
          }
        }
        this.editpart.pic = picPaths.join('++@@++');
      } else {
        this.editpart.pic = '';
      }
      if (this.edittype === 'new') {
        this.editpart.type = this.parttype
        this.editpart.pct = 0
        this.editpart.bookid = this.bookid
        req.post('booknewpart', this.editpart).then(res => {
          if (res === 'mis') {
            this.$bus.emit('popuperror', '创建失败')
          } else {
            const relationdata = {
              id: this.bookid,
              partid: this.bookid,
              type: this.parts[this.bookid][this.partid].type,
              relation: {
                id: res.data.relationid,
                p1: this.bookid,
                p2: res.data.id,
                relationid: this.parttype, // 1 属于（角色）， 2 相关（剧情）
                direction: 1
              }
            }
            this.$store.commit('addParts', {bookid: this.bookid, partid: res.data.id, part: res.data})
            this.$store.commit('addRelation', relationdata)
            this.picdisplay = []
            if (this.editpart.pic) {
              this.picdisplay = this.editpart.pic.split('++@@++').filter(p => p.trim()).map(p => ({ url: this.$store.state.api + p, file: null }))
            }
            this.picindex = 0
            this.show = false
            this.$bus.emit('popupcheck')
          }
        })
      } else if (this.edittype === 'edit') {
        req.post('bookupdatepart', this.editpart).then(res => {
          if (res.data === 'done') {
            this.parts[this.bookid][this.partid] = this.editpart
            this.picdisplay = []
            if (this.editpart.pic) {
              this.picdisplay = this.editpart.pic.split('++@@++').filter(p => p.trim()).map(p => ({ url: this.$store.state.api + p, file: null }))
            }
            this.picindex = 0
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '修改失败')
          }
        })
      }
    },
    toggleShow(bookid, partid, type, parttype) {
      console.log('toggle show')
      this.show = !this.show
      this.bookid = bookid
      this.partid = partid
      this.parttype = parttype
      this.edittype = type
      if (this.edittype === 'edit') {
        this.editpart = this.parts[this.bookid][this.partid]
        if (this.editpart.pic) {
          this.picdisplay = this.editpart.pic.split('++@@++').filter(p => p.trim()).map(p => ({ url: this.$store.state.api + p, file: null }))
        } else {
          this.picdisplay = []
        }
      } else {
        this.editpart = {
          pic: '',
          name: '',
          age: 0,
          desc: ''
        }
        this.picdisplay = []
        this.picindex = 0
        this.zoomPic = false
      }
    },
    fontsize(num) {
      this.contentFontSize += num
      // 字号变化可能使滚动条出现/消失，需要重新同步镜像层宽度
      this.$nextTick(() => {
        this.syncHighlightScroll()
      })
    },
    nextpic(num) {
      if (this.picdisplay.length === 0) return
      this.picindex += num
      if (this.picindex < 0) this.picindex = this.picdisplay.length - 1
      if (this.picindex >= this.picdisplay.length) this.picindex = 0
    },
    zoompic() {
      this.zoomPic = !this.zoomPic
    },
    async delpic() {
      if (this.picdisplay.length === 0) return
      const item = this.picdisplay[this.picindex]
      if (!item) return
      const isServerImage = !item.file
      if (isServerImage) {
        const pathStart = item.url.indexOf('/f/')
        if (pathStart === -1) {
          this.$bus.emit('popuperror', '路径异常')
          return
        }
        const serverPath = item.url.substring(pathStart + 1)
        try {
          const res = await req.post('fdel', { del: serverPath })
          if (res.data !== 'done') {
            this.$bus.emit('popuperror', '删除失败')
            return
          }
        } catch (e) {
          this.$bus.emit('popuperror', '删除失败')
          return
        }
      }
      this.picdisplay.splice(this.picindex, 1)
      if (this.picindex >= this.picdisplay.length) {
        this.picindex = Math.max(0, this.picdisplay.length - 1)
      }
      if (this.picdisplay.length === 0) {
        this.zoomPic = false
      }
      if (this.edittype === 'edit' && isServerImage) {
        const remainingServerPaths = this.picdisplay
          .filter(p => !p.file)
          .map(p => p.url.substring(p.url.indexOf('/f/') + 1))
        const newPicStr = remainingServerPaths.join('++@@++')
        try {
          const res = await req.post('bookupdatepart', { ...this.editpart, pic: newPicStr })
          if (res.data === 'done') {
            this.editpart.pic = newPicStr
            this.$bus.emit('popupcheck')
          } else {
            this.$bus.emit('popuperror', '修改失败')
          }
        } catch (e) {
          this.$bus.emit('popuperror', '修改失败')
        }
      } else {
        this.$bus.emit('popupcheck')
      }
    }
  },
  watch: {
    'editpart.desc': function() {
      if (this.isSearch && this.searchText) {
        this.doSearch()
      }
    },
    isSearch(val) {
      if (!val) return
      // textarea 在 v-if 的 show 容器内，搜索打开时才存在；同时用 ResizeObserver 兜住窗口/面板尺寸变化导致的滚动条增减
      this.$nextTick(() => {
        const textarea = this.$refs.descTextarea
        if (!textarea) return
        if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
          this.resizeObserver = new ResizeObserver(() => {
            this.syncHighlightScroll()
          })
        }
        if (this.resizeObserver) {
          this.resizeObserver.disconnect()
          this.resizeObserver.observe(textarea)
        }
        this.syncHighlightScroll()
      })
    }
  },
  computed: {
    ...mapState({
      relationtypelist: state => state.relationtypelist,
      parts: state => state.parts
    }),
    highlightedContent() {
      if (!this.isSearch || this.matchCount === 0) return ''
      const text = this.editpart.desc || ''
      const query = this.searchText
      if (!query) return ''
      const escapeHtml = (str) => {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }
      let result = ''
      let lastPos = 0
      for (let i = 0; i < this.matchPositions.length; i++) {
        const pos = this.matchPositions[i]
        const end = pos + query.length
        result += escapeHtml(text.substring(lastPos, pos))
        if (i === this.currentMatch) {
          result += '<span class="hl-current">' + escapeHtml(text.substring(pos, end)) + '</span>'
        } else {
          result += '<span class="hl-match">' + escapeHtml(text.substring(pos, end)) + '</span>'
        }
        lastPos = end
      }
      result += escapeHtml(text.substring(lastPos))
      return result
    }
  }
}
</script>
<style lang="stylus" scoped>
.partedit
  position fixed
  width 100%
  height 100%
  background-color black
.part-edit
  width 100%
  height 100%
  display flex
  flex-direction column
  padding 10px
  box-sizing border-box
.desc
  flex: 1
  display flex
  flex-direction column
  min-height 0
  position relative
  .highlight-layer
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    overflow hidden
    pointer-events none
    z-index 0
    margin 0
    padding 2px
    border none
    border-bottom solid 1px red
    box-sizing border-box
    white-space pre-wrap
    word-wrap break-word
    color transparent
    font-family 'FontEn','FontRound'
    line-height normal
    // v-html 注入的 span 没有 scoped data-v 属性，必须用 :deep() 才能命中
    :deep(.hl-match)
      background-color rgba(0,122,255, 1)
      color transparent
    :deep(.hl-current)
      background-color rgba(50, 50, 255, 0.8)// rgba(255, 255, 255, 0.6)
      color transparent
  .part-input
    flex 1 !important
    width 100% !important
    resize none !important
    box-sizing border-box !important
    position relative
    z-index 1
    &.searching
      background-color transparent
      caret-color #39ff14
      // 当前命中用高亮层红色标识，屏蔽原生选区颜色避免叠色
      &::selection
        background-color transparent
.noborder
  border none !important
  box-shadow none !important
  outline none !important
.zoompic
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  display flex
  flex-direction column
  justify-content center
  align-items center
  background-color rgba(0, 0, 0, 0.8)
  z-index 1000
  img
    max-width 100%
    max-height 80%
    object-fit contain
  .pic-nav
    position absolute
    bottom 30px
    display flex
    align-items center
    gap 15px
    .nav-info
      font-size 14px
      padding 5px 10px
      background-color rgba(0, 0, 0, 0.5)
.searchbox
  position absolute
  top 10px
  right 10px
  display flex
  flex-direction column
  gap 5px
  background-color black
  border solid 1px red
  padding 5px 8px
  z-index 1001
  .search-row
    display flex
    align-items center
    gap 5px
  .search-input
    width 150px
    border none
    border-bottom solid 1px red
    background-color black
    color aqua
    outline none
    font-size 12px
    padding 2px 4px
  .search-count
    color #00d944
    font-size 12px
    min-width 50px
    text-align center
  .search-btn
    cursor pointer
    color red
    padding 2px 6px
    &:hover
      color white
      background-color red
    &.replace-btn
      color #ffd700
      &:hover
        color black
        background-color #ffd700
</style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
