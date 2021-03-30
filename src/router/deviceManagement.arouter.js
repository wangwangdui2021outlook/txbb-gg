export default {
  path: '/deviceManagement',
  component: () => import('@/views/layout'),
  meta: {
    role: [60000],
    title: '设备管理'
  },
  children: [
    {
      path: 'device',
      component: () => import('@/views/deviceManagement/index'),
      meta: {
        title: '设备管理',
        icon: 'iconfont iconshebei',
        role: [61000],
      },
      children: [
        {
          path: '61001',
          meta: {
            title: '查询',
            role: [61001],
          },
        },
        {
          path: '61002',
          meta: {
            title: '添加设备',
            role: [61002],
          },
        },
        {
          path: '61003',
          meta: {
            title: '编辑',
            role: [61003],
          },
        },
        {
          path: '61004',
          meta: {
            title: '一次性邀请码',
            role: [61004],
          },
        },
        {
          path: '61005',
          meta: {
            title: '生成邀请码',
            role: [61005],
          },
        },
        {
          path: '61006',
          meta: {
            title: '删除设备',
            role: [61006]
          }
        },
        {
          path: '61007',
          meta: {
            title: '转移设备',
            role: [61007]
          }
        },
        {
          path: '61008',
          meta: {
            title: '导入天线宝宝（普通版）会员',
            role: [61008],
            isIndustry: true
          }
        }
      ]
    }
  ]
}
