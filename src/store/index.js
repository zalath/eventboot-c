import { createStore } from 'vuex'

export default createStore({
  state: {
    conf: {},
    confReady: 0,
    path: {},
    pathReady: 0,
    keypass: ''
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
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
