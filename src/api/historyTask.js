import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 管理端获取全部历史任务列表
export function getHistoryTaskListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getHistoryTaskListHandler',
    data: qs.stringify(data)
  })
}

// 管理端获取自己的历史任务列表
export function getSelfHistoryTaskListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getSelfHistoryTaskListHandler',
    data: qs.stringify(data)
  })
}


// 管理端获取所有的历史任务
export function getAllHistoryTaskListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getAllHistoryTaskListHandler',
    data: qs.stringify(data)
  })
}

// 管理端获取所有历史任务-下拉店铺接口
export function getSearchHistoryShopListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getSearchHistoryShopListHandler',
    data: qs.stringify(data)
  })
}
