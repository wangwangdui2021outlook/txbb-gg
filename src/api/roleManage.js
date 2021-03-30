import request from '../util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 新增角色
export function addRoleListHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/RoleManager/addRoleListHandler`,
    data: qs.stringify(data)
  })
}

// 编辑角色
export function updateRoleListHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/RoleManager/updateRoleListHandler`,
    data: qs.stringify(data)
  })
}

// 角色列表
export function getRoleListHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/RoleManager/getRoleListHandler`,
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 角色状态修改
export function setRoleStatusHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/RoleManager/setRoleStatusHandler`,
    data: qs.stringify(data)
  })
}
