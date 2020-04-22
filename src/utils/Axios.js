import axios from 'axios'
import { Toast } from 'antd-mobile'
// let baseApi = 'http://111.47.243.185:7778'
let baseApi = process.env.APP_URL
console.log(baseApi,'baseApi')

function loadingToast() {
  Toast.loading('加载中...', 0, () => {
    console.log('加载中！！！')
  })
}

export default class Axios {
  static ajax(options) {
    //let loading
    if (options.data && options.data.isShowLoading !== false) {
      /*loading = document.getElementById('ajaxLoading')
      loading.style.display = 'block'*/
      loadingToast()
    }
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: 'post',
        baseURL: baseApi,
        timeout: 8000,
        params: (options.data && options.data.params) || ''
      }, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then((response) => {
        if (options.data && options.data.isShowLoading !== false) {
          //loading.style.display = 'none'
          Toast.hide()
        }
        if (response.status == 200) {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      })
    })
  }
  static newAjax(options) {
    //let loading
    if (options.data && options.data.isShowLoading !== false) {
      /*loading = document.getElementById('ajaxLoading')
      loading.style.display = 'block'*/
      loadingToast()
    }
    return new Promise((resolve, reject) => {
      axios.post(baseApi + options.url,
        JSON.stringify({
          ACTION: [{
            TYPE: "LOAD",
            CODE: options.TYPE,
            RCODE: "ROW",
            CDN: options.CDN ? options.CDN : {}
          }]
        }), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        }).then((response) => {
        if (options.data && options.data.isShowLoading !== false) {
          //loading.style.display = 'none'
          Toast.hide()
        }
        if (response.data && response.data.result) {
          resolve(response.data.result && response.data.result.ROW)
        } else {
          reject(response.data.result && response.data)
        }
      })
    })
  }
}
