<template>
  <div class="part">
    <div>{{ part.name }}</div>
    <div>
      <!-- info -->
      <!-- desc -->
    </div>
    <div>
      <!-- relations type 1 -->
      <!-- handle open new part window -->
    </div>
    <div>
      <!-- relations type 2 -->
      <!-- handle open new edit/add window -->
    </div>

    <div>
      <!-- window add relation 1-->
    </div>

    <div>
      <!-- window edit/add relation type 2 -->
      <!-- handle save cancel -->
    </div>

    <div>
      <!-- window handle btns -->
      <!-- delete -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Part',
  props: {
    part: {}
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openPart() {},
    toAddRelation() {},
    addRelation() {},
    openEdit() {},
    saveEdit() {},
    deletePart() {}
  },
  components: {
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
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
