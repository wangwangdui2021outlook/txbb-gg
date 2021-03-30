import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

export function createTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/createTaskHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}
export function createNewTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/createNewTaskHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

