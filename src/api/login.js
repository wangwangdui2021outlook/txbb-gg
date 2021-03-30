import request from '../util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 登录
export function login (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Login/loginHandler`,
    data: qs.stringify(data)
  })
}

// 修改密码
export function changePasswordHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/changePasswordHandler`,
    data: qs.stringify(data)
  })
}

// 超管机构平台列表
export function getOrganListHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Login/getOrganListHandler`,
    data: qs.stringify(data)
  })
}

// 超管登陆
export function choosePlatHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Login/choosePlatHandler`,
    data: qs.stringify(data)
  })
}

