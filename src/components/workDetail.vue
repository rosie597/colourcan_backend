<template>
  <div class="workDetail">
      <ul class="two-button">
        <li><el-button type="primary" @click="returnFun">返回列表</el-button></li>
        <li><el-button type="primary" @click="deleteWork">下架作品</el-button></li>
      </ul>
      <div class="workcontent">
        <detail-component :workId='workId'></detail-component>
        <p class="dividing-line">dd</p>
        <comment-component :workId='workId'></comment-component>
      </div>
        <delete-component :dialogVisible = 'dialogVisible' :workId='workId' :index='index' @closeDeleteVisible= 'closeDeleteVisible' @delteWorkDetail='delteWorkDetail'></delete-component>

  </div>
</template>
<script>
import detailComponent from './workChildren/detail'
import commentComponent from './workChildren/comment'
import deleteComponent from './workChildren/delete'

export default {
  components:{
    'detail-component':detailComponent,
    'comment-component':commentComponent,
    'delete-component': deleteComponent

  },
  name: 'workDetail',
  data () {
    return {
      workId:this.$route.query.id,
      name:this.$route.query.name,
      index:this.$route.query.index,
      dialogVisible:false,

    }
  },
  computed:{
    getWorkmanage(){
      return this.$store.getters.getWorkmanage;
    }
  },
  created(){
      // this.$route.query.recruitViperId
      console.log('created',this.getWorkmanage);


  },
  methods:{
  	 returnFun(){
      console.log(this.name)
        this.$router.push({path: this.name});
      },
      // this.$route.query.recruitViperId
      deleteWork(){
        this.dialogVisible = true;
      },
      //下架
        closeDeleteVisible(value){
        this.dialogVisible = value;
        },
        delteWorkDetail(){
           this.$router.push({path: this.name});
        }
  },
  deactivated() {
    this.$destroy();
  }
}
</script>

<style scoped >
.workDetail{
  /* // border: 1px solid @color; */
  width: 100%;
  /* // background-color: #F6F6F6 */

}
.two-button{
  float: right;
  margin-top: 20px
}
.two-button li{
   display: inline;
   margin-right: 20px;

}
 /*询问下架原因的dialog*/
.dialog-downwork{
  text-align: left;
  padding: 0px 20px

}
.dividing-line{
  width: 100%;
  color: #F6F6F6;
  background-color: #F6F6F6;
  height:5px;
}
</style>
