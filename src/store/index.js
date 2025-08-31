import { createStore } from 'vuex'
import req from '../js/req.js'

export default createStore({
  state: {
    conf: {},
    confReady: 0,
    path: {},
    pathReady: 0,
    keypass: '',

    bookrelationType: [],
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
    setBookRelationType(state, param) {
      if (state.bookrelationType[param.id] === undefined) {
        req.post(state.conf, 'bookgetrelationtype', { bookid: param.id }).then(
          (res) => {
            if (res !== 'mis') state.bookrelationType[param.id] = res.data
          }
        )
      }
    },
    // 添加新的关系到指定书籍中
    addRelationType(state, param) {
      state.bookrelationType[param.id].push(param.relation)
    },
    deleteRelationType(state, param) {
      // TODO 查找param.relationId对应的index，然后删除
      // 暂时用这个笨办法，后续优化
      const index = state.bookrelationType[param.id].findIndex(item => item.id === param.relationId)
      state.bookrelationType[param.id].splice(index, 1)
    },
    // 初始化书的部分
    setParts(state, param) {
      var parts = {}
      param.parts.forEach(p => {
        parts[p.id] = p
      });
      state.parts[param.id] = parts
    },
    // 新创建的part增加进队列
    addParts(state, param) {
      state.parts[param.id][param.partid] = param.part
    }

  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
