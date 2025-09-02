import { createStore } from 'vuex'
import req from '../js/req.js'

export default createStore({
  state: {
    conf: {},
    confReady: 0,
    path: {},
    pathReady: 0,
    keypass: '',

    relationlist: [],
    parts: [],
    editingpart: {},
    editingrelation: {}
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
      if (state.relationlist[param.id] === undefined) {
        await req.post(state.conf, 'bookgetrelationtype', { bookid: param.id }).then(
          (res) => {
            if (res.data == null) return;
            if (res !== 'mis') {
              var relations = {}
              res.data.forEach(r => {
                relations[r.id] = r
              })
              state.relationlist[param.id] = relations
            }
          }
        )
      }
    },
    // 初始化书的部分
    async initParts(state, param) {
      if (state.parts[param.id] === undefined) {
        await req.post(state.conf, 'bookparts', { id: param.book.id }).then(
          (res) => {
            if (res.data == null) return;
            if (res !== 'mis') {
              var parts = {}
              res.data.forEach(p => {
                parts[p.id] = p
              })
              parts[param.book.id] = param.book
              state.parts[param.id] = parts
            }
          }
        )
      }
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
      state.relationlist[param.id].push(param.relation)
    },
    deleteRelationType(state, param) {
      // TODO 查找param.relationId对应的index，然后删除
      // 暂时用这个笨办法，后续优化
      const index = state.relationlist[param.id].findIndex(item => item.id === param.relationId)
      state.relationlist[param.id].splice(index, 1)
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
