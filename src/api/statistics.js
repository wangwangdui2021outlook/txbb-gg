import request from '../util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 获取7或30的数据统计
export function getTrendDataHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Dashboard/getTrendDataHandler`,
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 获取今日总览数据
export function getDataHandler (data = {}) {
  return request({
    method: 'POST',
    url: `${globalDefine.api}/Dashboard/getDataHandler`,
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}
