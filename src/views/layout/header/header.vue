<template>
  <div class="header-container">
    <div class="header-content">
      <el-row class="header-left">
        <i
          @click="closeMenu"
          :class="menuFlag ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
          class="icon"
        ></i>

        <el-breadcrumb separator="/">
          <transition-group name="slide-fade">
            <el-breadcrumb-item
              v-for="route in breadcrumd"
              :key="route.path"
              :to="{ path: route.path }"
              >{{ route.meta.title }}</el-breadcrumb-item
            >
          </transition-group>
        </el-breadcrumb>
      </el-row>
      <div class="header-right">
        <div class="header-right-one">
          <div class="img-bac">
            <img class="img1" src="@/assets/png/account1.png" alt="" />
            <img class="img2" src="@/assets/png/account2.png" alt="" />
          </div>
          
          <p>{{ userInfoObj.user_name }} ({{ userInfoObj.real_name }})</p>
        </div>
        <div class="header-right-two">
          <el-link
            class="fr"
            type="primary"
            :underline="false"
            icon="el-icon-picture-outline"
            @click="$router.push('/imageManagement')"
            >图片工具</el-link
          >
          <el-divider direction="vertical"></el-divider>
          <el-link
            @click="dialogFormVisible = true"
            class="fr"
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            >修改密码</el-link
          >
          <el-divider direction="vertical"></el-divider>
          <el-link
            @click="logout()"
            class="fr"
            :underline="false"
            type="primary"
            icon="el-icon-switch-button"
            >退出</el-link
          >
        </div>
      </div>
    </div>

    <el-row class="dialog-row">
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
        <el-form
          :model="modifyPass"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
        >
          <el-form-item label="旧密码" prop="old_password">
            <el-input
              v-model="modifyPass.old_password"
              type="password"
              placeholder="请输入旧密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="modifyPass.password"
              type="password"
              placeholder="请输入新密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="password_check">
            <el-input
              v-model="modifyPass.password_check"
              type="password"
              placeholder="请再次确认新密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定修改</el-button
          >
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { changePasswordHandler } from '@/api/login'
export default {
  data () {
    return {
      menuFlag: true,
      userInfoObj: this.$store.state.userInfo,
      breadcrumd: [],
      dialogFormVisible: false,
      modifyPass: {},
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能低于 6 位', trigger: 'blur' }
        ],
        password_check: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能低于 6 位', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getBreadcrumd()
  },
  watch: {
    '$route' () {
      this.getBreadcrumd()
    }
  },
  methods: {
    closeMenu () {
      this.menuFlag = !this.menuFlag
      this.$emit('changMenuStatus', this.menuFlag)
    },
    getBreadcrumd () {
      let routes = this.$route.matched
      let breadcrumd = this.filterRoutes(routes)
      this.breadcrumd = breadcrumd
    },
    filterRoutes (routes) {
      let homeRoute = [{ path: '/', meta: { title: '' } }]
      if (routes.some(route => route.path === '')) {
        return routes.filter(item => {
          if (item.path === '') return false
          return true
        })
      } else {
        routes = routes.filter(route => {
          if (!route.meta.title) return false
          return true
        })
        return homeRoute.concat(routes)
      }
    },
    // 退出登录
    logout () {
      this.$confirm('确定要退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        this.$store.dispatch('Logout').then(() => {
          _this.$router.push({ path: `/login?time=${new Date().getTime()}` }, onComplete => { }, onAbort => { })
        })
      }).catch(() => { })
    },
    // 修改密码
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        if (this.modifyPass.password !== this.modifyPass.password_check) return this.$message.error('两次密码输入不一致，请重新确认')
        const param = {
          old_password: this.modifyPass.old_password,
          new_password: this.modifyPass.password
        }
        const data = await changePasswordHandler(param)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.$alert(data.msg, '提示', {
          confirmButtonText: '重新登录',
          type: 'success',
          center: true,
          showClose: false,
          callback: action => {
            this.$store.dispatch('Logout').then(() => {
              this.$router.push({ path: `/login?time=${new Date().getTime()}` }, onComplete => { }, onAbort => { })
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scope>
.header-container {
  .header-content {
    width: 100%;
    height: 100px;
    padding: 0 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-left {
    display: flex;
    align-items: center;
    .el-breadcrumb {
      font-size: 26px;
      font-weight: 600;
      color: #000;
    }
  }
  .icon {
    display: inline-block;
    color: #333;
    font-size: 32px;
    text-align: center;
    cursor: pointer;
  }
  .header-right {
    .header-right-one {
      float: left;
      margin-right: 71px;
      p {
        float: right;
        height: 36px;
        font-size: 18px;
        font-weight: 500;
        line-height: 36px;
        margin-left: 12px;
      }
      .img-bac {
        display: inline-block;
        img{
          display: none;
          width: 36px;
          height: 36px;
        }
        @include primary_header_img();
      }
    }
    .header-right-two {
      float: left;
      height: 36px;
      margin-right: 46px;
    }
    .el-link {
      font-size: 18px;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      line-height: 36px;
      &:hover {
        color: #08a993 !important;
      }
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.38s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(5px);
  opacity: 0;
}
</style>
