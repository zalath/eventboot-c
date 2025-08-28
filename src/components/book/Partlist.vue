<template>
  <div>
    <div class="clipbtn" @click="openBook()" style="text-align: center;">
      {{ book.name }}
    </div>
    <div>
      <!-- edit relationType -->
    </div>
    <div v-show="isshow">
      <Part v-for="(part,i) in partlist" :key="i" :part="part"></Part>
    </div>
    <Bookrelation v-show="isshow"></Bookrelation>
  </div>
</template>

<script>
import req from '../../js/req';
import Bookrelation from './Bookrelation.vue';
import Part from './Part.vue';

export default {
  name: 'Partlist',
  props: {
    book: {}
  },
  data() {
    return {
      partlist: [],
      istoggle: false,
      isshow: true,
      relationlist: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    openBook() {
      if (!this.istoggle) {
        this.istoggle = true;
        this.openOne(this.book);
        this.getRelationList(this.book.id);
      } else {
        this.isshow = !this.isshow;
      }
    },
    openOne(part) {
      req.post(this.$store.state.conf, 'bookparts', {id: part.id}).then(res => {
        part.parts = res.data
        this.partlist.push(part)
      })
    },
    getRelationList(id) {
      req.post(this.$store.state.conf, 'bookrelations', {id: id}).then(res => {
        this.relationlist = res.data
      })
    }
  },
  components: {
    Part,
    Bookrelation

  }
}
</script>

<style lang="stylus" scoped>

</style>
<style lang="stylus" src='../../css/cyber.styl' scoped>
</style>
