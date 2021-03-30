/* eslint-disable no-console */

import router from './router'
import store from './store'
import { MessageBox } from 'element-ui'
import { getToken, removeToken, getUserInfo, removeUserInfo } from './util/userAuth'
import { asyncRoutes } from '@/router'
import globalDefine from '@/util/common'
const whiteList = ['/login']
 function loginout (next){
   MessageBox.alert('登录超时，请重新登陆', '警告', {
    confirmButtonText: '确 定',
    type: 'warning',
    center: true,
    showClose: false,
    callback: () => {
      removeToken()
      removeUserInfo()
      localStorage.removeItem('industry_status')
      localStorage.removeItem('gg_industry_status')
      store.commit('SET_USER_TOKEN', '')
      store.commit('SET_USER_INFO', '')
      store.commit('SET_MENU_LIST', [])
      next('/login') // 否则全部重定向到登录页
    }
  })
 }
router.beforeEach((to, from, next) => {
  // 每次加载路由判断是否已经获取用户信息 若未获取用户信息则跳转到登录
  let industry_status = localStorage.getItem('gg_industry_status')
 
  if (getToken() && getUserInfo()) {
    if (to.path === '/login') {
      removeToken()
      removeUserInfo()
      store.commit('SET_USER_TOKEN', '')
      store.commit('SET_USER_INFO', '')
      store.commit('SET_MENU_LIST', [])
      next()
    } else {
      
      if(industry_status == globalDefine.CONFIG.INDUSTRY_STATUS_CLOSE){
        window.document.documentElement.setAttribute('data-theme', 'primary1')
      }else if (industry_status != globalDefine.CONFIG.INDUSTRY_STATUS_NOT && industry_status != globalDefine.CONFIG.INDUSTRY_STATUS_OPEN){
        loginout(next)
        return
      } else{
        window.document.documentElement.setAttribute('data-theme', 'primary2')
      }
      if (store.state.asyncMenuList.length === 0) {
        let userInfo = store.state.userInfo
        let rolesIds = (typeof userInfo.rule === 'string') ? JSON.parse(userInfo.rule) : userInfo.rule
        if (userInfo.is_admin == 1) {
          store.dispatch('GetRoutes', []).then(res => {
            router.addRoutes(asyncRoutes) // 异步加载路由
            if (to.path == '/') {
              next('/home/index')
            } else {
              next({ ...to, replace: true })
            }
          })
        } else if (userInfo.role_id > 1) {
          let menu = rolesIds
          store.dispatch('GetRoutes', menu).then(() => {
            router.addRoutes(store.state.asyncMenuList) // 异步加载路由
            if (to.path == '/') {
              next('/home/index')
            } else {
              next({ ...to, replace: true })
            }
          })
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      loginout(next)
      // next('/login') // 否则全部重定向到登录页
    }
  }
})
