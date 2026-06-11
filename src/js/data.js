import req from './req'

export default {
  initBookRelationType: async function (store, bookid) {
    const res = await req.post('bookgetrelationtype', { bookid: bookid })
    if (res !== 'mis') {
      if (res.data == null) return;
      var relations = {}
      res.data.forEach(r => {
        relations[r.id] = r
      })
      store.commit('initrelationtypelist', { id: bookid, relations: relations })
    }
  },
  // 清理掉指定id在本书内的所有关系
  cleanPartRelation: function (store, bookid, deleteid) {
    req.post('bookpartrelationlist', { p1: deleteid, relationid: 0, p2: deleteid }).then(
      (res) => {
        if (res !== 'mis') {
          if (res.data == null) return;
          res.data.forEach(r => {
            var p = r.p1 === deleteid ? r.p2 : r.p1
            store.commit('delRelationById', { bookid: bookid, partid: p, id: r.id })
          })
        }
      }
    )
    req.post('bookpartrelationlist', { p1: 0, relationid: 2, p2: deleteid }).then(
      (res) => {
        if (res !== 'mis') {
          if (res.data === null) return;
          res.data.forEach(r => {
            store.commit('delRelation2ById', { bookid: bookid, partid: r.p1, id: r.id })
          })
        }
      }
    )
  }
}
