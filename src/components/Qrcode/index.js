import Index from './index.vue'
// 这里是重点
const qrcode = {
  install: function (Vue) {
    Vue.component('Qrcode', Index)
  }
}

// 导出组件
export default qrcode
