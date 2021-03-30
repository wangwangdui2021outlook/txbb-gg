export default {
  path: '/systemConfig',
  component: () => import('@/views/layout'),
  meta: {
    role: [80000],
    title: '系统配置'
  },
  children: [
    {
      path: 'system',
      component: () => import('@/views/systemConfig/index'),
      meta: {
        title: '系统配置',
        icon: 'iconfont iconxitongpeizhi',
        role: [81000],
      },
      children: [
        {
          path: '81001',
          meta: {
            title: '保存',
            role: [81001]
          }
        }
      ]
    }
  ]
}
