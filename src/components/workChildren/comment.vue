<template>
    <div class="comment ">
        <ul class=" comment-all-margin-bottom change-style">
            <li><span class="font-span comment-margin-right">全部评论</span><em class="font-em">{{commentNum}}</em></li>
        </ul><!--评论数和时间排序方式-->
        <div class="comment-main" v-for="(item ,index ) in comment" :value="item.value" :key="index">
            <div class="comment-head"><img :src="item.fromAvatar"></div><!--评论的用户头像-->
            <div class="comment-content">
                <div class="commentuser-margin-bottom"><span class="font-span commentuser-margin-right">{{item.fromName}}</span><em class="font-em commentuser-margin-right">{{item.createTime}}</em>
                <img class="icon-img " :src="callimg"><em class="font-em commentuser-margin-right">{{item.likeNum}}</em>
                <el-button type='text'  @click="deleteMyComment(item, index)">删除</el-button>
                </div>
                <!--评论的人名和时间-->
                <div><p class="font-span margin-bottom-16">{{item.content}}</p></div><!--评论的内容-->
                <div>
                    <div class="answear-style" v-show="item.children.length > 0 " v-for="(item2 ,index2 ) in item.children"  :value="item2.value" :key="index2">
                        <div class="comment-answer font-span ">
                            <!-- <p class="deleteBtn" slot="reference" ><span type="text "   icon="el-icon-close" class="deleteStyle el-icon-close" @click="deleteAnswer(item,index2)"></span></p> -->
                            <!-- <span slot="reference"></span> -->
                                  <div class="comment-head anwser-head"><img :src="item2.fromAvatar"></div><!--评论的用户头像-->

                                 <span class="margin-bottom-16 commentuser-margin-right">{{item2.fromName}} </span> <em class="font-em   commentuser-margin-right">{{item2.createTime}}</em>
                                 <el-button type='text' @click=" deleteAnswer(item,index2)">删除</el-button>
                        
                            <p class="margin-left-style margin-bottom-16">{{item2.content}}</p>
                        </div><!--回复的内容-->
                    </div><!--回复的内容和回复背景框-->
                </div><!--回复的内容显示区域-->

            </div><!--评论回复内容区域-->
            <div class="line"></div>
        </div><!--评论的用户头像和评论回复区域-->
        <div  v-if="comment.length == 0"   class="null-comment">
              <p  class="null-comment-p">没有更多评论了...</p>

        </div>
    </div> <!--评论区域-->
</template>

<script>
export default {
    props:['workId'],

    data(){
        return{
            //评论
            comment:[],
            commentNum:'',
            callimg:'../../static/imgs/works/call.png'
        }
    },
    created(){
        this.getComment();
    },

    methods:{
         //获取评论
        getComment(){
             this.$axios({
                method:'get',
                url:this.domainName+ '/comment/'+this.workId,
                headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        // 'Authorization': token
                    }
                }).then((res)=>{
                    if(res.data.code === 20000){
                    // console.log('评论',res.data.data)
                        this.commentNum = res.data.data.total;
                        this.comment = res.data.data.rows;
                    }
                }).catch((error)=>{

                })
        },
        //删除评论
        deleteMyComment(item, index){

            this.$axios({
                    method:'delete',
                    url:this.domainName+ '/comment/'+item.id,
                    params:{
                        type:1
                    },
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                    // data: {commentId:}
             }).then((res)=>{
                    if(res.data.code === 20000){
                         this.comment.splice(index, 1); 
                         this.commentNum -= 1;
                          this.$message({
                            message: '删除成功',
                            type: 'success'
                        });          
                    }
             }).catch((error)=>{

             }) 
        },
         //删除回复
        deleteAnswer(item,index2){             
            this.$axios({
                method:'delete',
                url:this.domainName+ '/comment/'+ item.children[index2].id,
                params:{
                    type:2
                },
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
                // data: {commentId:}
            }).then((res)=>{
                if(res.data.code === 20000){
                        item.children.splice(index2, 1); 
                        this.commentNum -= 1;
                        this.$message({
                        message: '删除成功',
                        type: 'success'
                    });          
                }
            }).catch((error)=>{

            }) 
        },
    }
}
</script>

<style scoped >

    .font-em{
       font-size: 14px;
  color: #C1C1C1;
  line-height:14px;
  font-weight:500;
    }
    .comment{
         text-align: left;
        margin-top: 20px;
    }
    /*评论人的头像*/
    .comment-head{
    width:50px;
    height:50px;
    
float: left;
    
    }
    .comment-head img{
   max-width: 50px;  
    border-radius:50%;


  
    }
     /*评论区的内容*/
    .comment-content{
        margin-left: 60px;
    }
    .commentuser-margin-bottom{
        margin-bottom: 20px;
    }
    .commentuser-margin-right{
        margin-right: 24px;
    }
    .comment-main{
        margin-top: 24px;

      
    }
    .answear-style{
       
        margin-bottom: 20px;
        margin-left: 60px;
       
        
    }
    .margin-left-style{
            margin-left: 30px;
        }
    .margin-bottom-16{
        margin-bottom: 16px;
    }
    .comment-margin-right{
      margin-right: 20px;
    }
    /*浏览量，收藏量图标*/
.icon-img{
    margin-right: 8px;
    vertical-align:middle;
    margin-bottom: 4px;
}
.answear-style{
   
}
.flex-style{
        display: -webkit-flex; /* Safari */
    display:flex;
    justify-content:space-between;
    width: 20%
}
.anwser-head{
    margin-right: 20px
}
.line{
    
 padding: 2px;
    border-bottom: 1px dashed transparent;
    background: linear-gradient(white,white) padding-box,
    repeating-linear-gradient(-45deg,#ccc 0, #ccc 0.65em,white 0,white 1.35em);
}

.null-comment{
    display: inline-block;
    height: 700px;
    width: 100%;
    text-align: center
  
}
.null-comment-p{
    margin-top: 50px;
}
</style>
