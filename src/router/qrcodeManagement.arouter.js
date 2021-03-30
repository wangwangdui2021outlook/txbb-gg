export default {
  path: '/qrcodeManagement',
  component: () => import('@/views/layout'),
  meta: {
    role: [70000],
    title: '注册管理'
  },
  children: [
    {
      path: 'code',
      component: () => import('@/views/qrcodeManagement/index'),
      meta: {
        title: '注册管理',
        icon: 'iconfont iconerweima',
        role: [71000],
      },
      children: [
        {
          path: '71001',
          meta: {
            title: '查询',
            role: [71001],
          },
        },
        {
          path: '71002',
          meta: {
            title: '立即失效',
            role: [71002]
          }
        }
      ]
    }
  ]
}
