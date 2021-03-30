export default {
  path: '/imageManagement',
  redirect: '/imageManagement',
  component: () => import('@/views/layout'),
  meta: {
    title: '图片工具',
    role: [1]
  },
  children: [
    {
      path: '',
      component: () => import('@/views/systemConfig/imageManagement'),
      meta: {
        title: '图片工具',
        icon: 'iconfont iconshouye1'
      }
    }
  ]
}
