// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import './permission.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont/iconfont.css'
import '@/assets/theme/index.css'

import Config from './util/common'
import * as filters from '@/filters'

import Qrcode from './components/Qrcode'
import has from './plugins/btnPermission.js'
import upload from './components/Upload/index.js'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Qrcode)
Vue.use(has)
Vue.use(VueClipboard)

Object.keys(Config).forEach(key => {
  Vue.prototype[key] = Config[key]
})
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.use(upload)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

