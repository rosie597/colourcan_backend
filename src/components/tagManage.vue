<template>
  <div class="tag">
  	    <h1 style="text-align: left;">标签管理</h1>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="作品" name="work">
            <tag-form v-on:listenShow='recieveShow' v-on:listenChange='pageChange' :tableData='tableData'></tag-form>
          </el-tab-pane>
          <el-tab-pane label="摄影" name="photo">
            <tag-form v-on:listenShow='recieveShow' v-on:listenChange='pageChange' :tableData='tableData'></tag-form>
          </el-tab-pane>
          <el-tab-pane label="文章" name="article">
            <tag-form v-on:listenShow='recieveShow' v-on:listenChange='pageChange' :tableData='tableData'></tag-form>
          </el-tab-pane>
        </el-tabs>

        <!-- 弹出框 -->
        <div class="greyCtn" v-if='isBoxShow' id='greyCtn'>
          <div class="box">
            <div class="top">
              <span style="float: left">{{operateName}}</span>
              <i class="el-icon-close" @click='closeBox'></i>
            </div>
            <div class="middle">
              <div class="item" v-if="operateName=='编辑标签'||operateName=='新增标签'">
                <span class="mr">标签名</span>
                <el-input v-model="tagName" placeholder="请输入标签名" style='width:80%;'></el-input>
              </div>
              <div v-else>
                 <div class="item">
                    <span class="mr">已选标签</span>
                    <span>{{selectedItem}}</span>
                  </div>
                  <div class="item">
                    <span class="mr">新标签名</span>
                    <el-input v-model="tagName" placeholder="请输入标签名" style='width:80%;'></el-input>
                  </div>
              </div>
            </div>
            <div class="foot">
              <el-button @click='closeBox'>取消</el-button>
              <el-button type="primary" @click='confirm'>确定</el-button>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import tagForm from './tag/form'
import $ from 'jquery'
export default {
  name: 'tagManage',
  components:{
    tagForm
  },
  data () {
    return {
      activeName: 'work',
      isBoxShow:false,
      operateName:'',
      selected:[],//选择列表
      selectedItem:'',
      tagName:'',//输入名
      editName:'',
      tableData:{},
      type:2,
      page:1
    }
  },
  mounted(){
    this.getTag(1)
  },
  methods:{
    getTag(page,type=this.type){
      var that=this
      this.$axios({
        method:'get',
        url:that.domainName+'/tag/'+type+'?pageNum='+page+'&pageSize=10',
        header:{
          'Content-Type':'application/json'
        },
      }).then((res)=>{
        console.log(res)
        this.tableData=res.data.data
      }).catch((err)=>{

      })
    },
    pageChange(page){
      this.getTag(page)
    },
    handleClick(tab, event) {
        console.log(tab.$parent.currentName);
        var typeName=tab.$parent.currentName//work,photo,article
        switch(typeName){
          case 'work':{
            this.type=2
          } break;
          case 'photo':{
            this.type=3
          } break;
          case 'article':{
            this.type=1
          } break;
        }
        //请求接口
        this.getTag(this.page)
    },
    closeBox(){
      this.isBoxShow=false;
      this.selectedItem='';
      this.selected=[];
      this.tagName='';
      $('body').css('overflow','auto');
    },
    recieveShow(type,item,arr){
      this.isBoxShow=true
      var t1=setTimeout(()=>{
        let el=document.getElementById('greyCtn');
        el.style.height=window.innerHeight+"px";
        el.style.width=window.innerWidth+"px";
      },10)
      $('body').css('overflow','hidden');
      this.operateName=type
      if(item){
        console.log(item)
        this.selectedItem=item;
        this.tagName=item.name
      }
      if(arr){
        console.log('arrs',arr)
        this.selected=arr
      }
    },
    confirm(){
      var that=this
      var name=this.tagName
      var selected=this.selected
      var item=this.selectedItem
      switch(this.operateName){
        case '新增标签':{
            if(!name){
              that.$message.error('请输入标签名')
            }else{
              this.$axios({
                method:'post',
                url:that.domainName+'/tag',
                data:{
                  name:name,
                  type:this.type
                }
              }).then((res)=>{
                console.log(res)
                if(res.data.code==20000){
                  that.$message({
                    type:'success',
                    message:'新增成功'
                  })
                  this.getTag(this.page)
                  this.closeBox()
                }else{
                  that.$message.error(res.data.message+'新增失败')
                }
              }).catch((err)=>{
                console.log(err)
                that.$message.error('新增失败')
              })
            }
        }break;
        case '整合标签':{
            var ids=[]
            for(let i in selected){
              ids.push(selected[i].id)
            }
            if(!name){
              that.$message.error('请输入标签名')
            }else{
              this.$axios({
                method:'post',
                url:that.domainName+'/tag/integrate',
                header:{
                  'Content-Type':'application/json'
                },
                data:{
                  ids:ids,
                  tagName:name,
                  type:this.type
                }
              }).then((res)=>{
                console.log(res)
                if(res.data.code==20000){
                  that.$message({
                    type:'success',
                    message:'整合成功'
                  })
                  this.getTag(this.page)
                  this.closeBox()
                }else{
                  that.$message.error(res.data.message+'整合失败')
                }
              }).catch((err)=>{
                console.log(err)
                that.$message.error('整合失败')
              })
            }
        }break;
        case '编辑标签':{
          if(!name){
              that.$message.error('请输入标签名')
            }else{
              that.$axios({
                method:'put',
                url:that.domainName+'/tag',
                header:{
                    'Content-Type':'application/json'
                },
                data:{
                  id:item.id,
                  name:name,
                  count:item.count,
                  type:this.type
                }
              }).then((res)=>{
                if(res.data.code==20000){
                    that.$message({
                      type:'success',
                      message:'编辑成功'
                    })
                    this.getTag(this.page)
                    this.closeBox()
                  }else{
                    that.$message.error(res.data.message+'编辑失败')
                  }
              }).catch((err)=>{
                console.log(err)
                that.$message.error('编辑失败')
              })
            }
        }break;
      }
    }
  }
}
</script>

<style scoped>
    .tag{
    }
    .greyCtn{
      background-color: rgba(127, 127, 127, 0.3);
      z-index: 999;
      position: absolute;
      top: 0;
      left: 0;
    }
  .box{
    background-color: white;
    width: 40%;
    position: absolute;
    left: 30%;
    top: 140px;
  }
  .top{
    height: 25px;
    padding: 15px;
    border-bottom: 1px solid #eee;
    font-size: 20px;
  }
  .el-icon-close{
    width: 30px;
    height: 30px;
    position: absolute;
    top: 14px;
    right: 14px;
  }
  .middle{
    padding: 20px;
  }
  .item{
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: flex-start;
    margin: 0 auto;
    align-items: center;
    padding: 20px;
  }
  .mr{
    margin-right: 20px;
  }
  .foot{
    height: 80px;
    border-top: 1px solid #eee;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
  }
</style>