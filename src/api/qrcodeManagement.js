import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

export function getQrListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrDevice/getQrListHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

export function updateQrHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrDevice/updateQrHandler',
    data: qs.stringify(data)
  })
}
