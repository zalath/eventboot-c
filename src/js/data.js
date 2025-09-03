import req from './req'

export default {
  initBookRelation: async function(store, bookid) {
    const res = await req.post(store.state.conf, 'bookgetrelationtype', { bookid: bookid })
    if (res !== 'mis') {
      if (res.data == null) return;
      var relations = {}
      res.data.forEach(r => {
        relations[r.id] = r
      })
      store.commit('initrelationlist', {id: bookid, relations: relations})
    }
  }
}
