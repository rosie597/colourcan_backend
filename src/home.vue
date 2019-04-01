<template>
  <div class="home">
    <el-container>
      <el-header>
        <span style="float: left;">心艺兰后台管理系统</span>
        <span style="float: right; font-size:18px">{{userName}}</span>
      </el-header>
      <el-container>
        <el-aside width="300px">
          <el-menu background-color="#F0F0F0"
      text-color="#000"
      active-text-color="#11C2EE" :default-active="this.$router.path" router @select='handleSelect'>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-caret-bottom"></i>前台管理</template>
              <el-menu-item-group>
                <el-menu-item index="/home/bannerManage">banner管理</el-menu-item>
                <el-menu-item index="/home/tagManage">标签管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="/home/workManage">作品管理</el-menu-item>
            <el-menu-item index="/home/userManage">用户管理</el-menu-item>

            <el-submenu index="4">
              <template slot="title"><i class="el-icon-caret-bottom"></i>数据中心</template>
              <el-menu-item-group>
                <el-menu-item index="/home/userData">用户数据</el-menu-item>
                <el-menu-item index="/home/workData">创作数据</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <div class="main">
            <keep-alive>
              <router-view/>
            </keep-alive>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return {
      userName:'用户名'
    }
  },
  mounted(){
    this.userName=this.getCookie('userData2')
  },
  methods:{
    handleSelect(idx){
      console.log(idx)
    }
  }
}
</script>

<style>
.el-header {
  background-color:#fff;
  font-size: 25px;
  line-height: 60px;
  box-shadow: 0 0 20px #ccc;
}
.el-aside{
  height: 100%;
}
.el-menu{
  margin-top: 20px;
  font-size: 20px;
}
.main{
  background-color: white;
  padding: 25px;
}
</style>
