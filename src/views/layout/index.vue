<template>
  <el-container class="main-wrap">
    <el-aside :class="menuStatus ? 'is-open' : 'is-close'">
      <p :style="style">{{ PLAT_NAME }}</p>
      <navs
        :menuStatus="menuStatus"
        :asyncRoutes="routes"
        @routerLoad="reload"
      />
    </el-aside>
    <el-container class="main-container">
      <el-header class="main-header" style="height:100px">
        <headers @changMenuStatus="changMenuStatus" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import navs from '@/views/layout/nav/nav'
import headers from '@/views/layout/header/header'
import { asyncRoutes } from '@/router'
import Config from '@/util/common'
export default {
  components: {
    navs: navs,
    headers: headers
  },
  data () {
    return {
      routerStatus: true,
      menuStatus: true,
      Config: Config,
      asyncRoutes: asyncRoutes,
      style: ''
    }
  },
  watch: {
    menuStatus (val) {
      this.style = val ? '' : 'display:none'
    }
  },
  computed: {
    routes () {
      // return asyncRoutes.options.routes
      return this.$store.state.asyncMenuList
    }
  },
  methods: {
    changMenuStatus (flag) {
      this.menuStatus = flag
    },
    reload () {
      // this.routerStatus = false
      // this.$nextTick(() => {
      //   this.routerStatus = true
      // })
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      // setTimeout(() => { loading.close() }, 150)
    }
  }
}


</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
  height: 100%;
  .el-aside {
    width: 270px !important;
    max-width: 270px;
    height: 100%;
    // background-color: #29b7a3;
    @include color_primary();
    position: relative;
    z-index: 2200;
    p {
      color: #fff;
      font-size: 30px;
      font-weight: 800;
      margin: 30px 0;
      text-align: center;
    }
  }
  .el-aside {
    transition: all 0.5s;
  }
  .is-close {
    width: 64px !important;
  }
  .main-container {
    height: 100%;
    overflow-x: auto;
    .main-header {
      min-width: 1320px;
    }
  }
  .el-main {
    min-width: 1320px;
    overflow-x: hidden;
    padding: 40px 50px 100px;
    background-color: #f9f9f9;
  }
}
</style>
