import Vue from 'vue'
import { getUserInfo } from '@/util/userAuth.js'
/**权限指令**/
const has = Vue.directive('has', {
  inserted: function (el, binding) {
    let userInfo = getUserInfo() ? JSON.parse(getUserInfo()) : ''
    // 获取页面按钮权限码
    let btnPermissionsArr = userInfo.rule || []
    // 获取是否是超级管理员
    if (userInfo.is_admin == '1') return false
    if (btnPermissionsArr.indexOf(binding.value) <= -1) {
      el.parentNode.removeChild(el)
    }
  }
})

export default has
