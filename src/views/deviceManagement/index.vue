<template>
  <div class="devices-content">
    <el-row>
      <el-col :span="12">
        <el-button
          type="primary"
          @click="$refs.deviceDialog.dialogcreate = true"
          round
          v-has="61002"
          >添加新的设备</el-button
        >
      </el-col>
      <el-col :span="12" class="ta-r">
        <p>
          <span>会员总数:{{ personCount.membership_sum }}</span>
          <span>男:{{ personCount.man }}</span>
          <span>女:{{ personCount.woman }}</span>
        </p>
      </el-col>
    </el-row>

    <el-row>
      <el-form :inline="true" size="small" :model="searchForm" ref="searchForm">
        <span v-for="(value, key, index) in searchForm" :key="index">
          <el-form-item :label="value.name" :prop="key">
            <el-input
              :type="value.type"
              clearable
              v-model="value.value"
              :placeholder="`请输入${value.name}`"
            ></el-input>
          </el-form-item>
        </span>
        <el-form-item class="anniu">
          <el-button
            type="primary"
            icon="el-icon-search"
            round
            @click="search"
            v-has="61001"
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
        <el-table-column prop="device_id" label="设备编号" width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.id | encodeId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="device_name" label="设备名称"> </el-table-column>
        <el-table-column prop="device_user" label="保管人"> </el-table-column>
        <el-table-column prop="device_location" label="存放位置">
        </el-table-column>
        <el-table-column prop="device_model" label="设备型号">
        </el-table-column>
        <el-table-column prop="device_imei" label="设备串号"> </el-table-column>
        <el-table-column prop="user_count" label="会员人数">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.user_count }}人</span>
              <el-button
                v-if="!tableData[scope.$index].sexNum"
                type="text"
                @click="
                  getDeviceSexInfo(
                    {
                      index: scope.$index,
                      device_id: encodeId(scope.row.id)
                    },
                    scope.$index,
                    scope.row
                  )
                "
                >查看明细</el-button
              >
              <span v-else>
                男：{{ scope.row.sexNum.mam }} / 女：{{
                  scope.row.sexNum.woman
                }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="430" align="center">
          <template slot-scope="scope">
            <el-button
              v-has="61003"
              type="info"
              size="small"
              @click="editD(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-has="61005"
              @click="createQrD(scope.row)"
              type="primary"
              size="small"
              >生成邀请码</el-button
            >
            <el-button
              v-has="61004"
              type="success"
              size="small"
              @click="createQrOnce(scope.row)"
              >一次性邀请码</el-button
            >
            <el-button
              v-has="52000"
              type="warning"
              size="small"
              @click="
                $router.push({
                  name: 'membership',
                  params: {
                    device_name: scope.row.device_name
                  }
                })
              "
              >查看会员详情</el-button
            >
            <br />
            <br />
            <span v-show="scope.row.user_count == 0">
              <el-button
                v-has="61006"
                type="danger"
                size="small"
                @click="deleteDevice(scope.row)"
                >删除设备</el-button
              >
            </span>
            <span
              v-show="
                scope.row.user_count !== 0 &&
                  userInfoObj.is_super == CONFIG.ROLE_ADMIN
              "
            >
              <el-button
                v-has="61007"
                type="info"
                size="small"
                @click="transferDevice(scope.row)"
                >转移设备</el-button>
            </span>
            <span v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE">
              <el-button
              v-has="61008"
              @click="showImport(scope.row)"
              type="primary"
              size="small"
              >导入天线宝宝(普通版)会员</el-button>
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
      <h2 class="ta-c">
        {{ noDataTitle }}
      </h2>
    </div>
    <el-row>
      <device-dialog
        ref="deviceDialog"
        @reloadData="delayUpdate"
      ></device-dialog>
    </el-row>
    <el-row>
      <import-dialog 
      ref="importDialog"
      @reloadData="delayUpdate"
      ></import-dialog>
    </el-row>
  </div>
</template>

<script>
import { getDeviceListHandler, getDeviceSexInfoHandler, delDeviceHandler } from '@/api/deviceManagement'
import { encodeId } from '@/filters'
import DeviceDialog from './deviceDialog'
import ImportDialog from './importDialog'
export default {
  components: { DeviceDialog, ImportDialog },
  data () {
    return {
      userInfoObj: this.$store.state.userInfo,
      noDataTitle: '',
      totalPage: 0,
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      // 表格数据
      tableData: [],
      // 搜索数据
      searchForm: {
        device_id: {
          name: '设备编号',
          type: 'number',
          value: ''
        },
        device_name: {
          name: '设备名称',
          type: 'text',
          value: ''
        },
        device_user: {
          name: '保管人',
          type: 'text',
          value: ''
        },
        device_location: {
          name: '存放位置',
          type: 'text',
          value: ''
        },
        device_model: {
          name: '设备型号',
          type: 'text',
          value: ''
        },
        device_imei: {
          name: '设备串号',
          type: 'text',
          value: ''
        }
      },
      personCount: {
        membership_sum: 0,
        man: 0,
        woman: 0,
      },
      industry_status: localStorage.getItem('gg_industry_status')
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      await this.getMembershipCount()
      await this.getDeviceList()
    },
    // 清空搜索
    resetSearchForm (formName) {
      Object.keys({ ...this.searchForm }).forEach((key) => { this.searchForm[key].value = '' })
      this.search()
    },
    // 点击查询
    search () {
      let _this = this
      _this.currentPage = 1
      _this.pageSize = _this.PAGE_SIZE
      _this.getDeviceList()
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getDeviceList()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getDeviceList()
    },
    // 点击编辑按钮
    editD (row) {
      let _this = this
      _this.$refs.deviceDialog.dialogedit = true
      _this.$refs.deviceDialog.editForm = {}
      _this.$refs.deviceDialog.editForm = { ...row }
    },
    // 点击生成二维码
    createQrD (row) {
      this.$refs.deviceDialog.dialogconfigure = true
      this.$refs.deviceDialog.configure = {}
      this.$refs.deviceDialog.configure = { ...row }
    },
    // 得到设备列表
    async getDeviceList () {
      let _this = this
      let params = {}
      _this.tableData = []
      Object.keys({ ..._this.searchForm }).forEach((key) => { params[key] = _this.searchForm[key].value })
      params = { ...params, ...{ page: _this.currentPage, page_size: _this.pageSize } }
      let data = await getDeviceListHandler(params)
      if (data.code == _this.CONFIG.CODE_PAGE_END) return _this.noDataTitle = '暂无数据'
      if (data.code !== this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.tableData = data.result.result
      _this.totalPage = data.result.count_all
    },
    // 生成一次二维码
    createQrOnce (row) {
      this.$refs.deviceDialog.configure = {}
      this.$refs.deviceDialog.configure = { ...row }
      this.$refs.deviceDialog.configure.count_all = 1
      this.$refs.deviceDialog.configure.qr_type = this.CONFIG.QR_TYPE_COUNT
      this.$refs.deviceDialog.createQr()
    },
    // 删除设备
    deleteDevice (row) {
      if (row.user_count > 0) return this.$message.warning('该设备关联会员人数大于0，不可被删除')
      this.$confirm(`是否确认删除设备 ${row.device_name} (保管人${row.device_user})`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = { device_id: this.encodeId(row.id) }
        this.delDeviceHandler(params)
      }).catch(() => { })
    },
    // 转移设备
    transferDevice (row) {
      this.$refs.deviceDialog.transferVisible = true
      this.$refs.deviceDialog.transferForm = row
    },
    // 获取总会员数
    async getMembershipCount () {
      const data = await getDeviceSexInfoHandler({ device_id: '' })
      if (data.code !== this.CONFIG.CODE_SUCCESS) return false
      this.personCount.membership_sum = Number(data.result.mam) + Number(data.result.woman)
      this.personCount.man = data.result.mam
      this.personCount.woman = data.result.woman
    },
    // 查看男女
    async getDeviceSexInfo (params, index, row) {
      let data = await getDeviceSexInfoHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      row.sexNum = data.result
      this.$set(this.tableData, index, row)
    },
    // 删除设备
    async delDeviceHandler (params) {
      let data = await delDeviceHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      // this.getDeviceList()
      this.delayUpdate()
      this.$message.success(data.msg)
    },
    // 数据修改延迟三秒重新更新接口
    delayUpdate () {
      let loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.getDeviceList()
      }, this.DELAY_TIME)
    },
    showImport (row) {
      this.$refs.importDialog.device_id = row.id
      this.$refs.importDialog.choiseType = true
    }
  }
}
</script>

<style lang="scss" scope>
.devices-content {
  p {
    margin: 20px 0;
    font-weight: 900;
    font-size: 24px;
  }
}
#qr-box {
  img {
    margin: 0 auto;
  }
}
</style>
