<template>
  <div class="container">
  	<div class="userInformation">
      <div class="part_1">
        <img :src="userInformation.avatar" alt="头像">
        <p class="userName">{{userInformation.nickname}}</p>
        <el-row>
         <el-col :span="8">
           <p>{{userInformation.artWorkNum}}</p>
           <span class="title">艺术作品数</span>
         </el-col>
         <el-col :span="8">
           <p>{{userInformation.photographyNum}}</p>
           <span class="title">摄影数</span>
         </el-col>
          <el-col :span="8">
           <p>{{userInformation.articleNum}}</p>
           <span class="title">文章数</span>
         </el-col>
        </el-row>
      </div>
      <hr />
      <div class="part_2">
        <el-row style="margin-bottom: 10px;">
         <el-col :span="12">
           <span class="title">人气</span>
           <span>{{userInformation.popularity}}</span>
         </el-col>
          <el-col :span="12">
           <span class="title">收藏</span>
           <span style="position: relative; left: 7px;">{{userInformation.favouriteCount}}</span>
         </el-col>
        </el-row>
        <el-row>
         <el-col :span="11">
           <span class="title">粉丝数</span>
           <span>{{userInformation.fansCount}}</span>
         </el-col>
         <el-col :span="12" :offset="1">
           <span class="title">评论数</span>
           <span>{{userInformation.commentCount}}</span>
         </el-col>
        </el-row>
      </div>
      <hr />
      <div class="part_3">
        <el-row>
         <el-col :span="10" class="title">上次活跃时间</el-col>
         <el-col :span="13" class="time">{{userInformation.activeTime}}</el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
         <el-col :span="10" class="title">注册时间</el-col>
         <el-col :span="13" class="time">{{userInformation.createTime}}</el-col>
        </el-row>
      </div>
      <hr />
      <div class="part_4">
        <span v-for="(item, index) in userInformation.tags">
          {{item.value}}
          <i class="delete-tag" @click="showDeleteTagBox(item.id,index)">×</i>
        </span>
      </div>
    </div>
    <div class="userBox">
      <el-button v-show="activeName == 'second'" type="primary" @click="addTagBoxVisible = true" size="medium" class="add-tag-button">添加标签</el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户投稿记录" name="first">
          <el-table :data="contributeRecord" style="width: 100%" fit :header-cell-style="{'background': '#eee', 'text-align': 'center'}"
                    :cell-style="{'text-align':'center'}">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="type" label="类别"></el-table-column>
            <el-table-column prop="favouriteNum" label="收藏量"></el-table-column>
            <el-table-column prop="likeNum" label="点赞量"></el-table-column>
            <el-table-column prop="commentNum" label="评论量"></el-table-column>
            <el-table-column prop="publishTime" label="投稿时间" width="175"></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="preview(scope.row.id)">预览</el-button>
                <el-button type="text" @click="showWithdrawBox(scope.row.id, scope.$index)">下架</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination"
                         :current-page.sync="contributeRecordPage"
                         @current-change="contributeRecordGet"
                         background layout="prev, pager, next" :total="contributeRecordTotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="用户浏览喜好" name="second">
          <el-table :data="browseHobby" style="width: 100%" fit :header-cell-style="{'background': '#eee', 'text-align': 'center'}"
                    :cell-style="{'text-align':'center'}">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="tag" label="标签"></el-table-column>
            <el-table-column prop="count" label="次数"></el-table-column>
          </el-table>
          <el-pagination class="pagination"
                         :current-page.sync="browseHobbyPage"
                         @current-change="browseHobbyGet"
                         background layout="prev, pager, next" :total="browseHobbyTotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--添加标签弹框-->
    <el-dialog title="新增标签" :visible.sync="addTagBoxVisible" width="30%">
      <el-input v-model="addTagInput" placeholder="请输入添加用户标签名" autofocus></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTagBoxVisible = false" @keyup.enter.native="addTag">取 消</el-button>
        <el-button type="primary" @click="addTag">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除标签弹框-->
    <el-dialog :visible.sync="deleteTagBoxVisible" width="30%">
      <span>确定要删除该标签吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteTagBoxVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteTag">确 定</el-button>
      </span>
    </el-dialog>
    <!--作品下架弹框-->
    <el-dialog title="作品下架" @close="withdrawFlag = false" :visible.sync="withdrawBoxVisible" width="41%">
      <el-row>
       <el-col :span="4" style="text-align: right;line-height: 30px;">
         下架原因
       </el-col>
       <el-col :span="15" :offset="1" style="line-height: 30px;">
         <el-checkbox-group  style="text-align: left;" v-model="withdrawReason">
           <el-checkbox label="含有低俗、暴力因素"></el-checkbox>
           <el-checkbox label="含广告、商业等因素"></el-checkbox>
           <el-checkbox label="侵权、侵犯隐私权及原创争议因素"></el-checkbox>
           <el-checkbox label="存在危害平台安全因素"></el-checkbox>
           <el-checkbox label="内容质量太低"></el-checkbox>
           <el-row>
            <el-col :span="6"><el-checkbox @change="otherReasonFlag = !otherReasonFlag;" label="其他原因"></el-checkbox></el-col>
            <el-col :span="10"><el-input v-model="otherReason" :disabled="!otherReasonFlag" placeholder="请认真输入其他原因" size="small"></el-input></el-col>
           </el-row>
         </el-checkbox-group>
       </el-col>
       <el-col :span="4"><p class="alert" v-if="withdrawFlag">请选择下架原因</p></el-col>
      </el-row>
      <p style="margin-bottom: 0;">下架之后无法恢复，确定要下架该作品吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="withdrawBoxVisible = false">取 消</el-button>
        <el-button type="primary" @click="withdraw">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'userDetail',
  data () {
    return {
      //弹框
      addTagBoxVisible: false,addTagInput:'',
      deleteTagBoxVisible: false,deleteTagInput:{id:'',index:''},
      withdrawBoxVisible: false,withdrawReason:[],otherReason:'',otherReasonFlag:false,withdrawInput:{id: '',index:''},withdrawFlag:false ,
      //
      activeName:'second',
      userInformation:{avatar:'', nickname: '', popularity: '', favouriteCount:'', fansCount:'',commentCount: '', activeTime:'',createTime: '', tags:[]},
      contributeRecordTotal:100,contributeRecordPage: 1,
      contributeRecord:[],
      browseHobbyTotal:100,browseHobbyPage: 1,
      browseHobby:[],
      category: ["","文章","艺术作品", "摄影"]
    }
  },
  methods:{
    // 标签操作
    deleteTag:function () {
      let { id, index} = this.deleteTagInput;
      this.userInformation.tags.splice(index, 1);
      this.deleteTagBoxVisible = false;
      this.tagChange();
    },
    addTag:function () {
      let length = this.userInformation.tags.length;
      let id = this.userInformation.tags[length - 1].id + 1;
      this.userInformation.tags.push({id: id,value: this.addTagInput});
      this.addTagBoxVisible = false;
      this.tagChange();
    },
    showDeleteTagBox:function(id, index){
      this.deleteTagInput = { id, index};
      this.deleteTagBoxVisible = true;
    },
    tagChange:function(){
      let self = this;
      let tags=[], tagsString='';
      for (let i=0; i<self.userInformation.tags.length; i++){
        tags.push(self.userInformation.tags[i].value);
      }
      tagsString = tags.join(',');
      this.$axios({
        method: 'put',
        baseURL: '/api',
        url: '/user/tags',
        params:{
          userId: self.userInformation.id,
          tags: tagsString
        }
      }).then(function (res) {

      }).catch(function (err) {
        self.$message('更改标签失败');
      })
    },
    // 下架操作
    showWithdrawBox:function (id, index) {
      this.withdrawInput = { id, index};
      this.withdrawBoxVisible = true;
    },
    withdraw:function(){
      let { id, index} = this.withdrawInput;
      let self = this;
      if (this.withdrawReason.length == 0){
        this.withdrawFlag = true;
        return false;
      }
      let otherIndex = this.withdrawReason.indexOf('其他原因');
      if(otherIndex > -1){
        this.withdrawReason.splice(otherIndex, 1);
      }
      let reason = this.withdrawReason.join(',');
      reason = this.otherReason == "" ? reason: reason + ',' + this.otherReason;
      this.withdrawBoxVisible = false;
      this.withdrawFlag = false;
      this.$axios({
        method: 'delete',
        baseURL:'/api',
        url: '/work/soldout/'+ id,
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          reason: reason
        }
      }).then(function (res) {
        self.$message('作品已下架');
        self.contributeRecord.splice(index, 1);
      }).catch(function (err) {
        self.$message('删除失败');
      })
      this.otherReason = "";
    },
    // 用户投稿记录
    contributeRecordGet:function(){//获取用户投稿记录
      let self = this;
      this.$axios({
        method: 'get',
        baseURL: '/api',
        url: '/data/publishRecord/' + self.userInformation.id,
        params:{
          pageNum: self.contributeRecordPage,
          pageSize: 10
        }
      }).then(function (res) {
        self.contributeRecord = res.data.data.rows;
        self.contributeRecord.forEach(function (v,i,arr) {
          arr[i].type = self.category[v.type];
        });
        self.contributeRecordTotal = res.data.data.total;
      })
    },
    preview:function (id) {
      this.$router.push({path: '/backend/workDetail', query: {id: id,name:this.$route.name}});
    },
    // 用户浏览爱好
    browseHobbyGet:function () {
      let self = this;
      this.$axios({
        method: 'get',
        baseURL: '/api',
        url: '/data/visitRecord/' + self.userInformation.id,
        params:{
          pageNum: self.browseHobbyPage,
          pageSize: 10
        }
      }).then(function (res) {
        self.browseHobbyTotal = res.data.data.total== 0? 1:res.data.data.total;
        self.browseHobby = res.data.data.rows ;
      }).catch(function (err) {
        self.$message('获取浏览爱好数据失败');
      })
    },
    //获取用户信息
    getUserInform:function () {
      let i=0;
      this.userInformation = this.$route.query.user;
      if (this.userInformation.tags == undefined){
        return;
      }
      if (this.userInformation.tags.length > 1){
        this.userInformation.tags = this.$route.query.user.tags.split(',').map(function (v,i) {
          return { id: i++, value: v };
        });
      }else {
        this.userInformation.tags = this.$route.query.user.tags[0];
      }
    }
  },
  created(){
    this.getUserInform();
    this.browseHobbyGet();
    this.contributeRecordGet();
  }
}
</script>

<style scoped>
  .container{
    overflow: hidden;
    position: relative;
  }
  hr{
    margin-top: 20px;
    margin-bottom: 20px;
    width: 95%;
    border: none;
    border-bottom: 1px solid #ccc;
  }
  .userInformation{
    float: left;
    width: 25%;
    padding: 10px;
    background: #fff;
    border-radius: 5px;
  }
  .part_1{
    margin-top: 40px;
  }
  .part_1 p{
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .part_1 img{
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }
  .userName{
    margin-bottom: 0;
  }
  .title{
    font-size: 14px;
    color: #7b7b7b;
  }
  .part_2 .title{
    margin-right: 15px;
  }
  .time{
    font-size: 14px;
  }
  .part_4{
    text-align: left;
    padding-left:10px;
    padding-right:10px;
  }
  .part_4 span{
    display: inline-block;
    height: 16px;
    padding: 3px 5px;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    background: #aaa;
    border-radius: 3px;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .part_4 span i{
    cursor: pointer;
    display: inline-block;
    padding-right: 2px;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    text-align: center;

  }
  .part_4 span i:hover{
    background: #ddd;
  }
  .userBox{
    float: right;
    width: 70%;
    background: #fff;
    border-radius: 5px;
    padding: 10px;
  }
  .add-tag-button{
    height: 30px;
    line-height: 8px;
    padding:10px 15px;
    position: absolute;
    right: 3%;
    top: 15px;
    z-index: 999;
  }
  .pagination{
    margin-top: 10px;
  }
  /*弹出框*/
  .alert{
    font-size: 12px;
    color: red;
    margin-top: 0;
    line-height: 28px;
  }
</style>
