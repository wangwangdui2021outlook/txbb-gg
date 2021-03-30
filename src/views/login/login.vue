<template>
  <div class="login-container">
    <el-main>
      <el-form
       v-if="notSuper"
        class="loginForm"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-row class="title">{{ PLAT_NAME }}</el-row>
        <el-form-item label="" prop="user_name">
          <el-input
            class="login-form-input"
            placeholder="请输入登陆账号"
            prefix-icon="el-icon-user"
            v-model="loginForm.user_name"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="passwd">
          <el-input
            type="password"
            class="login-form-input"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.passwd"
            @keyup.enter.native="login('loginForm')"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            size="medium"
            @click="login('loginForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <el-form v-else>
        <el-form-item label="选择登陆平台：" style="margin-top:20px">
           <el-cascader
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
            placeholder="请选择机构下的平台">
          </el-cascader>
        </el-form-item>
         <el-form-item style="margin-top: 150px">
          <el-button
            type="primary"
            :loading="loading"
            size="medium"
            @click="choosePlat"
            >确认选择</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import { getOrganListHandler } from '@/api/login'
export default {
  data () {
    return {
      loading: false,
      notSuper: true,
      loginForm: {
        user_name: '',
        passwd: '',
      },
      rules: {
        user_name: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      options:[],
      user_data: {},
      choiseData: []
    }
  },
  mounted () {
    this.notSuper  = true  
  },
  methods: {
    // 选择平台
    handleChange(value) {
      this.choiseData = value
    },
    // 获取超管平台列表
    async getOrganList () {
      this.notSuper = false
      let data = await getOrganListHandler({id: this.user_data.manager_id})
      if (data.code != this.CONFIG.CODE_SUCCESS) return this.$message.error(data.msg)
      let options = data.result
      options.map(iteam =>{
        iteam.label = iteam.organ_name
        iteam.value = iteam.organ_id
        if(iteam.plat_list){
          iteam.plat_list.map(item => {
            item.label = item.plat_name
            item.value = item.plat_id
          })
          iteam.children = iteam.plat_list
        }
      })
      this.options = data.result
    },
    // 超管登陆
    async choosePlat () {
      if(this.choiseData.length < 1) return this.$message.error('请选择平台')
      let params = {
        user_data: this.user_data,
        organ_id: this.choiseData[0],
        plat_id: this.choiseData[1]
      }
       this.$store.dispatch('SuperLogin', params).then(async (res) => {
        if (res.code != this.CONFIG.CODE_SUCCESS) return this.$message.error(res.msg)
        localStorage.setItem('gg_industry_status',res.result.industry_status)
        this.$message.success(res.msg)
        this.$router.push({ path: '/home/index' }, onComplete => { }, onAbort => { })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 登录
    getLogin () {
      let params = { ...this.loginForm }
      this.$store.dispatch('Login', params).then(async (res) => {
        if (res.code != this.CONFIG.CODE_SUCCESS) return this.$message.error(res.msg)
          localStorage.setItem('gg_industry_status',res.result.industry_status)
          if(res.result.can_login == 0){
            this.user_data = res.result
            this.getOrganList()
            return
          }
        this.$message.success(res.msg)
        this.$router.push({ path: '/home/index' }, onComplete => { }, onAbort => { })
      }).catch(err => {
        this.$message.error(err)
      })
    },
    login (formName) {
      this.$refs[formName].validate((valid) => {
        valid && this.getLogin()
      })
    },
  }
}
</script>

<style lang="scss" >
.login-container {
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
  background: url(../../assets/png/login_bg.png) no-repeat center 0 / cover;
  .el-main {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 490px;
    height: 472px;
    box-shadow: 0px 22px 50px 0px rgba(43, 171, 153, 1);
    border-radius: 10px;
    padding: 55px 47px 45px 47px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    .el-form-item__label{
      font-size: 16px;
    }
    .title {
      height: 40px;
      font-size: 28px;
      font-weight: 500;
      color: rgba(41, 183, 163, 1);
      line-height: 40px;
      margin-bottom: 65px;
    }
    .loginForm {
      .el-input__inner {
        height: 54px;
        background-color: transparent;
        border-radius: 30px !important;
      }
      .el-icon-user,
      .el-icon-lock {
        font-size: 20px;
        padding-top: 7px;
        padding-left: 13px;
      }
    }
    .el-input--prefix {
      .el-input__inner {
        padding-left: 50px;
      }
    }
    .el-button {
      height: 55px;
      margin-top: 35px;
      background: rgba(41, 183, 163, 1);
      border-radius: 30px;
      width: 100%;
      font-weight: 500;
      font-size: 20px;
    }
  }
}
</style>
