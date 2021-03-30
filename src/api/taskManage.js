import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

// 管理端获取全部任务列表
export function getTaskListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getTaskListHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 管理端获取自己的任务列表
export function getSelfTaskListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getSelfTaskListHandler',
    data: qs.stringify({ ...data, ...{ noLoading: true } })
  })
}

// 任务返款 / 批量任务返款
export function taskRefundHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/taskRefundHandler',
    data: qs.stringify(data)
  })
}

// 修改任务本金
export function alterTaskCommissionHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/alterTaskCommissionHandler',
    data: qs.stringify(data)
  })
}

// 分配任务 / 批量分配任务
export function allotTasksHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/allotTasksHandler',
    data: qs.stringify(data)
  })
}

// 撤回分配任务 / 批量撤回分配任务
export function unAllotTasksHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/unAllotTasksHandler',
    data: qs.stringify(data)
  })
}

// 生成任务二维码
export function createQrHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/QrOrder/createQrHandler',
    data: qs.stringify(data)
  })
}

// 审核失败 / 批量审核失败
export function taskOperationHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/taskOperationHandler',
    data: qs.stringify(data)
  })
}

// 删除任务 / 批量删除任务
export function removeTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/removeTaskHandler',
    data: qs.stringify(data)
  })
}

// 获取关键词筛选列表
export function getKeywordListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getKeywordListHandler',
    data: qs.stringify(data)
  })
}

//获取分配员
export function getStaffListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getStaffListHandler',
    data: qs.stringify(data)
  })
}
// 获取筛选店铺列表
export function getShopListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getShopListHandler',
    data: qs.stringify(data)
  })
}
// 搜索店铺
export function getSearchShopListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getSearchShopListHandler',
    data: qs.stringify(data)
  })
}
// 获取微信号筛选列表
export function getWechatListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getWechatListHandler',
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

// 问题反馈
export function feedbackHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/feedbackHandler',
    data: qs.stringify(data)
  })
}

// 导出全部的任务数据表格
export function exportHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/exportHandler',
    data: qs.stringify(data)
  })
}

// 导出自己的任务数据表格
export function exportSelfHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/exportSelfHandler',
    data: qs.stringify(data)
  })
}


// 获取导出列表
export function getExportRecordListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getExportRecordListHandler',
    data: qs.stringify(data)
  })
}

// 修改返款备注
export function updateTaskPayNoteHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/updateTaskPayNoteHandler',
    data: qs.stringify(data)
  })
}

// 任务编辑
export function updateTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/updateTaskHandler',
    data: qs.stringify(data)
  })
}


// 恢复和批量恢复任务
export function recoverTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/recoverTaskHandler',
    data: qs.stringify(data)
  })
}

// 克隆任务
export function cloneTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/cloneTaskHandler',
    data: qs.stringify(data)
  })
}

// 失效任务
export function cancelTaskHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/cancelTaskHandler',
    data: qs.stringify(data)
  })
}


// 获取任务详情
export function getTaskInfoHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Task/getTaskInfoHandler',
    data: qs.stringify(data)
  })
}
