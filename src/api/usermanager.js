import request from '../util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 获取会员列表
export function getUserListHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/UserManager/getUserListHandler`,
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 修改会员状态（拉黑/彻底拉黑）
export function setUserStatusHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/UserManager/setUserStatusHandler`,
    data: qs.stringify(data)
  })
}


// 获取员工列表
export function getEmployeeListHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/getEmployeeListHandler`,
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 新增员工
export function addEmployeeHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/addEmployeeHandler`,
    data: qs.stringify(data)
  })
}

// 编辑员工
export function updateEmployeeHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/updateEmployeeHandler`,
    data: qs.stringify(data)
  })
}

// 修改员工状态
export function setStatusHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/setStatusHandler`,
    data: qs.stringify(data)
  })
}

// 获取角色列表
export function getRoleSelectHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/getRoleSelectHandler`,
    data: qs.stringify(data)
  })
}

// 重置密码
export function resetPasswordHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/resetPasswordHandler`,
    data: qs.stringify(data)
  })
}

// 编辑用户
export function updateOneUserInfoHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/UserManager/updateOneUserInfoHandler`,
    data: qs.stringify(data)
  })
}
// 解除收款信息
export function unbindUserRefundInfoHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/UserManager/unbindUserRefundInfoHandler`,
    data: qs.stringify(data)
  })
}

// 解除异地登录
export function clearOtherPlaceHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/clearOtherPlaceHandler`,
    data: qs.stringify(data)
  })
}

// 设置异地登录的状态
export function setOtherPlaceHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Employee/setOtherPlaceHandler`,
    data: qs.stringify(data)
  })
}
