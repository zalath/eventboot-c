<template>
  <i>
    <a class="funcbtn" @click="toedit()">
      <i class="fa fa-pencil"></i>
    </a>
    &nbsp;
    <a class="funcbtn" @click="toadd()">
      <i class="fa fa-plus"></i>
    </a>
    &nbsp;
    <i v-if="tl.todel">
      <a class="funcbtn" @click="tl.todel = false">
        <i class="fa fa-times"></i>
      </a>
      <span>?</span>
      <a class="funcbtn" @click="del()">
        <i class="fa fa-check"></i>
      </a>
    </i>
    <a v-else class="funcbtn" @click="tl.todel = true">
      <i class="fa fa-times"></i>
    </a>
  </i>
</template>
<script>
export default {
  name: 'keyfile_del',
  props: {
    l: {},
    i: Number
  },
  data: function () {
    return {
      tl: this.l,
      ti: this.i
    }
  },
  inject: ['delLine', 'openAdd', 'openEdit'],
  methods: {
    del() {
      this.delLine(this.ti)
      this.tl.todel = false
    },
    toadd() {
      this.openAdd(this.ti + 1)
    },
    toedit() {
      this.openEdit(this.ti)
    }
  }
}
</script>
