<tempalte>
  <div class="partedit">
    <div>pic:<input v-model="editpart.pic"/></div>
      <div>name:<input v-model="editpart.name"/></div>
      <div>age:<input v-model="editpart.age"/></div>
      <div>desc:<input v-model="editpart.desc"/></div>
      <div>type:<input v-model="editpart.type"/></div>
      <div>
        <button @click="isShowEdit = !isShowEdit">取消</button>
        <button @click="saveEdit">确定</button>
      </div>
  </div>
</tempalte>
<script>
import { mapState } from 'vuex/dist/vuex.cjs.js';
export default {
  name: 'Partedit',
  props: {
    book: {}
  },
  data: function() {
    return {
      editpart: {},
      isShowEdit: false
    }
  },
  methods: {
    saveEdit() {
      if (this.editingpart.type === 'new') {
        this.$store.emit('addParts')
      }
    }
  },
  mounted() {
    this.editpart = this.parts[this.editingpart.partid]
  },
  computed: mapState({
    relationlist: state => state.relationlist[this.book.id] || [],
    parts: state => state.parts[this.book.id] || [],
    editingpart: state => state.editingpart[this.book.id] || []
  })
}
</script>
<style lang="stylus" scoped>

</style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
