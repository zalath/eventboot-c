import req from './req'

export default {
  initBookRelationType: async function(store, bookid) {
    const res = await req.post('bookgetrelationtype', { bookid: bookid })
    if (res !== 'mis') {
      if (res.data == null) return;
      var relations = {}
      res.data.forEach(r => {
        relations[r.id] = r
      })
      store.commit('initrelationtypelist', {id: bookid, relations: relations})
    }
  }
}
