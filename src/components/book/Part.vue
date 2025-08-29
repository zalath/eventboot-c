<template>
  <div class="part">
    <div>{{ part.name }}</div>
    <div>
      <!-- info -->
      {{ part.age }}
      <!-- desc -->
      {{ part.desc }}
    </div>
    <div class="divider"></div>
    <div>
      <!-- relations type 1 -->
      <div v-for="(p1,i) in part1" :key="i" @click="openPart(p1)">
        {{ p1.name }}
      </div>
      <div>
        <i class="fa fa-plus" @click="toAddRelation()"></i>
      </div>
      <!-- handle open new part window -->
    </div>
    <div class="divider"></div>
    <div>
      <!-- relations type 2 -->
      <div v-for="(p2,j) in part2" :key="j">
        {{ p2.name }}
      </div>
      <!-- handle open new edit/add window -->
      <div>
        <i class="fa fa-plus"></i>
      </div>
    </div>
    <div class="divider"></div>
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
import req from '../../js/req';
export default {
  name: 'Part',
  props: {
    part: {}
  },
  data() {
    return {
      part1: [],
      part2: []
    }
  },
  created() {
    this.part1 = this.part.parts.filter(p => p.type === 1);
    this.part1 = this.part.parts.filter(p => p.type === 2);
  },
  mounted() {
  },
  methods: {
    openPart(part) {
      this.$emit('openPart', part);
    },
    toAddRelation() {
      // read all relation types
      // get all part1 of this book and list out
    },
    addRelation() {
      // p1/p2 based on choosed relation side
      const p1 = this.part.id
      const p2 = this.choosedpartid
      const relationid = this.choosedrelation.id
      req.post(this.$store.state.api + '/book/makerelation', {p1: p1, p2: p2, relationid: relationid}).then(res => {
        // add choosed part to this.part1
      })
    },
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
  background-color black
  overflow-y scroll
.divider
  height 1px
  width 90%
  background-color red
  margin auto
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
