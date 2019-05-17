<template>
  <el-row class="container">
    <!--头部布局-->
    <el-col :span="24" class="header">
      <!--管理后台标签-->
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{collapsed?'':sysName}}
      </el-col>
      <!--隐藏按钮-->
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <!--用户信息-->
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar"/> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>

    <!------------------------------------------------主界面（包括坐标导航菜单和右边内容）---------------------------------------------------->
    <el-col :span="24" class="main">
      <!--左侧导航菜单--->
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse="collapsed" @open="handleOpen"
                 @close="handleClose" unique-opened router>
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <el-menu-item v-for="child in item.children"
                            :index="child.path"
                            :key="child.path"
                            v-if="!child.hidden"
                            class="c-el-menu-item">{{child.name}}
              </el-menu-item>
            </el-submenu>
            <!--只有一个节点-->
            <el-menu-item v-else :index="item.children[0].path" :key="item.children[0].path">
              <i :class="item.iconCls"></i>
              <span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>

          </template>
        </el-menu>
      </aside>
      <!----------------------右侧显示内容----------------------->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24"
                  class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/"
                           class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched"
                                  :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <!------------------------根据路由插入模板------------------------->
          <el-col :span="24"
                  class="content-wrapper">
            <transition name="fade"
                        mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>

    </el-col>

  </el-row>
</template>

<script>
  export default {
    data() {
      return {
        sysName: '管理后台',
        collapsed: false,
        sysUserName: 'Tom',
        sysUserAvatar: 'http://localhost:8090/images/user.png',
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      //退出登录
      logout: function () {
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('user');
          _this.$router.push('/login');
        }).catch(() => {
        });
      }

    },
    mounted() {
      var user = sessionStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user.name || '';
        this.sysUserAvatar = user.url || '';
      }

    }
  }
</script>


<style scoped lang="scss">
  @import "../styles/vars.scss";

  .container {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: $color-primary;
      color: #fff;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color: #fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .logo {
        //width:230px;
        height: 60px;
        font-size: 22px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: rgba(238, 241, 146, 0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color: #fff;
        }
      }
      .logo-width {
        width: 230px;
      }
      .logo-collapse-width {
        width: 60px;
      }
      .tools {
        padding: 0px 23px;
        width: 14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside {
        width: 230px;
        background-color: #eef1f6;
        .el-menu-vertical-demo:not(.el-menu--collapse) {
          width: 230px;
          min-height: 400px;
          height: 100%;
          background-color: #eef1f6;
          border-style: hidden;
        }
        .el-menu--collapse {
          background-color: #eef1f6;
          border-style: hidden;
          width: 60px;
        }
        .c-el-menu-item {
          background-color: #e4e7ec;
        }

      }
      .menu-collapsed {
        flex: 0 0 60px;
        width: 60px;
      }
      .menu-expanded {
        flex: 0 0 230px;
        width: 230px;
      }
      .content-container {
        flex: 1;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          .title {
            width: 100px;
            float: left;
            color: #475669;
            align-items: left;
          }
          .breadcrumb-inner {
            float: right;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
