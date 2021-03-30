// import Cookies from 'js-cookie'
import GLOBAL from '@/util/common'

const Token = 'gg_admin_token'
const UserInfo = 'gg_admin_userinfo'

// 设置token
export function setToken (token) {
  return GLOBAL.zyLocalStorage.set(Token, token, GLOBAL.TOKEN_OVER_TIME)
}

export function getToken () {
  return GLOBAL.zyLocalStorage.get(Token)
}

export function removeToken () {
  return localStorage.removeItem(Token)
}

// 设置用户信息
export function setUserInfo (userInfo) {
  return GLOBAL.zyLocalStorage.set(UserInfo, userInfo, GLOBAL.TOKEN_OVER_TIME)
}

export function getUserInfo () {
  return GLOBAL.zyLocalStorage.get(UserInfo)
}

export function removeUserInfo () {
  return localStorage.removeItem(UserInfo)
}
