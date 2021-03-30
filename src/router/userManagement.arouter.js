export default {
  path: '/userManagement',
  component: () => import('@/views/layout'),
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
        {
          path: '51007',
          meta: {
            title: '设置异地登陆',
            role: [51007],
          }
        },
        {
          path: '51008',
          meta: {
            title: '解除异地登陆',
            role: [51008],
          }
        }
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
            role: [53004]
          }
        }
      ]
    }
  ]
}
