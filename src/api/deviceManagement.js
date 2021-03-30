import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 获取设备列表
export function getDeviceListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/getDeviceListHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 添加新设备
export function addDeviceHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/addDeviceHandler',
    data: qs.stringify(data)
  })
}

// 编辑设备
export function updateDeviceHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/updateDeviceHandler',
    data: qs.stringify(data)
  })
}

// 生产邀请码
export function createQrHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrDevice/createQrHandler',
    data: qs.stringify(data)
  })
}

// 会员人员男女详情
export function getDeviceSexInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/getDeviceSexInfoHandler ',
    data: qs.stringify(data)
  })
}

// 获取派单员下拉列表
export function getDispatchSelectHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Employee/getDispatchSelectHandler',
    data: qs.stringify(data)
  })
}

// 删除设备
export function delDeviceHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/delDeviceHandler',
    data: qs.stringify(data)
  })
}

// 获取设备下拉列表
export function getDeviceSelectListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/getDeviceSelectListHandler',
    data: qs.stringify(data)
  })
}


// 转移设备用户
export function shiftDeviceUserHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/shiftDeviceUserHandler',
    data: qs.stringify(data)
  })
}


// 获取设备下拉列表 所有的 不含分页
export function getSelectListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/getSelectListHandler',
    data: qs.stringify(data)
  })
}


// 获取设备下拉列表 自己的
export function getMySelectListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/getMySelectListHandler',
    data: qs.stringify(data)
  })
}

// 获取同机构下普通平台的设备下拉列表
export function getOtherDeviceListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/getOtherDeviceListHandler',
    data: qs.stringify(data)
  })
}

// 通过条件查找用户信息（导入老用户）
export function getSearchUserListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/UserManager/getSearchUserListHandler',
    data: qs.stringify(data)
  })
}

// 通过设备id获取会员
export function getDeviceUserListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/UserManager/getDeviceUserListHandler',
    data: qs.stringify(data)
  })
}
// 导入用户到新设备
export function exportUserHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/DeviceManager/exportUserHandler',
    data: qs.stringify(data)
  })
}