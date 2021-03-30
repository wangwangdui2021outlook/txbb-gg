<template>
  <div class="employee-content">
    <el-row>
      <el-button
        type="primary"
        style="margin-bottom:20px"
        @click="employeeDialog()"
        round
        v-has="51002"
        >添加员工</el-button
      >
    </el-row>

    <el-row>
      <el-form :model="searchForm" :inline="true" size="small" ref="searchForm">
        <el-form-item label="手机号码" prop="user_name">
          <el-input
            clearable
            v-model="searchForm.user_name"
            placeholder="手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="role_id">
          <el-select
            clearable
            v-model="searchForm.role_id"
            placeholder="请选择角色名称"
            @click.native="getRoleSelect"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              :label="item.role_name"
              :value="item.role_id"
              :key="item.role_id"
              v-for="item in roleLists"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" clearable placeholder="请选择">
            <el-option label="全部" :value="CONFIG.STATUS_FALSE"></el-option>
            <el-option label="正常" :value="CONFIG.STATUS_ABLE"></el-option>
            <el-option label="停用" :value="CONFIG.STATUS_DISABLE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            round
            @click="doSearch"
            v-has="51001"
            >查询</el-button
          >
          <el-button type="warning" @click="resetSearchForm('searchForm')" round
            >清空搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <el-row v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%">
        <!-- <el-table-column prop="user_name" label="员工账号"> </el-table-column> -->
        <el-table-column prop="real_name" label="姓名"> </el-table-column>
        <el-table-column prop="phone_number" label="手机号码">
        </el-table-column>
        <el-table-column prop="role_name" label="角色名称"> </el-table-column>
        <el-table-column prop="gmt_create" label="添加时间">
          <template slot-scope="scope">
            <p v-html="trimText(scope.row.gmt_create)"></p>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录">
          <template slot-scope="scope">
            <p v-html="trimText(scope.row.last_login_time)"></p>
          </template>
        </el-table-column>
        <el-table-column label="异地登陆提醒" width="110" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.other_place == CONFIG.STATUS_FALSE ? "关闭" : "开启"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="70" align="center">
          <template slot-scope="scope">
            {{ scope.row.status | matchEmployeeStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="480" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="info"
              size="small"
              v-has="51003"
              @click="employeeDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="primary"
              size="small"
              v-has="51005"
              @click="resetPassword(scope.row.id)"
              >重置密码</el-button
            >
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="danger"
              size="small"
              v-has="51004"
              @click="setStatus(scope.row.id, CONFIG.STATUS_DISABLE)"
              >停用</el-button
            >
            <el-button
              v-has="51007"
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="warning"
              size="small"
              @click="showLoginDialog(scope.row.id, scope.row.other_place)"
              >设置异地登陆</el-button
            >
            <el-button
              v-has="51008"
              v-if="
                scope.row.status == CONFIG.STATUS_ABLE &&
                  scope.row.other_place == CONFIG.STATUS_ING
              "
              type="danger"
              size="small"
              @click="removeOtherLogin(scope.row.id, scope.row.ip_location)"
              >解除异地登陆</el-button
            >
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
        {{ noDataTitle }}
      </h2>
    </div>

    <el-row class="dialog-row">
      <el-dialog
        class="dialog-form"
        :title="employeeId ? '编辑员工' : '添加员工'"
        width="540px"
        :visible.sync="dialogcreate"
      >
        <el-form
          :model="employeeForm"
          :rules="rules"
          ref="employeeForm"
          label-width="120px"
        >
          <!-- <el-form-item label="员工账号" prop="user_name">
            <el-input
              :disabled="employeeId ? true : false"
              v-model="employeeForm.user_name"
              placeholder="请输入员工账号"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="姓名" prop="real_name">
            <el-input
              :disabled="employeeId ? true : false"
              v-model="employeeForm.real_name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone_number">
            <el-input
              type="number"
              :disabled="employeeId ? true : false"
              v-model="employeeForm.phone_number"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择角色" prop="role_id">
            <el-select v-model="employeeForm.role_id" placeholder="请选择角色">
              <el-option
                :label="item.role_name"
                :value="item.role_id"
                :key="item.role_id"
                v-for="item in roleLists"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              class="form-textarea"
              type="textarea"
              v-model="employeeForm.memo"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogcreate = false">取 消</el-button>
          <el-button type="primary" @click="confirmEmployee('employeeForm')"
            >提 交</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="设置异地登陆"
        width="200"
        :visible.sync="setLoginVisible"
      >
        <div class="setlogin-content" style="text-align: center">
          <el-radio-group v-model="loginStatus">
            <el-radio :label="CONFIG.STATUS_FALSE">关闭 (默认)</el-radio>
            <el-radio :label="CONFIG.STATUS_TRUE">开启</el-radio>
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setLoginVisible = false">取 消</el-button>
          <el-button type="primary" @click="setOtherPlace">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>

import { getEmployeeListHandler, setStatusHandler, getRoleSelectHandler, addEmployeeHandler, updateEmployeeHandler, resetPasswordHandler, setOtherPlaceHandler, clearOtherPlaceHandler } from '@/api/usermanager'

export default {
  data () {
    return {
      setLoginVisible: false,
      staffId: '',
      loginStatus: 0,
      noDataTitle: '',
      searchForm: {
        user_name: '',
        role_id: '',
        status: '',
      },
      tableData: [],
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      roleLists: [],
      totalPage: 0,
      dialogcreate: false,
      employeeForm: {
        role_id: '',
        role_name: '',
        memo: '',
        phone_number: '',
        real_name: '',
      },
      employeeId: '',
      rules: {
        // user_name: [
        //   { required: true, message: '请输入员工账号', trigger: 'blur' },
        //   {
        //     pattern: /^[0-9a-zA-Z]{6,20}$/, message: '员工账号长度为6~20位，只能为数字和字母组合！', trigger: 'blur'
        //   }
        // ],
        real_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone_number: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择身份权限', trigger: 'blur' }],
      }
    }
  },
  mounted () {
    this.getEmployeeList()
  },
  methods: {
    // 清空搜索
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.doSearch()
    },
    // 查询
    doSearch () {
      this.currentPage = 1
      this.getEmployeeList()
    },
    // 新增/编辑员工
    async employeeDialog (obj) {
      this.employeeId = obj ? obj.id : ''
      Object.keys({ ...this.employeeForm }).forEach((key) => {
        this.employeeForm[key] = (obj && obj[key]) ? obj[key] : ''
      })
      await this.getRoleSelect()
      this.employeeForm.role_id = obj ? Number(obj.role_id) : ''
      this.dialogcreate = true
    },
    // 获取员工列表
    async getEmployeeList () {
      const params = { ...this.searchForm, ...{ page: this.currentPage, page_size: this.pageSize } }
      const data = await getEmployeeListHandler(params)
      if (data.code == this.CONFIG.CODE_PAGE_END) {
        this.noDataTitle = '暂无数据'
        this.tableData = []
        return false
      }
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.tableData = data.result.result
      this.totalPage = data.result.count_all
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getEmployeeList()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getEmployeeList()
    },
    // 员工停用按钮
    setStatus (userId, type) {
      this.$confirm('此操作将停用该员工账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          employee_id: this.encodeId(userId),
          status: type
        }
        const data = await setStatusHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.$message.success(data.msg)
        this.getEmployeeList()
      }).catch(() => {
      })
    },
    // 角色列表
    async getRoleSelect () {
      let data = await getRoleSelectHandler()
      if (data.code === this.CONFIG.CODE_PAGE_END) return false
      if (data.code !== this.CONFIG.CODE_SUCCESS) return false
      this.roleLists = data.result
    },
    // 提交员工
    confirmEmployee (form) {
      this.$refs[form].validate(async (valid) => {
        const params = { ...this.employeeForm }
        if (!valid) return false
        if (params.phone_number.length !== 11) return this.$message.warning('手机号码输入有误！')
        params.role_name = this.roleLists.filter((item) => item.role_id == params.role_id)[0].role_name
        let data = null
        if (this.employeeId) {
          params.employee_id = this.encodeId(this.employeeId)
          data = await updateEmployeeHandler(params)
        } else {
          data = await addEmployeeHandler(params)
        }
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        if (this.employeeId) {
          this.$message.success(data.msg)
          this.dialogcreate = false
          this.getEmployeeList()
        } else {
          this.$alert(`该员工登录密码为：${data.result.password}`, data.msg, {
            confirmButtonText: '确定',
            type: 'success',
            center: true,
            showClose: false,
            callback: action => {
              this.dialogcreate = false
              this.getEmployeeList()
            }
          })
        }
      })
    },
    // 重置密码
    async resetPassword (id) {
      this.$confirm('此操作将重置该员工的登录密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const param = { staff_id: id }
        const data = await resetPasswordHandler(param)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.$alert(`该员工重置后密码为：${data.result.new_password}`, data.msg, {
          confirmButtonText: '确定',
          type: 'success',
          center: true,
          showClose: false,
          callback: action => { }
        })
      })
    },
    // 显示设置异地登陆蒙版
    showLoginDialog (id, status) {
      this.setLoginVisible = true
      this.staffId = id
      this.loginStatus = status == this.CONFIG.STATUS_FALSE ? status : this.CONFIG.STATUS_TRUE
    },
    // 确认异地登陆设置
    async setOtherPlace () {
      let _this = this
      let params = {
        staff_id: _this.encodeId(_this.staffId),
        other_place: _this.loginStatus
      }
      let data = await setOtherPlaceHandler({ ...params })
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.$message.success(data.msg)
      _this.setLoginVisible = false
      _this.tableData.map((item) => {
        if (item.id === _this.staffId) return item.other_place = _this.loginStatus
      })
    },
    //解除异地登陆
    removeOtherLogin (id, status) {
      let _this = this
      _this.staffId = id
      let title = `该账户当前已在异地登陆--${status}，是否登录解除？`
      _this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = { staff_id: _this.encodeId(id) }
        let data = await clearOtherPlaceHandler({ ...params })
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$message.success(data.msg)
        _this.getEmployeeList()
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss">
.form-textarea {
  resize: none;
}
</style>
