export default {
  path: '/publishingTasks',
  component: () => import('@/views/layout'),
  meta: {
    role: [30000],
    title: '发布任务'
  },
  children: [
    {
      path: 'publishing',
      component: () => import('@/views/publishingTasks/index'),
      meta: {
        title: '发布任务',
        icon: 'iconfont iconfabiao',
        role: [31000]
      }
    }
  ]
}
