<template>
    <div class="detail">
        <ul class="listMessage">
            <li style='margin-bottom: 12px'><h1>{{title}}</h1></li>
            <li style='margin-bottom: 8px'><em class="font-em">{{publishTime}}</em></li>
            <ul>
                <li><em class="font-em">{{tag | changeTag}}</em></li>
            </ul>
        </ul>
        <div class="content">
            <div v-if="workType === 1" v-html="content">
                     {{content}}
            </div>
                <div v-if="workType == 2|| workType == 3 "  class="content-img">
                    <div v-for="item in content" :key="item">
                        <img :src=item />
                    </div>
                    
                </div>
                
        </div>
    </div><!--作者信息和文章的阅读点赞情况-->
</template>

<script>

export default {
    props:['workId'],
    filters:{
        changeTag:function(value){
            // let array = value.split(',');
            return value.split(',').join('/');
        }
    },
    data(){
        return{
            userId:'',
            ownerId:'',
            title:'',
            content:'杯子寂寞，被倒进开水，滚烫的感觉，这就是恋爱的感觉。水变温了，杯子很舒服，这是生活感觉。水变凉了，杯子害怕，也许这就是失去感觉。水彻底的凉，杯子难受，把水倒出。杯子舒服了，但不小心掉在地上，摔成一片一片的，发现每一片上都有水的痕迹，知道心里还爱着水，想再爱一次，却不可能了。',
            tag:'',
            publishTime:'',
            workType:''
            
        }
    },
    created(){
        this.getDetail();
    },
    methods:{
         //获取文章页面
        getDetail(){
            this.$axios.get(this.domainName + '/work/'+this.workId,{
                // params:{
                // id: this.$route.query.recruitViperId//待问传过来的ID是
                // }
                 headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', 
                    }
             }).then((res)=>{
                 if(res.data.code === 20000){
                    //  console.log(res.data.data);
                    this.userId = res.data.data.work.userId,//作者ID
                    this.ownerId = res.data.data.work.id;//作品的ID
                    this.title = res.data.data.work.title;//作品标题
                    // this.content = res.data.data.work.content;//作品内容
                    this.tag = res.data.data.work.tag;//作品标签
                    this.publishTime = res.data.data.work.publishTime;//发布时间
                     this.workType =  res.data.data.work.type;
                     if(!res.data.data.work.content){
                         this.workType = 1
                         this.content='没有东西';
                     }else{
                        if(this.workType === 1){
                                this.content = res.data.data.work.content;//作品内容
                            }else{
                                if(res.data.data.work.content.split(',')){
                                    
                                    this.content = res.data.data.work.content.split(',');
                                }else{
                                    this.content.push(res.data.data.work.content);
                                }
                            }
                        }
                 }
                 
             }).catch((error)=>{

             })
        },
        
    }
}
</script>

<style  scoped>


    .font-em{
        font-size: 14px;
  color: #C1C1C1;
  line-height:14px;
  font-weight:500;
    }
    .listMessage{
       
    text-align: left;

    }
    .detail{
        padding: 20px;
    }
    .content{
    text-align: left;
        
        margin-top: 20px;
    }
    .content-img img{
        max-width: 100%;
        margin-bottom: 20px;
    }
</style>
