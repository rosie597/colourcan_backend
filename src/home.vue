<template>
  <div class="home">
    <el-container>
      <el-header>
        <span style="float: left;">心艺兰后台管理系统</span>
        <span class="userName">
          {{userName}}
          <ul class="userOperate">
            <li @click="changePasswordFlag"><i class="el-icon-edit-outline"></i>修改密码</li>
            <li @click="logoutFlag = true"><i class="el-icon-circle-close"></i>登出</li>
          </ul>
        </span>
      </el-header>
      <el-container>
        <el-aside width="300px">
          <el-menu background-color="#F0F0F0"
      text-color="#000"
      active-text-color="#11C2EE" :default-active="this.$router.path" router @select='handleSelect'>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-caret-bottom"></i>前台管理</template>
              <el-menu-item-group>
                <el-menu-item index="/backend/bannerManage">banner管理</el-menu-item>
                <el-menu-item index="/backend/tagManage">标签管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-menu-item index="/backend/workManage">作品管理</el-menu-item>
            <el-menu-item index="/backend/userManage">用户管理</el-menu-item>

            <el-submenu index="4">
              <template slot="title"><i class="el-icon-caret-bottom"></i>数据中心</template>
              <el-menu-item-group>
                <el-menu-item index="/backend/userData">用户数据</el-menu-item>
                <el-menu-item index="/backend/workData">创作数据</el-menu-item>
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

    <el-dialog :visible.sync="logoutFlag" width="30%">
      <span><i class="el-icon-warning"></i> 确定要登出账号吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutFlag = false">取 消</el-button>
        <el-button type="primary" @click="logout">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="passwordFlag" width="30%">
      <el-form ref="form" :model="userData" label-width="83px">
        <el-row style="height: 40px;line-height: 40px;margin-bottom: 10px;">
         <el-col :span="5">账号名称</el-col>
         <el-col :span="8" style="text-align: left">{{userName}}</el-col>
        </el-row>
        <el-form-item label="*新密码">
          <el-input type="password" v-model="userData.firstPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="*确认密码">
          <el-input type="password" v-model="userData.secondPassword" placeholder="请重新输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordFlag = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return {
      logoutFlag: false,
      passwordFlag: false,
      userName:'用户名',
      userData:{
        firstPassword: '',
        secondPassword: ''
      }
    }
  },
  mounted(){
    this.userName=this.getCookie('userData2')
  },
  methods:{
    handleSelect(idx){
    },
    logout:function () {
      let arr = this.getCookie('token2').split('.')[1];
      let id = JSON.parse(atob(arr)).jti;
      let self = this;
      this.$axios({
        method: 'get',
        baseURL: '/api',
        url: '/user/logout',
        params:{
          userId: id
        }
      }).then(res=>{
        // self.delCookie('token2');
        // self.delCookie('userData2');
        self.$store.dispatch('exit');
        // self.$store.dispatch('login',{token,userData});
        self.$message('登出成功');
        self.$router.push({path: '/'});
      }).catch(err=>{
        self.$message('登出失败');
      })
    },
    changePassword:function(){
      let arr = this.getCookie('token2').split('.')[1];
      let id = JSON.parse(atob(arr)).jti;
      let self = this;
      if (this.userData.firstPassword != this.userData.secondPassword){
        this.$message('两次输入密码不一致');
        return;
      }
      this.$axios({
        method: 'put',
        baseURL: self.domainName,
        url: '/admin/password',
        data:{
          id: id,
          password: self.userData.secondPassword
        }
      }).then(res=>{
        self.passwordFlag = false;
        self.$message('修改密码成功');
      }).catch(err=>{
        self.userData.firstPassword = '';
        self.userData.secondPassword = '';
        self.$message('修改密码失败');
      })
    },
    changePasswordFlag:function () {
      this.passwordFlag = true;
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
.userName{
  float: right;
  font-size:18px;
  position: relative;
}
.userName:hover .userOperate{
  visibility: visible;
}
.userOperate{
  visibility: hidden;
  position: absolute;
  right: -10px;
  width: 115px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px #ccc;
  z-index: 999;
  font-size: 16px;
  overflow: hidden;
}
.userOperate li{
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  padding: 0 10px;
}
.userOperate li:hover{
  background: #ccc;
}
</style>
