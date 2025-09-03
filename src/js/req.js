import axios from 'axios';
import qs from 'qs';
export default {
  get: async function(conf, url) {
    return axios.get(conf.conf.api + url);
  },
  ipget: function(url) {
    return axios.get(url)
  },
  post: async function(conf, url, data) {
    return axios.post(conf.conf.api + url, qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  upload: function(conf, url, data, uploadprogress) {
    return axios.post(conf.conf.api + url, data, {
      headers: { 'Content-Type': 'multipart/form-data'},
      onUploadProgress: uploadprogress
    });
  }
};
