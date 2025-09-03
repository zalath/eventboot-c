import { createStore } from 'vuex'

export default createStore({
  state: {
    conf: {},
    confReady: 0,
    path: {},
    pathReady: 0,
    keypass: '',

    relationlist: [],
    parts: []
  },
  mutations: {
    setConf(st, val) {
      st.conf = val
    },
    setConfReady(st, val) {
      st.confReady = val
    },
    setPath(st, val) {
      st.path = val
    },
    setPathReady(st, val) {
      st.pathReady = val
    },
    setKeypass(st, val) {
      st.keypass = val
    },

    // 初始化书籍关系
    async initrelationlist(state, param) {
      state.relationlist[param.id] = param.relations
    },
    // 初始化书的部分
    async initParts(state, param) {
      state.parts[param.id] = param.partlist
    },
    // 新创建的part增加进队列
    addParts(state, param) {
      state.parts[param.id][param.partid] = param.part
    },
    // 去编辑新的节点
    toEditPart(state, param) {
      state.editingpart[param.bookid] = param
    },
    // 去编辑新的关系
    toEditRelation(state, param) {
      state.editingrelation[param.bookid] = param
    },
    // 新创建的关系增加进队列
    addrelation(state, param) {
      state.parts[param.id][param.partid].relations.push(param.relation)
    },
    // 初始化某个节点的relation列表
    initPartRelation(state, param) {
      state.parts[param.id][param.partid].relations = param.relations
    },
    // 添加新的关系到指定书籍中
    addRelationType(state, param) {
      state.relationlist[param.id][param.relation.id] = param.relation
    },
    // 删除关系类型
    deleteRelationType(state, param) {
      delete state.relationlist[param.id][param.relationId]
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
