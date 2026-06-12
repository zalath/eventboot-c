<template>
  <div v-if="show" class="partedit">
    <div class="part-edit">
      <div class="part-titlebarSpace"></div>
      <div class="part-infobar">
        <div class="info part-pic">
          <img :src="picdisplay?picdisplay:defaultpic" @click.stop="$refs.file.click()"/>
          <input type="file" style="display:none;" ref="file" @change="tempPic($event)"/>
        </div>
        <div class="info part-txt">
          <div class="part-space"></div>
          <textarea class="part-input" rows="2" placeholder="NAME" v-model="editpart.name"></textarea>
          <textarea class="part-input" rows="2" placeholder="AGE" v-model="editpart.age"></textarea>
        </div>
      </div>
      <div class="part-desc">
        <textarea
          class="part-input"
          :style="'font-size:'+contentFontSize+'px'"
          rows="50"
          placeholder="DESC"
          v-model="editpart.desc"
          @keydown.tab="handleTab"
          >
        </textarea>
      </div>
      <div class="part-btns">
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
      picdisplay: '',
      pic: {},
      isPicChanged: false
    }
  },
  methods: {
    tempPic(event) {
      this.pic = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        if (e.loaded < 20 * 1024 * 1024) this.picdisplay = e.target.result
        else this.picdisplay = e
      })
      this.isPicChanged = true;
      reader.readAsDataURL(this.pic);
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
    async saveEdit() {
      if (this.isPicChanged) {
        var formData = new FormData();
        formData.append('del', this.editpart.pic);
        formData.append('file', this.$refs.file.files[0]);
        console.log(formData)
        await req.upload('fupload', formData, {}).then(res => {
          this.editpart.pic = res.data
        })
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
            this.show = false
            this.$bus.emit('popupcheck')
          }
        })
      } else if (this.edittype === 'edit') {
        req.post('bookupdatepart', this.editpart).then(res => {
          if (res.data === 'done') {
            this.parts[this.bookid][this.partid] = this.editpart
            this.show = false
            this.$emit('close')
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
        this.picdisplay = this.editpart.pic !== '' ? this.$store.state.api + this.editpart.pic : ''
        console.log('edit loaded', this.editpart)
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
  overflow-x hidden
  overflow-y scroll
.part-edit
  padding 0 5%
</style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
