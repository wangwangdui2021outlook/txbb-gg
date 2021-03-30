import axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
import { getToken, removeToken, removeUserInfo } from '@/util/userAuth'
import store from '@/store'

let loading = ''
function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function closeLoading () {
  if (loading) {
    loading.close()
  }
}

const service = axios.create({
  withCredentials: true,
  timeout: 20000
})

service.interceptors.request.use(config => {
  if (config.data.indexOf('noLoading') < 0) {
    startLoading()
  }
  config.headers['token'] = getToken()
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    closeLoading()
    if (!response) return Message({ type: 'error', message: '网路错误，请稍后再试！' })
    if (response.data.code == '1012' || response.data.code == '1002' || response.data.code == '1014') {
      MessageBox.alert(response.data.msg, '警告', {
        confirmButtonText: '确 定',
        type: 'warning',
        center: true,
        showClose: false,
        callback: () => {
          removeToken()
          removeUserInfo()
          store.commit('SET_USER_TOKEN', '')
          store.commit('SET_USER_INFO', '')
          store.commit('SET_MENU_LIST', [])
          window.location.reload()
        }
      })
    }
    return response.data
  },
  error => {
    if (error.message.includes('timeout')) {
      MessageBox.alert('网络连接时间过长，请刷新后再试', '警告', {
        confirmButtonText: '立即刷新',
        type: 'warning',
        center: true,
        showClose: false,
        callback: () => {
          window.location.reload()
        }
      })
    } else {
      MessageBox.alert(error, '警告', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true,
        showClose: false,
        callback: () => {
          // window.location.reload()
          window.location.href = '/404'
        }
      })
      return Promise.reject(error)
    }

  })

export default service
