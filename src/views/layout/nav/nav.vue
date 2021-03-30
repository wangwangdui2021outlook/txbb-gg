<template>
  <div class="menu-content">
    <el-menu
      text-color="#FFF"
      class="el-menu-vertical"
      active-text-color="#FFF"
      :collapse="!menuStatus"
      :collapse-transition="false"
      :default-active="$route.path"
      :unique-opened="true"
    >
      <template v-for="(item, index) in asyncRoutes">
        <div
          :class="
            item.path + '/' + item.children[0].path == $route.path
              ? 'menu-link router-link-exact-active router-link-active'
              : 'menu-link'
          "
          @click="reloadView(item.path + '/' + item.children[0].path)"
          :to="item.path + '/' + item.children[0].path"
          v-if="item.children && item.children.length === 1"
          :key="index"
        >
          <el-menu-item :index="item.path + '/' + item.children[0].path">
            <i :class="item.children[0].meta.icon"></i>
            <span slot="title">{{ item.children[0].meta.title }}</span>
          </el-menu-item>
        </div>

        <template v-else-if="item.children && item.children.length > 1">
          <el-submenu :index="item.path" :key="index">
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span>{{ item.meta.title }}</span>
            </template>
            <div>
              <div
                :class="
                  item.path + '/' + child.path == $route.path
                    ? 'menu-link router-link-exact-active router-link-active'
                    : 'menu-link'
                "
                @click="reloadView(item.path + '/' + child.path)"
                v-for="child in item.children"
                :key="child.path"
                :to="item.path + '/' + child.path"
              >
                <el-menu-item
                  v-if="!child.meta.isHidden"
                  :index="item.path + '/' + child.path"
                  class="two-level"
                >
                  {{ child.meta.title }}</el-menu-item
                >
              </div>
            </div>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    menuStatus: {
      type: Boolean
    },
    asyncRoutes: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      classs: ''
    }
  },
  watch: {
    menuStatus (val) {
      this.classs = val ? '' : 'q'
    }
  },
  methods: {
    reloadpage (isload, path) {
      if (isload) {
        window.location.href = '/gg' + path
      }
    },
    reloadView (path) {
      if (this.$route.path == path) {
        this.$notify({ title: '提示', message: '您已经在当前页面', type: 'success' })
      } else {
        this.$router.push({ path: path })
      }
      this.$emit('routerLoad')
    },
  },
  mounted () {
  }
}
</script>

<style  lang="scss" >
.menu-content {
  .el-menu {
    // background-color: #29b7a3;
    @include color_primary();
    border-right: none;
    .el-menu-item,
    .el-submenu__title {
      height: 100px;
      line-height: 100px;
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      i {
        color: #fff;
      }
    }
    .el-menu-item:hover,
    .el-menu-item:focus {
      // background-color: #009681;
      @include color_primary_focus();
    }
    .el-submenu__title:hover {
      // background-color: #009681;
      @include color_primary_focus();
    }
    .two-level {
      height: 69px;
      font-size: 19px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 69px;
      // background-color: #08a993;
      @include color_primary_hover();
    }
  }
  .iconfont {
    font-size: 20px;
    color: #bcc3d2;
  }
  .menu-link {
    text-decoration: none;
  }
  .menu-link:active {
    text-decoration: none;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 100%;
  }
}
.menu-link {
  text-decoration: none;
}
.menu-link:active {
  text-decoration: none;
}
.el-menu {
  // background-color: #29b7a3;
  @include color_primary();
}
.el-menu-item:hover,
.el-menu-item:focus {
  // background-color: #009681;
  @include color_primary_focus();
}
.el-menu,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  // background-color: #009681;
  @include color_primary_focus();
}

.el-menu-item:hover {
  // background-color: #08a993;
  @include color_primary_hover();
}
.el-menu-vertical {
  .router-link-exact-active.router-link-active {
    .el-menu-item {
      // background-color: #009681;
      @include color_primary_focus();
    }
  }
}
.el-menu,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  // background-color: #29b7a3 !important;
  @include color_primary();
}
.el-menu-item:focus,
.el-menu-item:hover {
  // background-color: #009681 !important;
  @include color_primary_focus();
}
.el-menu-item:focus,
.el-menu-item:hover {
  // background-color: #009681 !important;
  @include color_primary_focus();
}
</style>
