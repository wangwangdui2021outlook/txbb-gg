<template>
  <div class="inline">
    <el-button type="info" round>导出数据</el-button>

    <el-dialog
      title="导出数据"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="580px"
    >
      <div>
        <el-row>
          <el-col :span="4">
            <p>导出时间:</p>
          </el-col>
          <el-col :span="20">
            <p>
              {{ getNowTime() }}
            </p>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="4">
            <p>导出条件:</p>
          </el-col>
          <el-col :span="20">
            <div v-for="(v, k, i) in form" :key="i">
              <el-row v-if="v" class="export-details">
                <el-col :span="6">{{ k }}:</el-col>
                <el-col :span="18">{{ v }}</el-col>
              </el-row>
            </div>
            <p v-if="isDefault">
              默认
            </p>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <div class="ta-c">
          <el-radio-group v-model="exportType" @change="changeExportType">
            <el-radio :label="CONFIG.EXPORT_TYPE_ALL" border
              >选择全部字段</el-radio
            >
            <el-radio :label="CONFIG.EXPORT_TYPE_CUSTOM" border
              >自定义字段</el-radio
            >
          </el-radio-group>
          <br />
          <div v-if="exportType == CONFIG.EXPORT_TYPE_CUSTOM">
            <template class="ta-c">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >

              <el-checkbox-group
                @change="handleCheckedChange"
                v-model="checkedItems"
                class=" ta-l m-t-10"
              >
                <el-checkbox
                  class="m-t-10 min-width-130"
                  v-for="(val, index) in headerItems"
                  :label="index"
                  :key="index"
                  >{{ val }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureExport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { exportHandler, exportSelfHandler } from '@/api/taskManage'

export default {
  name: 'exportFile',
  data () {
    return {
      // 用户信息
      userInfoObj: this.$store.state.userInfo,
      // 是否有查看所有历史任务权限code
      isHistoryAll: false,
      //是否有分配任务权限code
      isCode: false,
      isDefault: true,
      // 查询数据
      dialogVisible: false,
      form: {},
      deviceArr: [],
      exportType: this.zyLocalStorage.get('exportType') ? this.zyLocalStorage.get('exportType') : this.CONFIG.EXPORT_TYPE_ALL,
      // header选中项配置
      isIndeterminate: this.zyLocalStorage.get('isIndeterminate') ? true : false,
      checkAll: this.zyLocalStorage.get('checkAll') ? true : false,
      checkedItems: this.zyLocalStorage.get('checkedItems') ? this.zyLocalStorage.get('checkedItems') : [],
      headerItems: ['任务类型','宝贝图片', '关键词', '宝贝id', '店铺名', '宝贝标题', '生效时间', '接单时间', '接单淘宝账号', '微信号', '手机号', '会员所在设备', '派单员', '订单二维码ID', '任务状态', '商品金额', '任务奖金', '确认返款时间', '淘宝订单编号', '收款账号', '收款人姓名', '收款银行', '实际返款金额', '收款方所在省', '收款方所在市县', '收款方银行支行', '收款码', '问题反馈', '返款备注','额外奖励'],
      dataParams: {}
    }
  },

  mounted () {
    this.isCode = (this.userInfoObj.rule.indexOf(this.CONFIG.ROLE_CODE) > 0) ? true : false
    this.isHistoryAll = (this.userInfoObj.rule.indexOf(this.CONFIG.ROLE_HISTORY_TASK_CODE) > 0) ? true : false
  },

  methods: {
    saveLocal () {
      this.zyLocalStorage.set('isIndeterminate', this.isIndeterminate)
      this.zyLocalStorage.set('checkAll', this.checkAll)
      this.zyLocalStorage.set('checkedItems', this.checkedItems)
    },
    // 选中项切换
    handleCheckedChange (val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.headerItems.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.headerItems.length;
      this.saveLocal()
    },
    // 全选按钮
    handleCheckAllChange (val) {
      let indexArr = []
      indexArr.length = this.headerItems.length
      for (let i = 0; i < indexArr.length; i++) {
        indexArr[i] = i
      }
      this.checkedItems = val ? indexArr : []
      this.isIndeterminate = false
      this.saveLocal()
    },
    // 导出头部方式改变
    changeExportType (type) {
      this.zyLocalStorage.set('exportType', type)
    },
    //导出数据
    exportList (params) {
      let data = null
      this.form = {
        // '任务类型': CONFIG.TASK_TYPE(params.row.task_type),
        '生效时间': params.effect_start ? params.effect_start + '~' + params.effect_end : null,
        '接单时间': params.start_time ? params.start_time + '~' + params.end_time : null,
        '返款时间': params.confirm_start ? params.confirm_start + '~' + params.confirm_end : null,
        '微信号': params.buyer_wechat,
        '商品金额': params.capital_start && params.capital_end ? params.capital_start + '~' + params.capital_end : null,
        '手机号': params.buyer_phone,
        '淘宝昵称': params.buyer_tb_nick,
        '店铺名': params.shop_name ? params.shop_name.join('/') : null,
        '所在设备': params.device_id,
        '商品ID': params.item_id,
        '二维码ID': params.qr_order_id,
        '任务ID': params.task_id,
        '关键词': params.task_method_details,
        '任务状态': params.status,
      }
      if (this.form['所在设备']) {
        let arr = this.deviceArr.filter((el) => { if (this.form['所在设备'].indexOf(el.id) > -1) return el.device_name })
        this.form['所在设备'] = arr.map(el => { return el.device_name }).join('/')
      }
      if (this.form['任务状态']) {
        let arr = []
        for (let k in this.CONFIG.ORDER_STATUS_TOMMORRO()) {
          if (this.form['任务状态'].indexOf(k + '') > -1) {
            arr.push(this.CONFIG.ORDER_STATUS_TOMMORRO(k))
          }
        }
        this.form['任务状态'] = arr.join('/')
      }
      this.isDefault = true
      for (let k in this.form) {
        if (this.form[k]) {
          this.isDefault = false
        }
      }
      this.dataParams = { ...params }
      this.dialogVisible = true
    },
    // 确认导出
    async sureExport () {
      let _this = this
      let params = { ..._this.dataParams }
      params.field_keys = (_this.exportType == _this.CONFIG.EXPORT_TYPE_ALL) ? JSON.stringify([]) : JSON.stringify(_this.checkedItems)
      let data = null
      if (_this.isCode || _this.userInfoObj.is_admin == _this.CONFIG.ROLE_ADMIN || _this.isHistoryAll) {
        data = await exportHandler(params)
      } else {
        data = await exportSelfHandler(params)
      }
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.dialogVisible = false
      _this.$message.success(data.msg)
    }
  }
}
</script>
<style lang='scss' scoped>
.export-details {
  margin-bottom: 15px;
}
</style>
