import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layout/index'


Vue.use(Router)

let constRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    meta: {
      role: []
    }
  },
  {
    path: '/imageManagement',
    redirect: '/imageManagement',
    component: layout,
    meta: {
      title: '图片工具'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/systemConfig/imageManagement'),
        meta: {
          title: '图片工具',
          icon: 'iconfont iconshouye1',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      role: []
    }
  }
]

export const asyncRoutes = [
  {
    path: '/home',
    redirect: '/home',
    component: layout,
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
          role: [11000],
        },
      },
    ],
  },
  {
    path: '/dataStatistics',
    component: layout,
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
      },
    ],
  },
  {
    path: '/publishingTasks',
    component: layout,
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
          role: [31000],
        }
      },
    ],
  },
  {
    path: '/tasksManagement',
    component: layout,
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
              role: [44002],
            },
          },
        ],
      }
    ],
  },
  {
    path: '/userManagement',
    component: layout,
    meta: {
      title: '用户管理',
      role: [50000],
      icon: 'iconfont iconyuangong'
    },
    children: [
      {
        path: 'employee',
        component: () => import('@/views/userManagement/index'),
        meta: {
          title: '员工管理',
          icon: '',
          role: [51000],
        },
        children: [
          {
            path: '51001',
            meta: {
              title: '查询',
              role: [51001],
            },
          },
          {
            path: '51002',
            meta: {
              title: '添加员工',
              role: [51002],
            },
          },
          {
            path: '51003',
            meta: {
              title: '编辑',
              role: [51003],
            },
          },
          {
            path: '51004',
            meta: {
              title: '停用',
              role: [51004],
            },
          },
          {
            path: '51005',
            meta: {
              title: '重置密码',
              role: [51005],
            },
          },

        ],
      },
      {
        path: 'membership',
        name: 'membership',
        component: () => import('@/views/userManagement/membership'),
        meta: {
          title: '会员管理',
          icon: '',
          role: [52000],
        },
        children: [
          {
            path: '52001',
            meta: {
              title: '查询',
              role: [52001],
            },
          },
          // {
          //   path: '52002',
          //   meta: {
          //     title: '添加新用户',
          //     role: [52002],
          //   },
          // },
          {
            path: '52003',
            meta: {
              title: '禁止登录',
              role: [52003],
            },
          },
          {
            path: '52004',
            meta: {
              title: '拉入黑名单',
              role: [52004],
            },
          },
          {
            path: '52005',
            meta: {
              title: '编辑会员',
              role: [52005],
            },
          },
          {
            path: '52006',
            meta: {
              title: '禁止接单',
              role: [52006],
            }
          },
          {
            path: '52007',
            meta: {
              title: '恢复接单',
              role: [52007],
            }
          },
          {
            path: '52008',
            meta: {
              title: '恢复登陆',
              role: [52008],
            }
          },
          {
            path: '52009',
            meta: {
              title: '解除黑名单',
              role: [52009],
            }
          },
          {
            path: '52010',
            meta: {
              title: '解除收款信息',
              role: [52010],
            }
          }
        ],
      },
      {
        path: 'roleManage',
        component: () => import('@/views/userManagement/roleManage'),
        meta: {
          title: '权限管理',
          icon: '',
          role: [53000],
        },
        children: [
          {
            path: '53001',
            meta: {
              title: '查询',
              role: [53001],
            },
          },
          {
            path: '53002',
            meta: {
              title: '新增角色',
              role: [53002],
            },
          },
          {
            path: '53003',
            meta: {
              title: '编辑角色',
              role: [53003],
            },
          },
          {
            path: '53004',
            meta: {
              title: '删除角色',
              role: [53004],
            },
          },
        ],
      },
    ],
  },
  {
    path: '/deviceManagement',
    component: layout,
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
              role: [61006],
            },
          }
        ],
      },
    ],
  },
  {
    path: '/qrcodeManagement',
    component: layout,
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
              role: [71002],
            },
          },
        ],
      },
    ],
  },
  {
    path: '/systemConfig',
    component: layout,
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
              role: [81001],
            },
          },
        ],
      },
    ],
  },
]

const router = new Router({
  mode: 'history',
  base: '/gg/',
  routes: [...constRoutes],
})

export default router
