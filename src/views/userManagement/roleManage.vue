<template>
  <div class="role-container">
    <el-row>
      <el-button type="primary" round v-has="53002" @click="addRole()"
        >新增角色</el-button
      >
    </el-row>
    <br />
    <el-row v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="role_name" label="角色名称"> </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <span v-has="53003" class="table-btn">
              <el-button
                v-if="
                  scope.row.rule_ids != '[]' &&
                    scope.row.role_name != '超级管理员'
                "
                @click="updateRoleList(scope.row)"
                type="info"
                size="small"
                >编辑</el-button
              >
            </span>
            <span v-has="53004">
              <el-button
                v-if="
                  scope.row.rule_ids != '[]' &&
                    scope.row.role_name != '超级管理员'
                "
                @click="delRole(scope.row)"
                type="danger"
                size="small"
                >删除角色</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="sizeArr"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </div>
    </el-row>
    <div v-else>
      <br />
      <br />
      <h2 class="ta-c" v-cloak>
        暂无数据
      </h2>
    </div>

    <el-dialog
      :title="roleId ? '编辑角色' : '新增角色'"
      :visible.sync="dialogFormVisible"
      @close="cancelDialog"
      width="600px"
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="role_name">
              <el-input v-model="form.role_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="选择权限">
          <el-tree
            ref="tree"
            node-key="id"
            :data="treeData"
            :default-checked-keys="checkedCodes"
            :default-expand-all="false"
            :props="defaultProps"
            show-checkbox
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleListHandler, addRoleListHandler, updateRoleListHandler, setRoleStatusHandler } from '@/api/roleManage'
import { asyncRoutes } from '@/router'

export default {
  name: '',
  data () {
    return {
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: 0,
      operateFlag: 1,
      tableData: [],
      dialogFormVisible: false,
      form: {
        role_name: '',
        rule_ids: ''
      },
      treeData: [], // 权限树渲染值
      checkedCodes: [10000, 11000], // 绑定树默认选中的值
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 10, message: '长度在 10 个字符', trigger: 'blur' }
        ]
      },
      roleId: '',
      industry_status: localStorage.getItem('gg_industry_status')
    }
  },
  created () { },
  mounted () {
    let arr = []
    let treelist = []
    this.treeData = this.getRoleTree(arr, asyncRoutes, true)
    this.treeData[0].disabled = true
    this.getRoleList()
  },

  methods: {
    // 获取角色列表
    async getRoleList () {
      const params = { ...{ page: this.currentPage, page_size: this.pageSize } }
      const data = await getRoleListHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.tableData = data.result.result
      this.totalPage = data.result.count_all
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getRoleList()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getRoleList()
    },
    // 循环权限树
    getRoleTree (arr, route, k) {
      let _this = this
      let i
      k ? i = 0 : i = 1
      let j = 0
      for (i; i < route.length; i++) {
        // 判断，是否大单平台和是否大单平台独有功能
        if(route[i].meta.isIndustry && _this.industry_status == _this.CONFIG.INDUSTRY_STATUS_CLOSE) return
        arr[j] = {}
        arr[j].id = route[i].meta.role[0]
        arr[j].label = route[i].meta.title
        if (route[j].children !== undefined) {
          arr[j].children = []
          _this.getRoleTree(arr[j].children, route[i].children, true)
        }
        j++
      }
      return arr
    },
    // 新增角色
    addRole () {
      this.checkedCodes = [10000, 11000] // 添加角色是设置首页为默认必须选中
      this.dialogFormVisible = true
      this.form.role_name = ''
      this.roleId = ''
    },
    // 编辑角色
    updateRoleList (row) {
      this.checkedCodes = [10000, 11000]
      this.dialogFormVisible = true
      this.roleId = row.role_id
      this.form.role_name = row.role_name
      let rule_ids = JSON.parse(row.rule_ids)
      //默认选中的树的数据
      setTimeout(() => {
        rule_ids.forEach((value) => {
          //1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false）如果全部选中setCheckedKeys
          this.$refs.tree.setChecked(value, true, false)
        })
      }, 150)

      // this.$nextTick(() => {
      //   this.$refs.tree.setCheckedKeys(rule_ids)
      // })
    },

    // 角色提交
    confirmDialog (form) {
      const _this = this
      let params = { ..._this.form }
      /* eslint-disable */
      let permission = _this.$refs.tree.getCheckedKeys().concat(_this.$refs.tree.getHalfCheckedKeys())
      const ruleIds = [...permission, ...[11000, 51006]]
      const ruleIdsFilter = [...new Set(ruleIds)]
      params.rule_ids = ruleIdsFilter.join(',')
      _this.$refs[form].validate(async (valid) => {
        if (!valid) return false
        if (params.rule_ids === '') return _this.$message.error('请选择权限')
        if (_this.roleId) {
          params.role_id = _this.roleId
          const data = await updateRoleListHandler(params)
          if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
          _this.$message.success(data.msg)
          _this.dialogFormVisible = false
          _this.getRoleList()
          _this.$refs.tree.setCheckedKeys([10000, 11000])
        } else {
          const data = await addRoleListHandler(params)
          if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
          _this.$message.success(data.msg)
          _this.dialogFormVisible = false
          _this.getRoleList()
          _this.$refs.tree.setCheckedKeys([])
          _this.$refs.tree.setCheckedKeys([10000, 11000])
        }
      })
    },
    cancelDialog () {
      this.dialogFormVisible = false
      this.form.role_name = ''
      this.form.rule_ids = ''
      this.$refs.tree.setCheckedKeys([10000, 11000])
    },
    // 删除角色
    delRole (row) {
      let _this = this
      this.$confirm('删除后会使已有该权限的员工无法登录，是否继续删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = {
          role_id: _this.encodeId(row.role_id),
          status: _this.CONFIG.STATUS_DISABLE
        }
        const data = await setRoleStatusHandler(params)
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$message.success(data.msg)
        _this.getRoleList()
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.role-container {
  .table-btn {
    margin-right: 10px;
  }
}
</style>
