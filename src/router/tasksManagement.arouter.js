export default {
  path: '/tasksManagement',
  component: () => import('@/views/layout'),
  meta: {
    title: '任务管理',
    icon: 'iconfont iconliebiao1',
    role: [40000],
  },
  children: [
    {
      path: 'tasks',
      name: 'tasks',
      component: () => import('@/views/tasksManagement/index'),
      meta: {
        title: '任务列表',
        icon: '',
        role: [41000],
        isload: true
      },
      children: [
        {
          path: '41001',
          meta: {
            title: '查询',
            role: [41001],
          },
        },
        {
          path: '41002',
          meta: {
            title: '分配任务',
            role: [41002],
          },
        },
        {
          path: '41003',
          meta: {
            title: '撤回分配任务',
            role: [41003],
          },
        },
        {
          path: '41004',
          meta: {
            title: '生成二维码',
            role: [41004],
          },
        },
        // {
        //   path: '41005',
        //   meta: {
        //     title: '删除任务',
        //     role: [41005],
        //   }
        // },
        {
          path: '41006',
          meta: {
            title: '确认返款',
            role: [41006],
          }
        },
        {
          path: '41007',
          meta: {
            title: '修改本金',
            role: [41007],
          }
        },
        {
          path: '41008',
          meta: {
            title: '导出数据',
            role: [41008],
          }
        },
        {
          path: '41009',
          meta: {
            title: '返款备注',
            role: [41009],
          }
        },
        {
          path: '41010',
          meta: {
            title: '审核失败',
            role: [41010],
          }
        },
        {
          path: '41011',
          meta: {
            title: '问题反馈',
            role: [41011],
          }
        },
        {
          path: '41012',
          meta: {
            title: '编辑',
            role: [41012],
          }
        },
        {
          path: '41013',
          meta: {
            title: '恢复任务',
            role: [41013],
          }
        },
        {
          path: '41014',
          meta: {
            title: '克隆任务',
            role: [41014],
          }
        },
        {
          path: '41015',
          meta: {
            title: '失效任务',
            role: [41015],
          }
        }
      ],
    },
    {
      path: 'codeList',
      component: () => import('@/views/tasksManagement/qrcodeList'),
      meta: {
        title: '二维码列表',
        icon: '',
        role: [42000],
      },
      children: [
        {
          path: '42001',
          meta: {
            title: '查询',
            role: [42001],
          },
        },
        {
          path: '42002',
          meta: {
            title: '解除任务二维码',
            role: [42002],
          },
        },
        {
          path: '42003',
          meta: {
            title: '查看二维码',
            role: [42003],
          },
        },
        // {
        //   path: '42004',
        //   meta: {
        //     title: '查看任务详情',
        //     role: [42004],
        //   },
        // },
        {
          path: '42005',
          meta: {
            title: '隐藏/显示失效二维码',
            role: [42005],
          },
        },
        {
          path: '42006',
          meta: {
            title: '加单',
            role: [42006],
          },
        },
      ],
    },
    {
      path: 'download',
      component: () => import('@/views/tasksManagement/downloadList'),
      meta: {
        isHidden: true,
        title: '导出文件列表',
        icon: '',
        role: [43000],
      },
      children: [],
    },
    {
      path: 'historyTask',
      name: 'historyTask',
      component: () => import('@/views/tasksManagement/historyTask'),
      meta: {
        title: '历史任务列表',
        icon: '',
        role: [44000],
      },
      children: [
        {
          path: '44001',
          meta: {
            title: '查询',
            role: [44001],
          },
        },
        {
          path: '44002',
          meta: {
            title: '导出数据',
            role: [44002]
          }
        },
        {
          path: '44003',
          meta: {
            title: '查看所有历史任务',
            role: [44003]
          }
        }
      ]
    }
  ]
}
