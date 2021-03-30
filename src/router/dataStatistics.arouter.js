export default {
  path: '/dataStatistics',
  component: () => import('@/views/layout'),
  meta: {
    role: [20000],
    title: '数据统计'
  },
  children: [
    {
      path: 'statistics',
      component: () => import('@/views/dataStatistics/index'),
      meta: {
        title: '数据统计',
        icon: 'iconfont iconshujutongji',
        role: [21000],
      },
      children: [
        {
          path: '21001',
          meta: {
            title: '数据概览',
            role: [21001]
          }
        },
        {
          path: '21002',
          meta: {
            title: '今日总览',
            role: [21002]
          }
        },
        {
          path: '21003',
          meta: {
            title: '数据统计',
            role: [21003]
          }
        }
      ]
    }
  ]
}
