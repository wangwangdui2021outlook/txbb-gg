import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let cRouter = []
let aRouter = []

function importAll (r, list) {
  r.keys().forEach((key) => {
    list.push(r(key).default)
  })
}

importAll(require.context('.', false, /\.crouter\.js/), cRouter)
importAll(require.context('.', false, /\.arouter\.js/), aRouter)


// 按照权限码排序路由菜单
// 静态路由
export const constRouter = [...cRouter].sort((a, b) => { return a.meta.role[0] - b.meta.role[0] })
// 异步路由
export const asyncRoutes = [...aRouter].sort((a, b) => { return a.meta.role[0] - b.meta.role[0] })
// 所有路由
export const testRouter = [...aRouter, ...constRouter].sort((a, b) => { return a.meta.role[0] - b.meta.role[0] })

// 导出路由
export default new Router({
  mode: 'history',
  base: '/gg/',
  routes: [...constRouter]
})

