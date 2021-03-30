<template>
  <div class="membership-content">
    <el-row>
      <el-form :model="searchForm" :inline="true" size="small" ref="searchForm">
        <span v-for="(value, key, index) in searchForm" :key="index">
          <el-form-item
            v-if="value.type !== CONFIG.NO_FOR"
            :label="value.name"
            :prop="key"
          >
            <el-input
              :type="value.type"
              clearable
              v-model="value.value"
              :placeholder="`请输入${value.name}`"
            ></el-input>
          </el-form-item>
        </span>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="searchForm.sex.value"
            clearable
            placeholder="请选择"
          >
            <el-option label="全部" :value="CONFIG.STATUS_FALSE"></el-option>
            <el-option label="男" :value="CONFIG.SEX_MAN"></el-option>
            <el-option label="女" :value="CONFIG.SEX_WOMAN"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="rangeDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            autocomplete="off"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="searchForm.status.value"
            clearable
            placeholder="请选择"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" :value="CONFIG.STATUS_ABLE"></el-option>
            <el-option
              label="禁止接单"
              :value="CONFIG.STATUS_TASK_DISABLE"
            ></el-option>
            <el-option
              label="禁止登录"
              :value="CONFIG.STATUS_DISABLE"
            ></el-option>
            <el-option
              label="黑名单"
              :value="CONFIG.STATUS_HARD_DISABLE"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            round
            v-has="52001"
            @click="doSearch"
            >查询</el-button
          >
          <el-button type="warning" @click="resetSearchForm('searchForm')" round
            >清空搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <el-row v-if="tableData.length > 0" style="width: 100%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" fixed width="120" label="会员ID">
          <template slot-scope="scope">
            {{ scope.row.id | encodeId }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          width="115"
          prop="phone_number"
          label="会员名(手机号)"
        >
        </el-table-column>
        <el-table-column prop="wechat_num" label="微信号"> </el-table-column>
        <el-table-column prop="tb_nick" min-width="100" label="淘宝号昵称">
        </el-table-column>
        <el-table-column prop="true_name" label="真实姓名">
          <template slot-scope="scope">
            <p>
              {{ scope.row.true_name ? scope.row.true_name : "-" }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="bank_card_num" label="银行卡号">
          <template slot-scope="scope">
            <p>
              {{ scope.row.bank_card_num ? scope.row.bank_card_num : "-" }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="bank_name" label="银行信息">
          <template slot-scope="scope">
            <p>
              {{ scope.row.refund_status ? scope.row.bank_name : "-" }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="collection_qr" label="微信收款码" width="120">
          <template slot-scope="scope">
            <img
              v-if="scope.row.collection_qr"
              v-lazy="getImgUrl(scope.row)"
              style="width:100px;height:100px"
              @click="
                previewImage(
                  scope.row.cdn_url + scope.row.collection_qr,
                  $event
                )
              "
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="device_name" label="设备信息"> </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex | matchSexStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="gmt_create" width="110" label="注册时间">
          <template slot-scope="scope">
            <p v-html="trimText(scope.row.gmt_create)"></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="last_login_time"
          width="110"
          label="最后一次登录"
        >
          <template slot-scope="scope">
            <p v-html="trimText(scope.row.last_login_time)"></p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="history_task_num" width="90" label="已完成单量">
        </el-table-column> -->
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | matchUserStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注">
          <template slot-scope="scope">
            <div v-if="scope.row.memo">
              <el-popover
                v-if="scope.row.memo.length > 10"
                placement="left-start"
                width="200"
                trigger="hover"
                :content="scope.row.memo"
              >
                <p slot="reference">
                  {{ scope.row.memo.substring(0, 10) + "..." }}
                </p>
              </el-popover>
              <p v-else>{{ scope.row.memo }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="130" align="center">
          <template slot-scope="scope">
            <span v-has="52006">
              <el-button
                type="primary"
                size="small"
                class="handle-btn"
                round
                v-if="scope.row.status == CONFIG.STATUS_ABLE"
                @click="
                  setUserStatus(
                    scope.row.id,
                    CONFIG.STATUS_TASK_DISABLE,
                    '是否禁止该会员接单操作',
                    scope.$index
                  )
                "
                >禁止接单</el-button
              >
            </span>
            <span v-has="52003">
              <el-button
                type="warning"
                size="small"
                round
                class="handle-btn"
                v-if="
                  scope.row.status == CONFIG.STATUS_ABLE ||
                    scope.row.status == CONFIG.STATUS_TASK_DISABLE
                "
                @click="
                  setUserStatus(
                    scope.row.id,
                    CONFIG.STATUS_DISABLE,
                    '是否禁止该会员登录操作',
                    scope.$index
                  )
                "
                >禁止登录</el-button
              >
            </span>

            <span v-has="52004">
              <el-button
                type="danger"
                size="small"
                round
                class="handle-btn"
                v-if="
                  scope.row.status == CONFIG.STATUS_DISABLE ||
                    scope.row.status == CONFIG.STATUS_ABLE ||
                    scope.row.status == CONFIG.STATUS_TASK_DISABLE
                "
                @click="
                  setUserStatus(
                    scope.row.id,
                    CONFIG.STATUS_HARD_DISABLE,
                    '是否拉入该会员黑名单操作',
                    scope.$index
                  )
                "
                >拉入黑名单</el-button
              >
            </span>

            <span v-has="52005">
              <el-button
                type="info"
                size="small"
                round
                class="handle-btn"
                v-if="scope.row.status != CONFIG.STATUS_HARD_DISABLE"
                @click="modifyUser(scope.row, scope.$index)"
                >编辑会员</el-button
              >
            </span>

            <span v-has="52007">
              <el-button
                type="primary"
                size="small"
                round
                class="handle-btn"
                v-if="scope.row.status == CONFIG.STATUS_TASK_DISABLE"
                @click="
                  setUserStatus(
                    scope.row.id,
                    CONFIG.STATUS_ABLE,
                    '是否恢复该会员接单操作',
                    scope.$index
                  )
                "
                >恢复接单</el-button
              >
            </span>

            <span v-has="52008">
              <el-button
                type="warning"
                size="small"
                round
                class="handle-btn"
                v-if="scope.row.status == CONFIG.STATUS_DISABLE"
                @click="
                  setUserStatus(
                    scope.row.id,
                    CONFIG.STATUS_ABLE,
                    '是否恢复该会员登陆操作',
                    scope.$index
                  )
                "
                >恢复登陆</el-button
              >
            </span>

            <span v-has="52009">
              <el-button
                type="danger"
                size="small"
                round
                class="handle-btn"
                v-if="scope.row.status == CONFIG.STATUS_HARD_DISABLE"
                @click="
                  setUserStatus(
                    scope.row.id,
                    CONFIG.STATUS_ABLE,
                    '是否解除该会员黑名单操作',
                    scope.$index
                  )
                "
                >解除黑名单</el-button
              >
            </span>
            <span v-has="52010">
              <el-button
                type="warning"
                size="small"
                round
                class="handle-btn"
                v-if="
                  [
                    CONFIG.STATUS_ABLE,
                    CONFIG.STATUS_TASK_DISABLE,
                    CONFIG.STATUS_DISABLE
                  ].indexOf(scope.row.status) > -1 && scope.row.refund_status
                "
                @click="unbindUserRefundInfo(scope.row.id)"
                >解除收款信息</el-button
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
          layout="total, sizes, prev, next, slot"
          :total="totalPage"
          :disabled="!hasRasult"
          ><span style="background-color:#ffffff;">第{{ currentPage }}页</span>
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

    <el-row>
      <el-dialog
        title="编辑会员"
        :visible.sync="modifyUserVisible"
        width="500px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div>
          <el-form :model="modifyUserForm">
            <el-form-item label="微信号:" :label-width="formLabelWidth">
              <el-input
                v-model.trim="modifyUserForm.wechat_num"
                label="微信号"
              ></el-input>
            </el-form-item>
            <el-form-item label="淘宝号昵称:" :label-width="formLabelWidth">
              <el-input
                v-model.trim="modifyUserForm.tb_nick"
                label="淘宝号昵称"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别:" :label-width="formLabelWidth">
              <el-radio v-model="modifyUserForm.sex" :label="CONFIG.SEX_MAN"
                >男</el-radio
              >
              <el-radio v-model="modifyUserForm.sex" :label="CONFIG.SEX_WOMAN"
                >女</el-radio
              >
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
              <el-input
                class="form-textarea"
                type="textarea"
                placeholder="请输入100字内的会员备注（选填）"
                v-model="modifyUserForm.memo"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateOneUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <preview-image ref="previewImage"></preview-image>
  </div>
</template>

<script>
import { getUserListHandler, setUserStatusHandler, updateOneUserInfoHandler, unbindUserRefundInfoHandler } from '@/api/usermanager'
import PreviewImage from '@/components/PreviewImage'
export default {
  components: { PreviewImage },
  data () {
    return {
      noDataTitle: '',
      rangeDate: [],
      searchForm: {
        user_id: {
          name: '会员ID',
          type: 'number',
          value: ''
        },
        user_name: {
          name: '会员名',
          type: 'text',
          value: ''
        },
        true_name: {
          name: '真实姓名',
          type: 'text',
          value: ''
        },
        wechat_num: {
          name: '微信号',
          type: 'text',
          value: ''
        },
        tb_nick: {
          name: '淘宝昵称',
          type: 'text',
          value: ''
        },
        device_name: {
          name: '设备名',
          type: 'text',
          value: ''
        },
        sex: {
          name: '性别',
          type: this.CONFIG.NO_FOR,
          value: ''
        },
        create_start_time: {
          name: '注册开始时间',
          type: this.CONFIG.NO_FOR,
          value: ''
        },
        create_end_time: {
          name: '注册结束时间',
          type: this.CONFIG.NO_FOR,
          value: ''
        },
        status: {
          name: '状态',
          type: this.CONFIG.NO_FOR,
          value: ''
        }
      },
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: 0,
      tableData: [],
      modifyUserVisible: false,
      modifyUserForm: {},
      selectIndex: 0,
      timmer: null,
      overtime: 0,
      hasRasult: false,
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  methods: {
    //预览图片
    previewImage (imgUrl, evemt) {
      if (!imgUrl) return
      let loadStatus = event.currentTarget.getAttribute('lazy')
      if (loadStatus == 'error') return
      this.$refs.previewImage.open(imgUrl)
    },
    init () {
      let _this = this
      _this.currentPage = 1
      // 任务二维码页面跳转
      if (_this.$route.params.device_name) {
        _this.searchForm.device_name.value = _this.$route.params.device_name
        _this.getUserList()
      } else {
        _this.searchForm.device_name.value = ''
      }
    },
    // 清空搜索
    resetSearchForm (formName) {
      this.rangeDate = []
      Object.keys({ ...this.searchForm }).forEach((key) => { this.searchForm[key].value = '' })
      this.doSearch()
    },
    // 查询
    doSearch () {
      this.currentPage = 1
      this.getUserList()
    },
    // 点击编辑
    modifyUser (row, index) {
      let _this = this
      _this.modifyUserVisible = true
      _this.modifyUserForm = { ...row }
      _this.selectIndex = index
    },
    //判断是否需要重新加载
    isReload () {
      let _this = this
      this.timmer = setTimeout(() => {
        if (!_this.hasRasult && _this.overtime < _this.OVERTIME) {
          _this.overtime++
          _this.getUserList()
        } else {
          clearTimeout(_this.timmer)
          if (_this.overtime >= _this.OVERTIME) {
            _this.$message.warning('网络错误，请稍后再试')
          }
          _this.overtime = 0
        }
      }, this.TIMEOUT)
    },
    // 获取用户列表
    async getUserList () {
      this.searchForm.create_start_time.value = (this.rangeDate) ? this.rangeDate[0] : ''
      this.searchForm.create_end_time.value = (this.rangeDate) ? this.rangeDate[1] : ''
      let params = {}
      Object.keys({ ...this.searchForm }).forEach((key) => {
        params[key] = this.searchForm[key].value
      })
      params = { ...params, ...{ page: this.currentPage, page_size: this.pageSize } }
      this.hasRasult = false
      // this.isReload()
      
      const data = await getUserListHandler(params)
      this.hasRasult = true
      if (data.code == this.CONFIG.CODE_PAGE_END) {
        this.noDataTitle = '暂无数据'
        this.tableData = []
        return false
      }
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.tableData = data.result.user_list
      this.totalPage = data.result.count_all
    },
    // 修改用户-接口
    async updateOneUserInfo () {
      let _this = this
      let params = {
        user_id: _this.encodeId(_this.modifyUserForm.id),
        wechat_num: _this.modifyUserForm.wechat_num,
        sex: _this.modifyUserForm.sex,
      }
      if (!_this.changeOV(params)) return this.$message.warning('请输入完整的用户数据!')
      params.memo = _this.modifyUserForm.memo
      if (params.memo && params.memo.length > 100) return this.$message.warning('请输入100字内的会员备注!')
      let data = await updateOneUserInfoHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      _this.modifyUserVisible = false
      // this.delayUpdate()
      this.tableData[this.selectIndex].wechat_num = _this.modifyUserForm.wechat_num
      this.tableData[this.selectIndex].tb_nick = _this.modifyUserForm.tb_nick
      this.tableData[this.selectIndex].sex = _this.modifyUserForm.sex
      if (params.memo) this.tableData[this.selectIndex].memo = params.memo
      this.$message.success(data.msg)
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getUserList()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getUserList()
    },
    // 拉黑操作
    setUserStatus (userId, type, typeTilte, index) {
      this.$confirm(typeTilte, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          user_id: this.encodeId(userId),
          status: type
        }
        const data = await setUserStatusHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.tableData[index].status = type
        this.$message.success(data.msg)
        // this.delayUpdate()
        // this.getUserList()
      }).catch(() => { })
    },
    // 解除返款信息
    unbindUserRefundInfo (userId) {
      this.$confirm('是否解除该会员的收款信息，解除后该会员需要重新认证接做任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          user_ids: JSON.stringify([this.encodeId(userId)])
        }
        const data = await unbindUserRefundInfoHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.$message.success(data.msg)
        this.delayUpdate()
        // this.getUserList()
      }).catch(() => { })
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
        this.getUserList()
      }, this.DELAY_TIME)
    },
    // 获取展示缩略图文件
    getImgUrl (item) {
      if (!item.collection_qr) return '-'
      let setTime = Date.parse(new Date('2020-04-27'))
      let dateSlots = item.collection_qr.split('/')
      let dateStr = `${dateSlots[2]}-${dateSlots[3]}-${dateSlots[4]}`
      let uploadTime = Date.parse(new Date(dateStr))
      let picUrl = (setTime < uploadTime) ? `${item.cdn_url}${this.THUMBNAIL_URL}${item.collection_qr}` : `${item.cdn_url}${item.collection_qr}`
      return picUrl
    }
  }
}
</script>

<style lang="scss" scope>
.form-textarea {
  resize: none;
}
</style>
