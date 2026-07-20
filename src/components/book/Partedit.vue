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
        <textarea
          ref="descTextarea"
          class="part-input"
          :style="'font-size:'+contentFontSize+'px;caret-witch=4px;'"
          placeholder="DESC"
          v-model="editpart.desc"
          @keydown.tab="handleTab"
          @emacs-save="handleEmacsSave"
          >
        </textarea>
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
      zoomPic: false
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
      }
    },
    fontsize(num) {
      this.contentFontSize += num
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
  computed: mapState({
    relationtypelist: state => state.relationtypelist,
    parts: state => state.parts
  })
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
  .part-input
    flex 1 !important
    width 100% !important
    resize none !important
    box-sizing border-box !important
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
</style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
