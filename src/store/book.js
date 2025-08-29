import { createStore } from 'vuex';

export default createStore({
  state: {
    bookrelation:[],
    parts:[]
  },
  mutations: {
    // 初始化书籍关系
    setBookRelation(state, param) {
      state.bookrelation[param.id] = param.relations
    },
    // 添加新的关系到指定书籍中
    addRelation(state, param) {
      state.bookrelation[param.id].push(param.relation)
    },
    deleteRelation(state, param) {
      // TODO 查找param.relationId对应的index，然后删除
      // 暂时用这个笨办法，后续优化
      const index = state.bookrelation[param.id].findIndex(item => item.id === param.relationId)
      state.bookrelation[param.id].splice(index, 1)
    },
    // 初始化书的部分
    setParts(state, param) {
      // TODO 要把param.parts每项的id作为key存储缓存
      state.parts[param.id] = param.parts
    },
    // 新创建的part增加进队列
    addParts(state, param) {
      state.parts[param.id][param.partid] = param.part
    }

  },
  actions: {},
  modules: {}
})