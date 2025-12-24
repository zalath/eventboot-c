import { createStore } from 'vuex'

export default createStore({
  state: {
    conf: {},
    confReady: 0,
    path: {},
    pathReady: 0,
    keypass: '',

    relationtypelist: [],
    parts: [],

    isshowconffilelist: false,
    conffilename: '',

    api: ''
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

    // 初始化书的部分
    async initParts(state, param) {
      state.parts[param.id] = param.partlist
    },
    // 新创建的part增加进队列
    addParts(state, param) {
      var temp = state.parts
      temp[param.id][param.partid] = param.part
      state.parts = temp
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
    // 初始化书籍关系类型
    async initrelationtypelist(state, param) {
      state.relationtypelist[param.id] = param.relations
    },
    // 添加新的关系到指定书籍中
    addRelationType(state, param) {
      state.relationtypelist[param.id][param.relation.id] = param.relation
    },
    // 删除关系类型
    deleteRelationType(state, param) {
      delete state.relationtypelist[param.id][param.relationId]
    },
    setApi(state, val) {
      state.api = val
    },
    toggleConfFileList(state, val = '') {
      if (val === '') {
        state.isshowconffilelist = !state.isshowconffilelist
      } else {
        state.isshowconffilelist = val
      }
    },
    setConfFileName(state, val) {
      state.conffilename = val
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
