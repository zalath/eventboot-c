import { createStore } from 'vuex'

export default createStore({
  state: {
    conf: {},
    confReady: 0,
    path: {},
    pathReady: 0,
    keypass: '',

    relationtypelist: [],
    parts: {},

    isshowconffilelist: false,
    conffilename: '',

    api: '',

    killRing: ''
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
      state.parts[param.bookid][param.partid] = param.part
    },
    delPart(state, param) {
      const newParts = { ...state.parts }
      const bookParts = { ...newParts[param.bookid] }
      delete bookParts[param.partid]
      newParts[param.bookid] = bookParts
      console.log('newParts', newParts)
      state.parts = newParts
    },
    // 新创建的关系增加进队列
    addRelation(state, param) {
      if (!state.parts[param.id][param.partid].relations) {
        state.parts[param.id][param.partid].relations = []
      }
      if (!state.parts[param.id][param.partid].relations2) {
        state.parts[param.id][param.partid].relations2 = []
      }
      if (param.type === 2) {
        state.parts[param.id][param.partid].relations.push(param.relation)
      } else {
        if (param.relation.relationid === 2) {
          state.parts[param.id][param.partid].relations2.push(param.relation)
        } else {
          state.parts[param.id][param.partid].relations.push(param.relation)
        }
      }
    },
    // 删除指定位置的关系
    delRelation(state, param) {
      state.parts[param.bookid][param.partid].relations.splice(param.ind, 1)
    },
    /* 删除指定节点下的指定关系
      @param param.bookid 书id
      @param param.partid 节点id
      @param param.id 关系id
     */
    delRelationById(state, param) {
      if (!state.parts[param.bookid][param.partid].relations) return
      var ind = state.parts[param.bookid][param.partid].relations.findIndex(item => item.id === param.id)
      if (ind === -1) return
      state.parts[param.bookid][param.partid].relations.splice(ind, 1)
    },
    delRelation2ById(state, param) {
      if (!state.parts[param.bookid][param.partid].relations2) return
      var ind = state.parts[param.bookid][param.partid].relations2.findIndex(item => item.id === param.id)
      if (ind === -1) return
      state.parts[param.bookid][param.partid].relations2.splice(ind, 1)
    },
    // 初始化某个节点的relation列表
    initPartRelation(state, param) {
      state.parts[param.id][param.partid].relations = param.relations
    },
    initPartRelation2(state, param) {
      state.parts[param.id][param.partid].relations2 = param.relations
    },
    // 初始化书籍关系类型列表
    async initrelationtypelist(state, param) {
      state.relationtypelist[param.id] = param.relations
    },
    // 删除关系类型
    deleteRelationType(state, param) {
      delete state.relationtypelist[param.id][param.relationid]
    },
    // 更新关系类型
    updateRelationType(state, param) {
      state.relationtypelist[param.id][param.relation.id] = param.relation
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
    },
    setKillRing(state, val) {
      state.killRing = val
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
