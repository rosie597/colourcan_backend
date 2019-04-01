<template>
          <el-dialog  class='delte-style'
        title="作品下架" 
        :visible.sync="dialogVisible"
        width="30%" :show-close= false
        >
        <div class="dialog-downwork" >
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="下架原因"> 
                 <el-checkbox-group class="reson-box"
              v-model="form.type"
              >
              <el-checkbox v-for="item in reasons" :label="item" :key="item" name="type ">{{item}}</el-checkbox>
              <el-checkbox label="其他原因" name="type" @change="showOtherReasonFun"  > </el-checkbox>
              <el-input placeholder="请认真输其他入下架原因" v-model="form.othersValue" v-show="showOtherReason"></el-input>
             
            </el-checkbox-group>
            </el-form-item>
          </el-form>
         
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFun">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
</template>

<script>
export default {
    props:['dialogVisible','workId','index'],
    data(){
        return{
            //文章下架原因
            reasons:['含有低俗、暴力因素','含广告、商业等因素','侵权、侵犯隐私权及原创争议因素','存在危害平台安全因素','内容质量太低',],
            form: {
                type: [],
                othersValue:''
                },
                showOtherReason:false
        }
    },
    methods:{
         //取消
    cancelFun(){
        this.$emit('closeDeleteVisible', false);
      this.form.type = [];
      this.form.othersValue = '';
      this.showOtherReason = !this.showOtherReason;
    },
    submit(){
      // console.log(this.form.type.indexOf("其他原因"))
      if(this.form.type.length > 0){
         if(this.form.type.indexOf("其他原因") >= 0){
            if(this.form.othersValue == ''){
              this.$message.error('请认真输其他入下架原因')
           }else{
            this.form.type.push(this.form.othersValue)
             this.submitDeleteWork('a',this.form.type);
           }
         }else{
             this.submitDeleteWork('b',this.form.type);
         }
      }else{
        this.$message.error('请选择下架原因');
       
      }
    },
      submitDeleteWork(value){
        this.$axios({
          method:'delete',
          url:this.domainName + '/work/soldout/'+this.workId,
          headers:{
              'Content-Type': 'application/json;charset=UTF-8',
          },
          data:{
            reson:this.form.type.toString()
          }
              
        }).then((res)=>{
          if(res.data.code === 20000){
            this.$emit('closeDeleteVisible', false);
            this.form.type = [];
            this.form.othersValue = '';
            this.$message.success('下架成功');
            this.$emit('delteWorkManage',this.index)
            this.$emit('delteWorkDetail',this.index)
            this.showOtherReason = !this.showOtherReason;
          }
            
        }).catch((error)=>{
          // this.$message.error('下架失败，请重试')
          console.log(error)
        })
       },
        //选中其他原因
        showOtherReasonFun(value){
          // console.log(value)
          this.showOtherReason = value;
        },
    }
}
</script>

<style>
.delte-style{
    text-align: left
}
</style>
