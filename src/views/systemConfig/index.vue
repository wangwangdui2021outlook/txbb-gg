<template>
  <div class="system-content">
    <p id="ps">*所有参数提交后立即生效(仅支持两位小数)</p>
    <el-row class="dialog-row">
      <el-tabs v-model="activeName" type="card">
        <!-- <el-tab-pane
          label="接单设置"
          name="first"
          v-if="userId == CONFIG.ROLE_ADMIN"
        >
          <p>接单限制管理</p>
          <el-form ref="form" :model="form" label-width="250px">
            <div v-for="(value, key, index) in formInfo" :key="index">
              <el-form-item :label="value.name" v-if="onField.indexOf(key)">
                <el-input-number
                  v-model="value.value"
                  :min="value.min"
                ></el-input-number
                >&nbsp;{{ value.unit }}
              </el-form-item>
            </div>
            <el-form-item>
              <span class="note-text">
                *注：以天计算都是自然日
              </span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" v-has="81001" round @click="setConfig"
                >保 存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane> -->
        <el-tab-pane label="会员任务奖金设置" name="two">
          <p>会员任务奖金设置</p>
          <el-form ref="form" :model="platForm" label-width="40px">
            <el-form-item>
              <el-row class="commission_to_buyer">
                <h3>
                  <span>任务奖金分段设置 = </span>
                  <el-input
                    type="number"
                    size="small"
                    style="width:100px;"
                    min="0"
                    v-model="platForm.commission_to_buyer"
                    @keyup.native='keyupEvent1($event,platForm.commission_to_buyer)'
                    placeholder="基础奖金"
                  ></el-input
                  ><span> +</span>
                  <span>
                    商品金额 *
                    <el-input
                      type="number"
                      size="small"
                      min="0"
                      max="100"
                      style="width:100px;"
                      v-model="platForm.commission_ratio"
                      @keyup.native='keyupEvent2($event,platForm.commission_ratio)'
                      placeholder="比例系数"
                    ></el-input>
                    %
                    <span style="font-size:14px;font-weight:normal;"
                      >（向上取整）</span
                    >
                  </span>

                  <p style="font-size:14px;font-weight:normal;">
                    如商品金额为{{ goodsPrice }}元，任务奖金为：
                    {{ platForm.commission_to_buyer }} + {{ goodsPrice }} *
                    {{ platForm.commission_ratio }}% =
                    {{ getCommission() }}
                  </p>
                </h3>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-has="81001" round @click="setPlatInfo"
                >保 存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="规定时间内做单额外任务奖金" name="three" v-if="industry_status == CONFIG.INDUSTRY_STATUS_OPEN || industry_status == CONFIG.INDUSTRY_STATUS_NOT">
          <p>规定时间内做单额外任务奖金</p>
          <el-col style="font-size: 14px;padding-left:40px;">
            <span>如果在隔日指定时间内提交任务，将额外获得</span>
            <el-input type="number" size="small"
            style="width:100px;"
            min="0"
            @keyup.native='keyupEvent3($event)'
            v-model="platForm.award_price"
            ></el-input>
            <span>元</span>
          </el-col>
          <el-col style="padding: 40px 0 0 40px">
            <el-button type="primary" round v-has="81001" @click="setPlatInfo">保 存</el-button>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="任务开始前短信提醒" name="four" v-if="industry_status == CONFIG.INDUSTRY_STATUS_OPEN || industry_status == CONFIG.INDUSTRY_STATUS_NOT">
          <p>任务开始前短信提醒</p>
          <el-col style="font-size: 14px;padding-left: 40px;">
            <span style="font-size: 14px">任务做单开始前</span>
            <el-input type="number" size="small"
            style="width:100px;"
            min="0"
            @keyup.native='keyupEvent4($event)'
            v-model="platForm.award_minute"
            ></el-input>
            <span>分钟短信提醒用户（如果时间设置为0，则不发短信）</span>
          </el-col>
          <el-col style="padding: 40px 0 0 40px;">
            <el-button type="primary" round v-has="81001" @click="setPlatInfo">保 存</el-button>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="收款信息认证设置" name="five" v-if="industry_status == CONFIG.INDUSTRY_STATUS_OPEN || industry_status == CONFIG.INDUSTRY_STATUS_NOT">
           <p>收款信息认证是否填写身份证号码</p>
          <el-radio v-model="platForm.refund_type" :label="CONFIG.SET_REFUND_TYPE_OPEN">需要填写</el-radio>
          <el-radio v-model="platForm.refund_type" :label="CONFIG.SET_REFUND_TYPE_NOT">不需要填写（默认）</el-radio>
           <el-row style="margin-top: 20px">
             <el-button type="primary" v-has="81001" round @click="setPlatInfo">保 存</el-button>
           </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import { getPlatInfoHandler, setPlatInfoHandler } from '@/api/systemConfig'
import { changeOV } from '@/util/tool'
export default {
  data () {
    return {
      industry_status: localStorage.getItem('gg_industry_status'),
      activeName: 'two',
      goodsPrice: 196,
      platForm: { 
       },
      // 不循环显示的字段
      onField: ['commission_to_buyer'],
      formInfo: {
        day_task_limit: {
          name: '用户每日接单限制数:',
          value: null,
          min: 1,
          unit: '单'
        },
        month_task_limit: {
          name: '用户每月接单限制数:',
          value: null,
          min: 1,
          unit: '单'
        },
        tb_day_limit: {
          name: '淘宝号每日接单限制:',
          value: null,
          min: 1,
          unit: '单'
        },
        tb_month_limit: {
          name: '淘宝号做单间隔:',
          value: null,
          min: 0,
          unit: '天'
        },
        wx_day_limit: {
          name: '微信号每日接单限制:',
          value: null,
          min: 1,
          unit: '单'
        },
        wx_month_limit: {
          name: '微信号做单间隔:',
          value: null,
          min: 0,
          unit: '天'
        },
        tb_item_limit: {
          name: '淘宝号对同个商品id做单限制天数:',
          value: null,
          min: 0,
          unit: '天'
        },
        tb_shop_limit: {
          name: '淘宝号对同个店铺名做单限制天数:',
          value: null,
          min: 0,
          unit: '天'
        },
        wx_item_limit: {
          name: '微信号对同个商品id做单限制天数:',
          value: null,
          min: 0,
          unit: '天'
        },
        bank_item_limit: {
          name: '银行卡名字对商品id做单限制天数:',
          value: null,
          min: 0,
          unit: '天'
        },
        commission_to_buyer: {
          name: '会员佣金设置:',
          value: null,
          min: 0,
          unit: '元/单'
        }
      },
      minuters: 0,
      money: 0,
    }
  },
  mounted () {
    this.getPlatInfo()
    if(this.industry_status != this.CONFIG.INDUSTRY_STATUS_CLOSE) return this.platForm = {commission_to_buyer: '', commission_ratio: '', award_minute: '',award_price: '', award_minute: '', refund_type: 1}
    this.platForm = {commission_to_buyer: '', commission_ratio: '', award_minute: ''}
  },
  methods: {
    keyupEvent1(e,input){
       let nowValue = e.target.value
      if(nowValue > Math.floor(nowValue)){
         nowValue = nowValue.substring(0, nowValue.indexOf('.') + 3)
      }
      this.platForm.commission_to_buyer = nowValue
    },
    keyupEvent2(e,input){
       let nowValue = e.target.value
      if(nowValue > Math.floor(nowValue)){
         nowValue = nowValue.substring(0, nowValue.indexOf('.') + 3)
      }
      this.platForm.commission_ratio = nowValue
    },
     keyupEvent3(e,input){
       let nowValue = e.target.value
      if(nowValue > Math.floor(nowValue)){
         nowValue = nowValue.substring(0, nowValue.indexOf('.') + 3)
      }
      this.platForm.award_price = nowValue
    },
     keyupEvent4(e,input){
       let nowValue = e.target.value
      if(nowValue > Math.floor(nowValue)){
         nowValue = nowValue.substring(0, nowValue.indexOf('.') + 3)
      }
      this.platForm.award_minute = nowValue
    },
    // 获取系统配置参数
    async getPlatInfo () {
      let data = await getPlatInfoHandler()
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      Object.keys(data.result).forEach((key) => {
        this.platForm[key] = data.result[key]
      })
    },
    // 修改系统配置参数提交
    async setPlatInfo () {
      let param = this.platForm
      if (param.commission_to_buyer < 0) return this.$message.warning('基础奖金不能小于0！')
      if (param.commission_ratio < 0 || param.commission_ratio > 100) return this.$message.warning('比例系数为0-100的数值！')
      let data = await setPlatInfoHandler(param)
      if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
      this.$message.success(data.msg)
    },
    getCommission () {
      return Number(Number(this.platForm.commission_to_buyer * 100) + Number(Math.ceil(this.goodsPrice * this.platForm.commission_ratio / 100) * 100)) / 100
    }
  }
}
</script>

<style lang="scss" >
.system-content {
  #ps {
    color: red;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .el-row {
    p {
      margin-bottom: 20px;
    }
  }
  .note-text {
    color: red;
    font-size: 14px;
  }
}
</style>
