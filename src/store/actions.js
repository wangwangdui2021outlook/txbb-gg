import { login, choosePlatHandler } from '../api/login'
import { setToken, removeToken, setUserInfo, removeUserInfo } from '../util/userAuth'
import { asyncRoutes } from '../router'
import common from '../util/common'
const actions = {
  Login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        const obj = { ...res }
        if (obj.code === common.CONFIG.CODE_SUCCESS && res.result.can_login == 1) {
          const result = getJwtMsg(res.result.token)
          result.user_name = res.result.user_name
          result.real_name = res.result.real_name
          setToken(res.result.token)
          setUserInfo(JSON.stringify(result))
          commit('SET_USER_TOKEN', res.result.token)
          commit('SET_USER_INFO', result)
          commit('SET_MENU_LIST', [])
          obj.result.rule = result.rule
        }
        resolve(obj)
      })
    })
  },
  SuperLogin ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      choosePlatHandler(userInfo).then(res => {
        const obj = { ...res }
        if (obj.code === common.CONFIG.CODE_SUCCESS) {
          const result = getJwtMsg(res.result.token)
          result.user_name = res.result.user_name
          result.real_name = res.result.real_name
          setToken(res.result.token)
          setUserInfo(JSON.stringify(result))
          commit('SET_USER_TOKEN', res.result.token)
          commit('SET_USER_INFO', result)
          commit('SET_MENU_LIST', [])
          obj.result.rule = result.rule
        }
        resolve(obj)
      })
    })
  },
  async Logout ({ commit }) {
    removeToken()
    removeUserInfo()
    localStorage.removeItem('industry_status')
    localStorage.removeItem('gg_industry_status')
    commit('SET_USER_TOKEN', '')
    commit('SET_USER_INFO', '')
    commit('SET_MENU_LIST', [])
    return true
  },


  async GetRoutes ({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let routes = (roles.length > 1) ? filterRouter(asyncRoutes, roles) : [...asyncRoutes]
      commit('SET_MENU_LIST', routes)
      resolve()
    }).catch((e) => { })
  }
}

function filterRouter (routes, roles) {
  let result = []
  routes.forEach(route => {
    if (hasPermission(route, roles)) {
      let tmp = { ...route }
      if (tmp.children) {
        tmp.children = filterRouter(tmp.children, roles)
      }
      result.push(tmp)
    }
  })
  return result
}

function hasPermission (route, roles) {
  if (route.meta && route.meta.role) {
    return roles.includes(route.meta.role[0])
  }
  return true
}

function getJwtMsg (str) {
  let token = str.split('.')
  let Base64 = require('js-base64').Base64
  const jwt = decodeURIComponent(token[1])
  const res = Base64.decode(jwt)
  const userObj = JSON.parse(res)
  return userObj.data
}

export default actions
