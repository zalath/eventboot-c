import axios from 'axios';
import qs from 'qs';
import store from '../store';

export default {
  get: async function(url) {
    const api = this.getapi()
    return axios.get(api + url);
  },
  ipget: function(url) {
    return axios.get(url)
  },
  post: async function(url, data) {
    const api = this.getapi()
    return axios.post(api + url, qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  upload: function(url, data, uploadprogress) {
    const api = this.getapi()
    return axios.post(api + url, data, {
      headers: { 'Content-Type': 'multipart/form-data'},
      onUploadProgress: uploadprogress
    });
  },
  // 检查global.gconfapi是否存在，如果不存在，则调用Vuex store中的api
  getapi: function() {
    if (global.gconfapi === undefined) {
      return store.state.api
    } else {
      return global.gconfapi
    }
  }
};
