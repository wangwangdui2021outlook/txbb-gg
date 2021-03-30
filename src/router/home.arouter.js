export default {
  path: '/home',
  redirect: '/home',
  component: () => import('@/views/layout'),
  meta: {
    role: [10000],
    title: '首页'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/home/index'),
      meta: {
        title: '平台首页',
        icon: 'iconfont iconshouye1',
        role: [11000]
      }
    }
  ]
}
