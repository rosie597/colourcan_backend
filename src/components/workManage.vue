<template>
  <div class="work-manage">

        <user-data></user-data>
        <p class="dividing-line">dd</p>

  	<div class="work-list">
      <h2>作品列表</h2>
      <div  class="search-sort">
        <el-select v-model="getWorkmanage.categoryValue" placeholder="选择类别"   clearable  class="width-select" @change="sortCategory">
          <el-option
            v-for="item in category"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="getWorkmanage.TimesortValue" placeholder="选择排序"  clearable class="width-select" @change="sortTime">
          <el-option
            v-for="item in Timesort"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入昵称或标题" clearable  class="search-input" @clear='searchList' v-model="getWorkmanage.searchValue" @keyup.enter.native='searchList'></el-input><el-button type="primary" @click="searchList" >搜索</el-button>
      </div><!--搜索框，选择排序-->
      <div>
         <template>
          <el-table :data="tableData"  style="width: 100%">
              <el-table-column  type="index" >     </el-table-column>
              <el-table-column   label="头像" >
                 <template slot-scope="scope">
                   <div class="head_pic">
                   <img :src="scope.row.avatar" />
                   </div>
                 </template>
              </el-table-column>
              <el-table-column  prop="nickname" label="昵称" ></el-table-column>
              <el-table-column  prop="title" show-overflow-tooltip  label="标题" ></el-table-column>
              <el-table-column  prop="favouriteNum" label="收藏量" ></el-table-column>
              <el-table-column  prop="likeNum" label="点赞量" ></el-table-column>
              <el-table-column  prop="commentNum" label="评论量"  ></el-table-column>
              <el-table-column  prop="publishTime" label="投稿时间" ></el-table-column>
              <el-table-column   label="类别">
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">文章</span>
                  <span v-if="scope.row.type == 2">艺术作品</span>
                  <span v-if="scope.row.type == 3">摄影</span>

                 </template>
              </el-table-column>
              <el-table-column   fixed="right" label="操作" >
                <template slot-scope="scope">
                  <el-button @click="viewClick(scope.$index, scope.row)" type="text" size="small">预览</el-button>
                  <el-button  @click="deleteClick(scope.$index, scope.row)" type="text" size="small">下架</el-button>
                </template>
              </el-table-column >
          </el-table>
        </template>
        <el-pagination background layout="prev, pager, next" :total="totalElement" class="pagination-style"  @current-change='currentPage'> </el-pagination>
      </div><!--列表-->
        <delete-component :dialogVisible = 'dialogVisible' :workId='workId' :index='deleteIndex' @closeDeleteVisible= 'closeDeleteVisible' @delteWorkManage = 'delteWorkManage'></delete-component>

    </div>
  </div>
</template>

<script>
import deleteComponent from './workChildren/delete'
import userdata from './workChildren/userdata'
export default {
  name: 'workManage',
  components:{
    'delete-component': deleteComponent,
    'user-data':userdata
  },
  data () {
    return {
      category:[
        {
          value:1,
          label:'文章'
        },
        {
          value:2,
          label:'作品'
        },
        {
          value:3,
          label:'摄影'
        },

      ],
      Timesort:[
        {
          value:'likeNum',
          label:'点赞量'
        },
        {
          value:'favouriteNum',
          label:'收藏量'
        },
        {
          value:'commentNum',
          label:'评论量'
        }
      ],

      //文章列表
      tableData:[  ],

      //选择类别
      categoryValue:'',
      //选择排序
      TimesortValue:'',
      //搜索框
      searchValue:'',
      //下架原因
      reasonValue:[],
      //下架DIalog
      dialogVisible:false,
      //端口号
      urlName:'http://119.29.176.47:9001',
      //当前页数
      pageNum:1,
      //总数作品
      totalElement: 0,
      //作品ID
      workId:'',
      //删除的作品
      deleteIndex:-1
    }
  },
  created(){
      this.getList();
      console.log(this.getWorkmanage)
  },
  computed:{
    getWorkmanage(){
      return this.$store.getters.getWorkmanage;
    }
  },
  methods:{
    getList(){
      // console.log(value)
      this.$axios({
        method:'get',
        url: this.domainName+'/data/workList',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params:{pageNum:this.getWorkmanage.pageNum,type:this.getWorkmanage.categoryValue,sort:this.getWorkmanage.TimesortValue,keyword:this.getWorkmanage.searchValue}


      }).then((res)=>{
        this.totalElement = res.data.data.total;
        // this.totalElement = 50;
        this.tableData = res.data.data.rows;

      }).catch((error)=>{

      })
    },
    //预览
  	viewClick(index,value){
      console.log(this.getWorkmanage)
      let postData= {pageNum:this.getWorkmanage.pageNum,type:this.getWorkmanage.categoryValue,sort:this.getWorkmanage.TimesortValue,keyword:this.getWorkmanage.searchValue}
      this.$store.commit('setworkManage',postData)
        this.$router.push({path: '/home/workDetail',
        query:{
        id: value.id ,
        name:this.$route.name,
        index:index
        }
       })
    },
    //下架商品
    deleteClick(index,row){
      this.dialogVisible = true;
      this.workId = row.id;
      this.deleteIndex = index;

    },
    //分页
    currentPage(pageNum){
      this.getWorkmanage.pageNum = pageNum;
      this.getList();
    },

      //搜索
      //类别
      sortCategory(value){
        this.categoryValue = value;
        this.getList();
      },
      //收藏量
      sortTime(value){
        this.TimesortValue = value;
        this.getList();
      },
      //关键字搜索列表
      searchList(){
            // if(this.getWorkmanage.searchValue === ''){
            //   this.$message.error('请输入你要搜索的关键字')
            // }else{
              this.getWorkmanage.pageNum = 1;
               this.getList();
            // }
      },
      //下架
      closeDeleteVisible(value){
        this.dialogVisible = value;
      },
      //删除作品
      delteWorkManage(value){
          console.log('manage删除')
      this.tableData.splice(value,1)

      }
  },
  deactivated() {
    this.$destroy();
  }
}
</script>

<style scoped>
.work-list h2{

    padding-left: 40px;
    font-size: 20px;
    text-align: left;
    margin-top: 20px;
    margin-bottom: 20px

}
.search-input{
  width: 180px;
}
.search-sort{
  text-align: left;
  margin-bottom: 20px;
}
.width-select{
  width: 110px;
  margin-right: 20px
}
/*分页*/
.pagination-style{
  margin-top: 20px;
}
/*询问下架原因的dialog*/
.dialog-downwork{
  text-align: left;
  padding: 0px 20px

}
.down-font{
  color: rgba(94, 94, 94, 0.647058823529412)

}
.head_pic{
  width: 60px;
  height: 60px;
  overflow: hidden;
}
.head_pic img{
  max-width: 60px;
}
.dividing-line{
  width: 100%;
  color: #F6F6F6;
  background-color: #F6F6F6;
  height:10px;
}
</style>
