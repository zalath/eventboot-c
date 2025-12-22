<template>
  <div class="edit" v-if="isshow">
    <div v-if="title == 'new'" class="tc"><i class="fa fa-plus"/></div>
    <div v-if="title == 'edit'" class="tc"><i class="fa fa-pencil"/></div>
    <div>
      <p v-if="title === 'new'">title</p>
      <textarea class="input" rows="4" v-model="lin.title" />
    </div>
    <div>
      <p v-if="title === 'new'">comment</p>
      <textarea class="input" rows="9" v-model="lin.cmt" />
    </div>
    <file :lin="lin" :filefrom="'task'"/>
    <div class="btns">
      <button class="fa fa-check" v-on:click="submit()" />
      <button class="fa fa-times" v-on:click="close()" />
    </div>
  </div>
</template>
<script>
import req from '../../js/req';
import file from '../File'
export default {
  name: 'Taskedit',
  components: {
    file
  },
  data: function () {
    return {
      isshow: false,
      pid: '',
      lin: {},
      title: ''
    };
  },
  created() {
    this.$bus.off('edit');
    this.$bus.off('new');
    this.$bus.on('edit', this.edit);
    this.$bus.on('new', this.new);
  },
  methods: {
    submit() {
      this.$bus.off('editalldone')
      this.$bus.on('editalldone', this.editclose)
      if (this.title === 'edit') {
        this.doedit();
      } else if (this.title === 'new') {
        this.donew();
      }
    },
    doedit() {
      req.post('save', this.lin).then((res) => {
        if (res.data === 'done') {
          this.$bus.emit('editdone', this.lin)
        }
      });
    },
    donew() {
      this.lin.pid = this.pid;
      req.post('new', this.lin).then((res) => {
        if (res.data !== 'mis') {
          this.lin.id = res.data
          this.$bus.emit('editdone', this.lin)
        }
      });
    },
    donewAddLin() {
      req.post('el', { id: this.lin.id}).then((res) => {
        if (res.status) {
          this.$bus.emit('new' + this.pid, res.data);
        }
      });
    },
    edit(da) {
      if (this.isshow === true) this.isshow = false
      else {
        this.lin = da.lin;
        this.pid = da.lin.pid;
        this.show('edit');
      }
    },
    new(da) {
      this.pid = da.pid;
      this.lin = {};
      this.show('new');
    },
    show(title) {
      this.title = title;
      this.isshow = true;
    },
    editclose() {
      this.t('edit close')
      if (this.title === 'new') {
        this.t('is new adding lin to parent')
        this.donewAddLin()
      }
      this.close()
    },
    close() {
      this.isshow = false;
    },
    t(a, txt = '') {
      console.log('taskedit--------------------------------------------------------------------')
      if (txt !== '') console.log(txt)
      console.log(a)
    }
  }
};
</script>
<style scoped lang="stylus">
.edit
  position fixed
  top 50%
  left 50%
  transform translate(-50%,-50%)
  background-color black
  border solid 1px red
  width 50%
  text-align left
  padding 20px
  z-index 20
.btns
  float right
.input
  width 100%
  border none
  border-bottom solid 1px red
  background-color black
  color aqua
  outline none
.piclistbox
  line-height 100px
.tc
  text-align center
</style>
