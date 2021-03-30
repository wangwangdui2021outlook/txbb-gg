import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'


// 获取平台配置（废弃）
export function getConfigHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/SystemConfig/getConfigHandler',
    data: qs.stringify(data)
  })
}


// 设置平台配置 （废弃）
export function setConfigHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/SystemConfig/setConfigHandler',
    data: qs.stringify(data)
  })
}

// 获取平台配置
export function getPlatInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/SystemConfig/getPlatInfoHandler',
    data: qs.stringify(data)
  })
}

// 设置平台配置
export function setPlatInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/SystemConfig/setPlatInfoHandler',
    data: qs.stringify(data)
  })
}


