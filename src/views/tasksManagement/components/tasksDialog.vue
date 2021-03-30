<template>
  <div class="task-dialog">
    <el-row>
      <el-dialog
        title="分配任务"
        :visible.sync="assignedTasksVisible"
        width="600px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div>
          <h2>
            当前选中的任务中，有
            {{ selAssignedTasksData.length }} 个任务可以被分配。
          </h2>
          <br />
          <br />
          <el-row>
            <el-col :span="7">
              <h3 class="task-fp">
                把任务分配给：
              </h3>
            </el-col>
            <el-col :span="7">
              <el-select
                v-model="assignedTasksStaff"
                placeholder="请选择派单员"
                filterable
                clearable
                collapse-tags
                @focus="getDispatchSelect"
              >
                <el-option
                  v-for="(item, index) in taskStaffArr"
                  :key="index"
                  :label="item.real_name"
                  :value="index"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignedTasksVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureAssignedTasks">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="生成二维码"
        :visible.sync="createQrVisible"
        width="550px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div>
          <h3>
            当前选中了{{ createQrData.length }}个未生成二维码的任务
            ，请输入二维码备注信息：
          </h3>
          <br />
          <br />
          <el-row>
            <el-col :span="5">
              <h3 class="task-qr">
                接单用户：
              </h3>
            </el-col>
            <el-col :span="15">
              <el-radio v-model="task_limit" :label="CONFIG.SEX_MAN"
                >男性</el-radio
              >
              <el-radio v-model="task_limit" :label="CONFIG.SEX_WOMAN"
                >女性</el-radio
              >
              <el-radio v-model="task_limit" :label="CONFIG.STATUS_FALSE"
                >不限</el-radio
              >
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="5">
              <h3 class="task-qr">
                二维码备注：
              </h3>
            </el-col>
            <el-col :span="15">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="qr_note"
                maxlength="100"
              >
              </el-input>
            </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="createQrVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureCreateQr">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        width="540px"
        title="生成成功"
        :visible.sync="qrSuccessVisible"
        append-to-body
        class="configureCode"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <h3 class="ta-c">该二维码有 {{ createQrData.length }} 个任务。</h3>
        <br />
        <div id="qr-box" class="ta-c" ref="qr-box"></div>
        <br />
        <el-row>
          <el-col :span="6">
            <h3 class="task-qr">
              二维码备注：
            </h3>
          </el-col>
          <el-col :span="15">
            <p>{{ qr_note }}</p>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeQrDialog">关 闭</el-button>
          <el-button v-has="42000" type="primary" @click="checkDetails"
            >查看二维码列表</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="任务编辑"
        :visible.sync="editorTasksVisible"
        width="600px"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        class="task-editor task-visible"
      >
        <div>
          <el-form
            ref="taskInfo"
            :model="taskInfo"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="店铺名:" prop="shop_name">
              <el-input v-model.trim="taskInfo.shop_name"></el-input>
            </el-form-item>
            <el-form-item label="宝贝标题:" prop="item_title">
              <el-input v-model.trim="taskInfo.item_title"></el-input>
            </el-form-item>
            <el-form-item label="宝贝链接:" prop="item_url">
              <el-input v-model="taskInfo.item_url"></el-input>
            </el-form-item>
            <el-form-item label="主图链接:" prop="item_pic">
              <el-input v-model="taskInfo.item_pic"></el-input>
            </el-form-item>
            <el-form-item label="关键词:" prop="task_method_details">
              <el-input v-model="taskInfo.task_method_details"></el-input>
            </el-form-item>
            <el-form-item label="商品金额:" prop="single_task_price">
              <el-input
                type="number"
                v-model="taskInfo.single_task_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="任务奖金:" prop="task_commission">
              <el-input
                type="number"
                v-model="taskInfo.task_commission"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="实返金额:" prop="real_task_price">
              <el-input
                type="number"
                v-model="taskInfo.real_task_price"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="淘宝订单编号:">
              <el-input
                type="number"
                v-model="taskInfo.tb_order_number"
              ></el-input>
            </el-form-item>
            <div class="form-border">
              <el-form-item label="接单微信号:">
                <el-input
                  :disabled="taskInfo.buyer_wechat ? false : true"
                  v-model="taskInfo.buyer_wechat"
                ></el-input>
              </el-form-item>
              <el-form-item label="接单淘宝号:">
                <el-input
                  :disabled="taskInfo.buyer_tb_nick ? false : true"
                  v-model="taskInfo.buyer_tb_nick"
                ></el-input>
              </el-form-item>
              <el-form-item class="form-border-title">
                <p>
                  <span>*注意：</span>
                  接单的微信名和淘宝号来源于会员绑定信息，如有误请同步在会员管理中修正，请核对下确认修改的淘宝号昵称，修改之前的淘宝号昵称和修改后的淘宝号昵称都将被计入规则
                </p>
              </el-form-item>
            </div>

            <el-form-item label="额外要求:">
              <el-input type="textarea" v-model="taskInfo.task_note"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editorTasksVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateTask('taskInfo')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        :title="rebatesTitle"
        :visible.sync="rebatesVisible"
        width="550px"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :before-close="rebatesClose"
        class="task-editor"
      >
        <div>
          <div class="task-editor__title" v-if="rebatesTitle == '批量确认返款'">
            <h3>当前选中可确认返款的任务数为 {{ rebatesNum }} 个</h3>
          </div>
          <el-form
            ref="rebatesInfo"
            :rules="rebatesRule"
            :model="rebatesInfo"
            label-width="170px"
          >
            <div class="ta-c">
              <span
                class="rebatesInfo-paytype"
                v-if="rebatesTitle == '批量确认返款'"
                >选择批量付款方式:</span
              >
              <el-radio-group v-model="rebatesInfo.refund_type">
                <el-radio border :label="CONFIG.USER_REFUND_TYPE_WEIXIN"
                  >使用微信收款码付款</el-radio
                >

                <el-radio border :label="CONFIG.USER_REFUND_TYPE_BANK"
                  >使用实名银行卡付款</el-radio
                >
              </el-radio-group>
            </div>
            <div class="ta-c">
              <el-row class="w-100">
                <el-col :span="12">
                  <el-button
                    @click="setRefundType(CONFIG.USER_REFUND_TYPE_WEIXIN)"
                    type="text"
                    :disabled="
                      defaultRefundType === CONFIG.USER_REFUND_TYPE_WEIXIN
                    "
                  >
                    <span
                      v-if="
                        defaultRefundType === CONFIG.USER_REFUND_TYPE_WEIXIN
                      "
                      >已设为当前默认</span
                    >
                    <span v-else>设为默认</span>
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-button
                    @click="setRefundType(CONFIG.USER_REFUND_TYPE_BANK)"
                    type="text"
                    :disabled="
                      defaultRefundType === CONFIG.USER_REFUND_TYPE_BANK
                    "
                  >
                    <span
                      v-if="defaultRefundType === CONFIG.USER_REFUND_TYPE_BANK"
                      >已设为当前默认</span
                    >
                    <span v-else>设为默认</span>
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <el-form-item
              label="真实姓名:"
              v-if="
                rebatesTitle == '确认返款' &&
                  rebatesInfo.refund_type == CONFIG.USER_REFUND_TYPE_BANK
              "
            >
              <span
                ><span>{{ bankInfo.buyer_true_name }}</span></span
              >
            </el-form-item>
            <el-form-item
              label="银行名称:"
              v-if="
                rebatesTitle == '确认返款' &&
                  rebatesInfo.refund_type == CONFIG.USER_REFUND_TYPE_BANK
              "
            >
              <span
                ><span>{{ bankInfo.buyer_bank_name }}</span></span
              >
            </el-form-item>
            <el-form-item
              label="银行卡号:"
              v-if="
                rebatesTitle == '确认返款' &&
                  rebatesInfo.refund_type == CONFIG.USER_REFUND_TYPE_BANK
              "
            >
              <span>{{ bankInfo.buyer_bank_card_num }}</span>
            </el-form-item>
             <el-form-item
              label="收款码:"
              v-if="rebatesTitle == '确认返款' &&
                  rebatesInfo.refund_type == CONFIG.USER_REFUND_TYPE_WEIXIN"
            >
               <el-image
                v-if="rebatesInfoImg"
                ref="rebatesInfoImg"
                :class="[isWidth ? 'rebatesWidth' : 'rebatesHeight']"
                :style="payImgStyle"
                :src="rebatesInfoImg"
                :preview-src-list="[rebatesInfoImg]"
              >
              </el-image>
            </el-form-item>
              <el-form-item
              label="购物车截图:"
              v-if="rebatesTitle == '确认返款' && industry_status != CONFIG.INDUSTRY_STATUS_CLOSE" 
            >
               <el-image
                v-if="buyerAddCartPic"
                ref="buyerAddCartPic"
                :class="[isWidth ? 'rebatesWidth' : 'rebatesHeight']"
                :style="payImgStyle"
                :src="buyerAddCartPic"
                :preview-src-list="[buyerAddCartPic]"
              >
              </el-image>
            </el-form-item>
            <el-form-item
              prop="real_task_price"
              label="请填写实际返款金额:"
              v-if="rebatesTitle == '确认返款'"
            >
              <el-input
                type="number"
                placeholder="请填写实际返款金额"
                v-model.trim="rebatesInfo.real_task_price"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="tb_order_number"
              label="请填写淘宝订单编号:"
              v-if="rebatesTitle == '确认返款'"
            >
              <el-input
                type="number"
                placeholder="请填写淘宝订单编号(选填)"
                v-model.trim="rebatesInfo.tb_order_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="请填写返款备注:" prop="pay_note">
              <el-input
                type="textarea"
                placeholder="请填写30以内的返款备注(选填)"
                v-model.trim="rebatesInfo.pay_note"
              ></el-input>
            </el-form-item>
            <el-form-item style="color:#DCDFE6" label="历史返款备注:">
              <div v-if="rebatesNotes.length > 0">
                <div class="pay-note">
                  <el-tag
                    @click="rebatesInfo.pay_note = item"
                    :key="index"
                    :type="rebatesNotesType[index]"
                    v-for="(item, index) in rebatesNotes"
                  >
                    {{ item }}</el-tag
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rebatesClose">取 消</el-button>
          <el-button type="primary" @click="taskRefund('rebatesInfo')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        title="克隆任务"
        :visible.sync="cloneTastVisible"
        class="configureCode"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <el-form :model="cloneTaskForm">
          <el-form-item label="商品ID:" :label-width="formLabelWidth">
            {{ cloneTaskForm.item_id }}
          </el-form-item>
          <el-form-item label="宝贝标题:" :label-width="formLabelWidth">
            {{ cloneTaskForm.item_title }}
          </el-form-item>
          <el-form-item label="商品主图:" :label-width="formLabelWidth">
            <el-image
              style="width:100px;height:100px;"
              :src="cloneTaskForm.item_pic"
              class="item-img-box"
              :preview-src-list="[cloneTaskForm.item_pic]"
            ></el-image>
          </el-form-item>
          <el-form-item label="关键词:" :label-width="formLabelWidth">
            {{ cloneTaskForm.task_method_details }}
          </el-form-item>
          <el-form-item
            class="task-cnt-box"
            label="加单数量:"
            :label-width="formLabelWidth"
          >
            <el-input-number
              v-model="cloneTaskForm.task_cnt"
              :min="1"
              :max="100"
              label="加单数量"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="生效时间:" :label-width="formLabelWidth">
            <el-time-select
              v-model="cloneTaskForm.new_gmt_start"
              :picker-options="{
                start: new Date().getHours() + ':00',
                step: '01:00',
                end: '23:00'
              }"
              placeholder="选择时间"
            >
            </el-time-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cloneTastVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureCloneTask()">确 认</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { getTaskListHandler, getSelfTaskListHandler, cancelTaskHandler, exportSelfHandler, taskRefundHandler, unAllotTasksHandler, allotTasksHandler, createQrHandler, taskOperationHandler, removeTaskHandler, getKeywordListHandler, getShopListHandler, getWechatListHandler, getDispatchSelectHandler, alterTaskCommissionHandler, feedbackHandler, exportHandler, updateTaskPayNoteHandler, updateTaskHandler, recoverTaskHandler, cloneTaskHandler, getTaskInfoHandler } from '@/api/taskManage'
import { getSelectListHandler, getMySelectListHandler } from '@/api/deviceManagement'
import { getPlatInfoHandler } from '@/api/systemConfig'
import { getQrCodeSrc } from '@/util/tool'
export default {
  name: '',
  data () {
    return {
      industry_status: localStorage.getItem('gg_industry_status'),
      // 任务奖金参数获取
      configPlatForm: {},
      // 下拉匹配数据
      taskStaffArr: [],
      // 分配任务参数
      assignedTasksVisible: false,
      assignedTasksStaff: null,
      selAssignedTasksData: [],
      // 生成二维码参数
      createQrVisible: false,
      createQrData: [],
      task_limit: this.CONFIG.STATUS_FALSE,
      qr_note: null,
      // 成功生成二维码弹框参数
      qrSuccessVisible: false,
      showQrOrderId: null,
      // 下拉框数据缓存时间
      selSetTime: 60 * 2,
      // 返款备注
      pay_note: null,
      // 任务编辑蒙版
      editorTasksVisible: false,
      taskInfo: {
        shop_name: '',
        item_url: '',
        item_pic: '',
        single_task_price: '',
        task_commission: '',
        task_method_details: '',
        task_note: '',
        real_task_price: '',
        tb_order_number: '',
        buyer_wechat: '',
        buyer_tb_nick: '',
        item_title: ''
      },
      // 银行卡信息
      bankInfo: {
        buyer_bank_name: '',
        buyer_bank_card_num: '',
        buyer_true_name: '',
        buyer_bank_branch: '',
      },
      // 返款蒙版
      rebatesVisible: false,
      isWidth: true,
      rebatesTitle: '确认返款',
      payImgStyle: {
        height: 'auto',
        widht: 'auto'
      },
      rebatesNum: 1,
      rebatesNotes: [],
      rebatesNotesType: ['', 'success', 'warning'],
      rebatesInfoImg: '',
      buyerAddCartPic: '',
      rebatesInfo: {
        is_batch: 0,
        refund_type: this.zyLocalStorage.get('refund_type') ? this.zyLocalStorage.get('refund_type') : this.CONFIG.USER_REFUND_TYPE_WEIXIN,
        pay_note: '',
        real_task_price: '',
        tb_order_number: '',
        task_arr: ''
      },
      defaultRefundType: this.zyLocalStorage.get('refund_type') ? this.zyLocalStorage.get('refund_type') : this.CONFIG.USER_REFUND_TYPE_WEIXIN,
      // 克隆任务
      cloneTaskForm: {},
      cloneTastVisible: false,
      rebatesRule: {
        real_task_price: [
          { required: true, message: '请填写实际返款金额', trigger: 'blur' }
        ]
      },
      rules: {
        shop_name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' }
        ],
        item_url: [
          { required: true, message: '请输入宝贝链接', trigger: 'blur' }
        ],
        item_pic: [
          { required: true, message: '请输入主图链接', trigger: 'blur' }
        ],
        single_task_price: [
          { required: true, message: '请输入商品金额', trigger: 'blur' }
        ],
        task_commission: [
          { required: true, message: '请输入任务奖金', trigger: 'blur' }
        ],
        task_method_details: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ],
        real_task_price: [
          { required: true, message: '请输入实返金额', trigger: 'blur' }
        ],
        item_title: [
          { required: true, message: '请输入宝贝标题', trigger: 'blur' }
        ]
      }
    }
  },

  mounted () { },

  methods: {
    // 关闭返款弹窗
    rebatesClose () {
      this.rebatesVisible = false
      this.rebatesInfo.refund_type = this.zyLocalStorage.get('refund_type') ? this.zyLocalStorage.get('refund_type') : this.CONFIG.USER_REFUND_TYPE_WEIXIN
    },
    // 设置默认返款方式
    setRefundType (type) {
      this.zyLocalStorage.set('refund_type', type)
      this.defaultRefundType = type
      this.rebatesInfo.refund_type = type
    },
    // 返款图片动态绑定样式
    styleObject (url) {
      var _this = this
      let img = new Image()
      img.src = ''
      img.src = url
      img.onload = () => {
        _this.isWidth = (img.width > img.height) ? true : false
        _this.payImgStyle.width = (img.width > img.height) ? '270px !important' : 'auto !important'
        _this.payImgStyle.height = (img.width > img.height) ? 'auto !important' : '270px !important'
      }
    },
    //通过一个
    async passOne (row) {
      let _this = this
      _this.rebatesTitle = '确认返款'
      _this.rebatesNum = 1
      let data = await getTaskInfoHandler({ task_id: _this.encodeId(row.id) })
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      let result = data.result
      let param = [{ task_id: _this.encodeId(result.id), status: result.status }]
      _this.rebatesInfo.task_arr = JSON.stringify(param)
      Object.keys(_this.bankInfo).forEach((key) => {
        _this.bankInfo[key] = result[key] ? result[key] : ''
      })
      _this.rebatesInfo.real_task_price = Number(result.real_task_price)
      _this.rebatesInfo.tb_order_number = result.tb_order_number ? result.tb_order_number : ''
      _this.rebatesInfo.pay_note = ''
      _this.rebatesInfoImg = _this.CDN_UP_URL + result.buyer_collection_qr
      let rebatesNotes = JSON.parse(localStorage.getItem("rebatesNotes"))
      _this.rebatesNotes = rebatesNotes ? rebatesNotes : []
      _this.rebatesInfo.is_batch = 0
      _this.styleObject(_this.rebatesInfoImg)
      if(result.buyer_add_cart_pic) {
        _this.buyerAddCartPic = _this.CDN_UP_URL + result.buyer_add_cart_pic
        _this.styleObject(_this.buyerAddCartPic)
      }
      setTimeout(() => {
        _this.rebatesVisible = true
      }, 10)
    },
    //批量确认返款
    passAll (statusData, params) {
      let _this = this
      _this.rebatesTitle = '批量确认返款'
      _this.rebatesNum = statusData.length
      _this.rebatesInfo.tb_order_number = ''
      Object.keys(_this.bankInfo).forEach((key) => {
        _this.bankInfo[key] = ''
      })
      _this.rebatesInfo.task_arr = JSON.stringify(params)
      _this.rebatesInfo.is_batch = 1
      _this.rebatesInfo.real_task_price = null
      let rebatesNotes = JSON.parse(localStorage.getItem("rebatesNotes"))
      _this.rebatesNotes = rebatesNotes ? rebatesNotes : []
      _this.rebatesInfo.pay_note = ''
      _this.rebatesInfoImg = ''
      _this.buyerAddCartPic = ''
      _this.rebatesVisible = true
    },
    // 编辑任务提交
    updateTask (formName) {
      let _this = this
      _this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        let params = { ...this.taskInfo }
        if (params.single_task_price < 0) return _this.$message.warning('商品金额不能小于0')
        if (params.task_commission < 0) return _this.$message.warning('任务奖金不能小于0')
        if (params.real_task_price < 0) return _this.$message.warning('实返金额不能小于0')
        const data = await updateTaskHandler(params)
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$message.success(data.msg)
        _this.editorTasksVisible = false
        this.$emit('reloadData')
      })
    },
    // 查看二维码详情
    checkDetails () {
      let _this = this
      if (_this.showQrOrderId) {
        _this.$router.push({
          path: '/tasksManagement/codeList',
          query: {
            qr_order_id: _this.showQrOrderId
          }
        }, onComplete => { }, onAbort => { })
      }
    },
    // 关闭蒙版
    closeQrDialog () {
      this.createQrVisible = false
      this.qrSuccessVisible = false

    },
    // 确认要分配的任务
    sureAssignedTasks () {
      let _this = this
      if (!_this.assignedTasksStaff && _this.assignedTasksStaff != 0) return _this.$message.warning('请选择派单员！')
      let params = {
        task_arr: JSON.stringify(_this.selAssignedTasksData),
        task_staff_id: _this.encodeId(_this.taskStaffArr[_this.assignedTasksStaff].id),
        task_staff_name: _this.taskStaffArr[_this.assignedTasksStaff].real_name
      }
      _this.allotTasks(params)
    },
    // 任务分配员给派单员分配任务-接口
    async allotTasks (params) {
      let data = await allotTasksHandler(params)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$alert(data.msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.assignedTasksVisible = false
          this.$emit('reloadData')
        }
      })
    },
    // 确认要生成二维码
    sureCreateQr () {
      let _this = this
      if (!_this.task_limit && _this.task_limit != 0) return _this.$message.warning('请选择任务接单限制！')
      if (!_this.qr_note) return _this.$message.warning('请填写备注！')
      if (_this.qr_note.length > 100 || _this.qr_note.length < 1) return _this.$message.warning('备注字数在0~100之间！')
      let params = {
        task_ids: JSON.stringify(_this.createQrData),
        task_limit: JSON.stringify({ 'sex_limit': _this.task_limit }),
        qr_note: _this.qr_note
      }
      _this.createQr(params)
    },
    // 生成二维码-接口
    async createQr (params) {
      let _this = this
      let data = await createQrHandler(params)
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      let QrCodeSrc = _this.operation + 'qr_order_id=' + _this.encodeId(data.result.qr_order_id) + '&industry_status=' + localStorage.getItem('gg_industry_status')
      _this.showQrOrderId = _this.encodeId(data.result.qr_order_id)
      _this.qrSuccessVisible = true
      setTimeout(() => {
        document.getElementById('qr-box').innerHTML = ""
        getQrCodeSrc(QrCodeSrc, 'qr-box', 130, 130)
      }, 100)
    },
    // 审核通过-接口
    async taskRefund (formName) {
      let _this = this
      _this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        let params = { ...this.rebatesInfo }
        if (!_this.rebatesInfo.is_batch) {
          if (!params.real_task_price || params.real_task_price < 0) return _this.$message.warning('实际返款金额不能小于0')
        }
        if (params.pay_note && params.pay_note.length > 30) return _this.$message.warning('请填写30以内的返款备注')
        let data = await taskRefundHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        if (params.pay_note) {
          _this.rebatesNotes.unshift(params.pay_note)
          _this.rebatesNotes = Array.from(new Set(_this.rebatesNotes))
        }
        if (_this.rebatesNotes.length > 3) {
          _this.rebatesNotes.pop()
        }
        localStorage.setItem("rebatesNotes", JSON.stringify(_this.rebatesNotes))
        _this.$message.success(data.msg)
        _this.rebatesClose()
        this.$emit('reloadData')
      })
    },
    // 确认加单
    async sureCloneTask () {
      let _this = this
      if (!_this.cloneTaskForm.new_gmt_start || !_this.cloneTaskForm.task_cnt) return _this.$message.warning('填写内容不能为空！');

      let params = {
        task_id: _this.encodeId(_this.cloneTaskForm.id),
        task_cnt: _this.cloneTaskForm.task_cnt,
        gmt_start: _this.initTime() + ' ' + _this.cloneTaskForm.new_gmt_start + ":00",
      }
      const data = await cloneTaskHandler(params)
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.$message.success(data.msg)
      _this.cloneTastVisible = false
      this.$emit('reloadData')
    },
    // 获取派单员下拉列表
    async getDispatchSelect () {
      let _this = this
      _this.taskStaffArr = []
      let data = await getDispatchSelectHandler()
      if (data.code === _this.CONFIG.CODE_PAGE_END) return false
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.taskStaffArr = data.result
    },
    // 初始化当天时间
    initTime () {
      // 初始化时间
      let date = new Date()
      // 初始化生效时间
      let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
      let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
      let nowDate = date.getFullYear() + '-' + month + '-' + day
      return nowDate
    },
  }
}
</script>
<style lang='scss' >
.task-dialog {
  .task-editor {
    .rebatesInfo-img {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-bottom: 22px;
      padding-left: 20px;
    }
    .el-dialog__body {
      padding: 20px 40px 0 20px;
    }
    .el-form-item__label {
      font-size: 15px !important;
    }
    .el-textarea__inner {
      width: 100% !important;
      resize: none;
      height: 95px !important;
    }
    .el-input__inner {
      width: 100% !important;
    }
    .rebatesInfo-paytype {
      font-size: 15px;
      margin-right: 10px;
      color: #606266;
    }
    &__title {
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .form-border {
      border: 1px solid #ccc;
      padding: 22px 20px 0 0;
      border-radius: 5px;
      margin-bottom: 22px;
      .form-border-title {
        .el-form-item__content {
          line-height: 1.5;
        }
      }
    }
    .pay-note {
      width: 330px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .el-tag {
        max-width: 330px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 10px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .rebatesWidth {
      .el-image__error,
      .el-image__inner,
      .el-image__placeholder {
        width: 100%;
      }
    }
    .rebatesHeight {
      .el-image__error,
      .el-image__inner,
      .el-image__placeholder {
        width: auto;
      }
    }
  }
  .task-visible {
    .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
    .el-textarea__inner {
      width: 410px !important;
    }
    .el-input__inner {
      width: 410px !important;
    }
    .form-border-title {
      font-size: 10px;
    }
  }
  .configureCode {
    .task-cnt-box .el-input__inner {
      width: 305px !important;
    }
    .el-input-number {
      width: 305px;
    }
  }
}
</style>
