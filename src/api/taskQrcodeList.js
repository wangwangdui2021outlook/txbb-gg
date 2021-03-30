import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 管理端获取任务二维码列表
export function getQrListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrOrder/getQrListHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 管理端解除任务二维码
export function removeQrTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrOrder/removeQrTaskHandler',
    data: qs.stringify(data)
  })
}

// 管理端二维码任务临时加单
export function replenishTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrOrder/replenishTaskHandler',
    data: qs.stringify(data)
  })
}
