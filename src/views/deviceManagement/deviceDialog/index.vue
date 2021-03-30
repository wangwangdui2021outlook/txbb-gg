<template>
  <div>
    <el-dialog
      title="添加新设备"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogcreate"
    >
      <el-form
        :model="addForm"
        ref="addForm"
        :rules="addRules"
        :label-width="formLabelWidth"
      >
        <el-form-item label="设备名称:" prop="device_name">
          <el-input
            v-model="addForm.device_name"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="保管人:" prop="device_user_id">
          <el-select
            v-model="addForm.device_user_id"
            filterable
            placeholder="请选择设备保管人"
          >
            <el-option
              v-for="(item, index) in taskStaffArr"
              :key="index"
              :label="item.real_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存放位置:" prop="device_location">
          <el-input
            v-model="addForm.device_location"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="设备型号:" prop="device_model">
          <el-input
            v-model="addForm.device_model"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="设备串号:" prop="device_imei">
          <el-input
            v-model="addForm.device_imei"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="memo">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="addForm.memo"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcreate = false" type="info">取 消</el-button>
        <el-button type="primary" @click="addDevice">添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑设备"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogedit"
    >
      <el-form
        :model="editForm"
        ref="editForm"
        :rules="editRules"
        :label-width="formLabelWidth"
      >
        <el-form-item label="设备编号:" :label-width="formLabelWidth">
          {{ editForm.id | encodeId }}
        </el-form-item>
        <el-form-item
          label="设备名称:"
          :label-width="formLabelWidth"
          prop="device_name"
        >
          <el-input
            v-model="editForm.device_name"
            maxlength="15"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="保管人:" prop="device_user_id">
          <el-select
            v-model="editForm.device_user_id"
            filterable
            placeholder="请选择设备保管人"
          >
            <el-option
              v-for="(item, index) in taskStaffArr"
              :key="index"
              :label="item.real_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="存放位置:"
          :label-width="formLabelWidth"
          prop="device_location"
        >
          <el-input
            v-model="editForm.device_location"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="设备型号:" :label-width="formLabelWidth">
          {{ editForm.device_model }}
        </el-form-item>
        <el-form-item label="设备串号:" :label-width="formLabelWidth">
          {{ editForm.device_imei }}
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth" prop="memo">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="editForm.memo"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogedit = false" type="info">取 消</el-button>
        <el-button type="primary" @click="updateDevice">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="配置邀请码"
      :visible.sync="dialogconfigure"
      class="configureCode"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :model="configure">
        <el-form-item label="设备名称:" :label-width="formLabelWidth">
          {{ configure.device_name }}
        </el-form-item>
        <el-form-item label="可注册的数量:" :label-width="formLabelWidth">
          <el-input
            v-model="configure.count_all"
            autocomplete="off"
            type="number"
            :min="1"
            :max="59999"
          ></el-input>
        </el-form-item>
        <el-form-item label="二维码有限期:" :label-width="formLabelWidth">
          <el-radio-group v-model="configure.qr_type">
            <el-radio :label="this.CONFIG.QR_TYPE_COUNT"
              >达到使用次数上限</el-radio
            >
            <el-radio :label="this.CONFIG.QR_TYPE_TIME">选择时间</el-radio>
            <p>
              <el-date-picker
                v-model="configure.expire_time"
                v-show="configure.qr_type == this.CONFIG.QR_TYPE_TIME"
                type="datetime"
                placeholder="选择过期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </p>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogconfigure = false">取 消</el-button>
        <el-button type="primary" @click="createQr()">确认生成</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="23%"
      title="生成成功"
      :visible.sync="innerVisible"
      append-to-body
      class="configureCode"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form :model="configure">
        <el-form-item label="设备名称:" :label-width="formLabelWidth">
          {{ configure.device_name }}
        </el-form-item>
        <el-form-item label="可注册的数量:" :label-width="formLabelWidth">
          {{ configure.count_all }}
        </el-form-item>
        <el-form-item label="二维码有限期:" :label-width="formLabelWidth">
          <p v-if="configure.qr_type == this.CONFIG.QR_TYPE_TIME">
            {{ configure.expire_time }}
          </p>
          <p v-else>
            达到使用次数上限
          </p>
        </el-form-item>
        <div id="qr-box" class="ta-c" ref="qr-box"></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <el-button v-has="70000" type="primary" @click="checkDetails"
          >查看详情</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="转移用户" :visible.sync="transferVisible" width="500px">
      <el-form :model="transferForm">
        <el-form-item label="转出设备名称:" :label-width="120">
          <div class="device-text-box">
            <p>
              {{ transferForm.device_name }} (保管人：{{
                transferForm.device_user
              }})
            </p>
            <p>人数：{{ transferForm.user_count }}</p>
          </div>
        </el-form-item>
        <el-form-item label="转入设备名称:" :label-width="120">
          <el-select
            v-model="transferForm.shift_device"
            filterable
            placeholder="请选择转入设备"
          >
            <el-option
              v-for="(item, index) in deviceList"
              :key="index"
              :label="item.device_name"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureTransfer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addDeviceHandler, updateDeviceHandler, createQrHandler, getDispatchSelectHandler, getDeviceSelectListHandler, shiftDeviceUserHandler } from '@/api/deviceManagement'
import { getQrCodeSrc } from '@/util/tool'

export default {
  name: 'deviceDialog',
  data () {
    return {
      // 添加设备表单规则
      addRules: {
        device_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        device_user_id: [
          { required: true, message: '请选择设备保管人', trigger: 'blur' }
        ],
        device_location: [
          { required: true, message: '请输入存放位置', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        device_model: [
          { required: true, message: '请输入设备型号', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        device_imei: [
          { required: true, message: '请输入设备串号', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        memo: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      // 修改设备表单规则
      editRules: {
        device_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        device_user: [
          { required: true, message: '请选择设备保管人', trigger: 'blur' },
        ],
        device_location: [
          { required: true, message: '请输入存放位置', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        memo: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      // 新增数据
      addForm: {
        device_name: '',
        device_user: '',
        device_user_id: '',
        device_location: '',
        device_model: '',
        device_imei: null,
        memo: ''
      },
      // 修改数据
      editForm: {
        device_id: null,
        device_name: '',
        device_user: '',
        device_user_id: '',
        device_location: '',
        memo: ''
      },
      // 转移设备
      transferForm: {

      },
      // 设备列表
      deviceList: [],
      dialogcreate: false,
      dialogedit: false,
      dialogconfigure: false,
      innerVisible: false,
      transferVisible: false,
      configure: {},
      // 下拉框数据缓存时间
      selSetTime: 60 * 2,
      taskStaffArr: []  // 获取员工列表
    }
  },

  mounted () {
    this.getDispatchSelect()
    this.getDeviceList()
  },

  methods: {
    // 查看详情
    checkDetails () {
      this.$router.push('/qrcodeManagement/code')
    },
    // 添加设备
    addDevice () {
      let _this = this
      _this.$refs['addForm'].validate(async (valid) => {
        if (!valid) return false
        let params = { ..._this.addForm }
        _this.taskStaffArr.map((item) => {
          if (item.id == params.device_user_id) {
            params.device_user = item.real_name
          }
        })
        let data = await addDeviceHandler(params)
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$alert(data.msg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            _this.dialogcreate = false
            _this.$emit('reloadData')
          }
        })
      })
    },
    // 提交编辑设备信息
    updateDevice () {
      let _this = this
      _this.$refs['editForm'].validate(async (valid) => {
        if (!valid) return false
        _this.taskStaffArr.map((item) => {
          if (item.id == _this.editForm.device_user_id) {
            _this.editForm.device_user = item.real_name
          }
        })
        let params = {
          device_id: _this.encodeId(_this.editForm.id),
          device_name: _this.editForm.device_name,
          device_user: _this.editForm.device_user,
          device_user_id: _this.editForm.device_user_id,
          device_location: _this.editForm.device_location,
          memo: _this.editForm.memo
        }
        let data = await updateDeviceHandler(params)
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$message.success(data.msg)
        _this.dialogedit = false
        _this.$emit('reloadData')

      })
    },
    // 点击确认生成
    async createQr () {
      let _this = this
      if (!_this.configure.count_all || !_this.configure.qr_type) return this.$message.warning('请输入完整信息！')
      if (_this.configure.count_all < 1 || _this.configure.count_all > 59999) return this.$message.warning('可注册数量 必须在（0~60000）次之间！请重新输入 可注册数量！')
      if (_this.configure.qr_type == _this.CONFIG.QR_TYPE_TIME && !_this.configure.expire_time) return this.$message.warning('请选择过期时间！')
      if (_this.configure.qr_type == _this.CONFIG.QR_TYPE_TIME) {
        let nowTime = (new Date()).getTime()
        let chooseTime = (new Date(_this.configure.expire_time)).getTime()
        if (nowTime > chooseTime) return this.$message.warning('过期时间不能早于当前时间！')
      } else {
        _this.configure.expire_time = null
      }
      let params = {
        device_id: _this.encodeId(_this.configure.id),
        device_name: _this.configure.device_name,
        qr_type: _this.configure.qr_type,
        count_all: _this.configure.count_all,
        expire_time: _this.configure.expire_time
      }
      let data = await createQrHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      let QrCodeSrc = this.register + 'device_id=' + _this.encodeId(data.result.device_id)
      this.innerVisible = true
      setTimeout(() => {
        document.getElementById('qr-box').innerHTML = ""
        getQrCodeSrc(QrCodeSrc, 'qr-box', 130, 130)
      }, 100)
    },
    // 二维码弹框点击关闭
    close () {
      this.innerVisible = false
      this.dialogconfigure = false
    },
    // 获取员工下拉列表
    async getDispatchSelect () {
      let _this = this
      if (_this.taskStaffArr.length > 0) return false
      let data = await getDispatchSelectHandler()
      if (data.code === _this.CONFIG.CODE_PAGE_END) return false
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.taskStaffArr = data.result
    },
    // 获取设备列表
    async getDeviceList () {
      if (this.deviceList.length > 0) return false
      let data = await getDeviceSelectListHandler()
      if (data.code === this.CONFIG.CODE_PAGE_END) return false
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.deviceList = data.result
    },
    // 确认转移设备
    sureTransfer () {
      let shiftData = this.deviceList[this.transferForm.shift_device]
      let html = `<div style="margin: 10px;font-size: 15px;">转出设备名称：${this.transferForm.device_name} (保管人： ${this.transferForm.device_user})  人数： ${this.transferForm.user_count}<br/><br/>` +
        `转入设备名称：${shiftData.device_name} (保管人： ${shiftData.device_user})    人数： ${shiftData.user_count} </div>`
      this.$confirm(html, '确认转移信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
      }).then(async () => {
        let params = {
          device_id: this.encodeId(this.transferForm.id),
          shift_device_id: this.encodeId(shiftData.id)
        }
        let data = await shiftDeviceUserHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.transferVisible = false
        this.$emit('reloadData')
        this.$message.success(data.msg)
      }).catch(() => { })
    },

  }
}
</script>
<style lang='scss' scoped>
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
.device-text-box {
  width: 300px;
  display: inline-block;
  p {
    font-size: 16px;
    margin: 0;
  }
}
</style>
