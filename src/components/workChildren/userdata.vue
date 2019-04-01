<template>
    <div class="statistics">
      <h2>简易作品数据统计</h2>
       <el-row>
       <el-col :span="5" :offset="5" class="newUser">
         <div class="left">
           <p class="number">
             {{data.new.workNum}}
           </p>
           <p class="title">新增投稿数</p>
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
       <el-col :span="5" :offset="5" class="oldUser">
         <div class="left">
           <p class="number">
             {{data.all.workNum}}
           </p>
           <p class="title">投稿总数</p>
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
</template>

<script>
export default {
    data(){
        return{
          data:{
        new:{workNum:0, dayPercentage:0, weekPercentage:0, monthPercentage:0},
        old:{workNum:0, dayPercentage:0, weekPercentage:0, monthPercentage:0},
        all:{workNum:0, dayPercentage:0, weekPercentage:0, monthPercentage:0},
        }
        }
    },
    created(){
      this.userStatic();
    },
    methods:{
         // 获取用户统计数据
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
        // baseURL:'/api',
        url:this.domainName+'/data/work'
      }).then(function (res) {
        let data = res.data.data;
        self.data.new = self.parseStatic(data.newData);
        self.data.all = self.parseStatic(data.allData);
        console.log(self.data.new)
      }).catch((error)=>{
         this.$message.error('暂时没有作品统计数据')
})
    },
    }
}
</script>

<style>
 /*用户统计*/
 .statistics{
   margin-bottom: 20px
 }
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
