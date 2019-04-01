<template>
  <div>
  	<div class="statistics">
      <h2>简易用户统计</h2>
      <el-row>
       <el-col :span="6" :offset="3" class="newUser">
         <div class="left">
           <p class="number">
             {{data.new.num}}
           </p>
           <p class="title">新用户数</p>
         </div>
         <div class="percentBox">
           <p class="percent" :class="{green: data.new.dayPercentage > 0}">
             <span>日</span>
             <i :class="{
              'el-icon-caret-top': data.new.dayPercentage > 0,
              'el-icon-minus' : data.new.dayPercentage == 0,
              'el-icon-caret-bottom': data.new.dayPercentage < 0}"></i>
             <span class="innerPercent">{{data.new.dayPercentage}}%</span>
           </p>
           <p class="percent" :class="{green: data.new.weekPercentage > 0}">
             <span>周</span>
             <i :class="{
              'el-icon-caret-top': data.new.weekPercentage > 0,
              'el-icon-minus' : data.new.dayPercentage == 0,
              'el-icon-caret-bottom': data.new.weekPercentage < 0}"></i>
             <span class="innerPercent">{{data.new.weekPercentage}}%</span>
           </p>
           <p class="percent" :class="{green: data.new.monthPercentage > 0}">
             <span>月</span>
             <i :class="{
              'el-icon-caret-top': data.new.monthPercentage > 0,
              'el-icon-minus' : data.new.dayPercentage == 0,
              'el-icon-caret-bottom': data.new.monthPercentage < 0}"></i>
             <span class="innerPercent">{{data.new.monthPercentage}}%</span>
           </p>
         </div>
       </el-col>
       <el-col :span="6" class="oldUser">
         <div class="left">
           <p class="number">
             {{data.old.num}}
           </p>
           <p class="title">老用户数</p>
         </div>
         <div class="percentBox">
           <p class="percent" :class="{green: data.old.dayPercentage > 0}">
             <span>日</span>
             <i :class="{
              'el-icon-caret-top': data.old.dayPercentage > 0,
              'el-icon-minus' : data.old.dayPercentage == 0,
              'el-icon-caret-bottom': data.old.dayPercentage < 0}"></i>
             <span class="innerPercent">{{data.old.dayPercentage}}%</span>
           </p>
           <p class="percent" :class="{green: data.old.weekPercentage > 0}">
             <span>周</span>
             <i :class="{
              'el-icon-caret-top': data.old.weekPercentage > 0,
              'el-icon-minus' : data.old.dayPercentage == 0,
              'el-icon-caret-bottom': data.old.weekPercentage < 0}"></i>
             <span class="innerPercent">{{data.old.weekPercentage}}%</span>
           </p>
           <p class="percent" :class="{green: data.old.monthPercentage > 0}">
             <span>月</span>
             <i :class="{
              'el-icon-caret-top': data.old.monthPercentage > 0,
              'el-icon-minus' : data.old.dayPercentage == 0,
              'el-icon-caret-bottom': data.old.monthPercentage < 0}"></i>
             <span class="innerPercent">{{data.old.monthPercentage}}%</span>
           </p>
         </div>
       </el-col>
       <el-col :span="7" class="totalUser">
         <div class="left">
           <p class="number">
             {{data.all.num}}
           </p>
           <p class="title">总用户数</p>
         </div>
         <div class="percentBox">
           <p class="percent" :class="{green: data.all.dayPercentage > 0}">
             <span>日</span>
             <i :class="{
              'el-icon-caret-top': data.all.dayPercentage > 0,
              'el-icon-minus' : data.all.dayPercentage == 0,
              'el-icon-caret-bottom': data.all.dayPercentage < 0}"></i>
             <span class="innerPercent">{{data.all.dayPercentage}}%</span>
           </p>
           <p class="percent" :class="{green: data.all.weekPercentage > 0}">
             <span>周</span>
             <i :class="{
              'el-icon-caret-top': data.all.weekPercentage > 0,
              'el-icon-minus' : data.all.dayPercentage == 0,
              'el-icon-caret-bottom': data.all.weekPercentage < 0}"></i>
             <span class="innerPercent">{{data.all.weekPercentage}}%</span>
           </p>
           <p class="percent" :class="{green: data.all.monthPercentage > 0}">
             <span>月</span>
             <i :class="{
              'el-icon-caret-top': data.all.monthPercentage > 0,
              'el-icon-minus' : data.all.dayPercentage == 0,
              'el-icon-caret-bottom': data.all.monthPercentage < 0}"></i>
             <span class="innerPercent">{{data.all.monthPercentage}}%</span>
           </p>
         </div>
       </el-col>
      </el-row>
    </div>

    <div class="userListBox">
      <h2>用户列表</h2>
      <el-input v-model="searchData" class="search" placeholder="请输入昵称或标签" clearable>
        <el-button slot="append" class="button" @click="userListGet">搜索</el-button>
      </el-input>
      <el-table class="userList" :data="data.userList" :header-cell-style="{'background-color': '#fafafa','text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                fit header-row-class-name="userList" stripe style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="80"><template slot-scope="scope">
          <img :src="scope.row.avatar" class="userHeadpicture" alt="头像" style="width: 60px;height: 60px;border-radius: 50%;">
        </template></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="popularity" label="人气"></el-table-column>
        <el-table-column prop="favouriteCount" label="收藏"></el-table-column>
        <el-table-column prop="fansCount" label="粉丝数"></el-table-column>
        <el-table-column prop="commentCount" label="评论"></el-table-column>
        <el-table-column prop="activeTime" width="175" label="上次活跃时间"></el-table-column>
        <el-table-column prop="createTime" width="175" label="注册时间"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope"><el-button @click="viewUser(scope.row)" type="text">查看详情</el-button></template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination :current-page.sync="data.userListPage"
                       @current-change="userListGet"
                       background layout="prev, pager, next" :total="data.userListTotal">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'userManage',
  data () {
    return {
      searchData:'',
      searchType: '',
      data:{
        new:{},
        old:{},
        all:{},
        // pagerCount: 5,
        userListTotal:100,userListPage: 1,
        userList:[]
      }
    }
  },
  methods:{
    viewUser:function (user) {
      this.$router.push({path: '/home/userDetail', query:{user: user}});
    },
    parseStatic: function(obj){
      for (let key in obj){
        obj[key] = parseFloat(obj[key]);
      }
      return obj;
    },
    // 获取用户统计数据
    userStatic:function(){
      let self = this;
      this.$axios({
        method:'get',
        baseURL:'/api',
        url: '/data/user'
      }).then(function (res) {
        let data = res.data.data;
        self.data.new = self.parseStatic(data.new);
        self.data.old = self.parseStatic(data.old);
        self.data.all = self.parseStatic(data.all);
      }).catch(function (err) {
        self.$message('获取数据失败')
      })
    },
    //获得用户列表数据
    userListGet:function () {
      let self = this;
      this.$axios({
        methods:'get',
        baseURL: '/api',
        url: '/user/search',
        params:{
          pageNum: self.data.userListPage,
          pageSize: 10,
          keyword: self.searchData,
          type: 1//选择排序方式
        }
      }).then(function (res) {
        self.data.userListTotal = res.data.data.total;
        self.data.userList = res.data.data.rows;
      }).catch(function (err) {
        self.$message('<p>获取用户列表失败</p>', '',{
          dangerouslyUseHTMLString: true
        });
      });
    }
  },
  created(){
    this.userListGet();
    this.userStatic();
  }
}
</script>

<style scoped>

  /*用户统计*/
  .statistics h2,.userListBox h2{
    padding-left: 40px;
    font-size: 20px;
    text-align: left;
  }
  .newUser, .oldUser, .totalUser{
    position: relative;
    padding-top: 10px;
    display: flex;
  }
  .number{
    margin: 0;
    margin-bottom: 10px;
    font-size: 45px;
  }
  .title{
    font-size: 16px;
  }
  .left{
    flex: 1;
    /*text-align: right;*/
  }
  .percentBox{
    flex: 2;
    text-align: left;
    /*position: absolute;*/
    /*left: 63%;*/
    /*top: 0;*/
  }
  .percent{
    margin: 0;
    color: red;
  }
  .innerPercent{
    display: inline-block;
    width: 40px;
    text-align: right;
  }
  .green{
    color: green;
  }
  /*用户列表*/
  .userListBox{
    text-align: left;
  }
  .search{
    width: 250px;
  }
  /*.search .button{*/
    /*background: rgb(24,144,255);*/
    /*color: #fff;*/
    /*border-color: rgb(24,144,255);*/
    /*outline-color: rgb(24,144,255);*/
  /*}*/
  .userList{
    margin-top: 20px;
  }
  /*.userHeadpicture{*/
    /*width: 80px;*/
    /*height: 80px;*/
    /*border-radius: 50%;*/
  /*}*/
  .pagination{
    padding-top: 10px;
    text-align: center;
  }
</style>
