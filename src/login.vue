<template>
    <div class="login-container">
        <el-form :model="ruleForm2" :rules="rules2" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中" ref="ruleForm2"label-position="left" label-width="0px" class="demo-ruleForm login-page">
            <h3 class="title">心芝兰后台管理系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text"  prefix-icon="el-icon-edit"
                    v-model="ruleForm2.username" 
                    auto-complete="off" 
                    placeholder="用户名"style="width:90%;"
                ></el-input>
            </el-form-item>
                <el-form-item prop="password">
                    <el-input :type="passwordType"  prefix-icon='el-icon-setting'
                        v-model="ruleForm2.password" 
                        auto-complete="off" 
                        placeholder="密码" @keyup.enter.native="login"style="width:90%;"
                    >
                     <i slot="suffix" v-if="HidePasssword" class="el-input__icon el-icon-view" @mousedown="changePass('show')" @mouseup="changePass('hide')" style="cursor:pointer;"></i>
                    </el-input>
                </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:90%;" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            passwordType:'password',
            //隐藏密码
            HidePasssword:true,//
            fullscreenLoading: false,
            ruleForm2: {
                username: '',
                password: '',
            },
            rules2: {
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
            checked: false
        }
    },
    created(){
        // this.delCookie('token')
    },
    methods: {
        login(){
            if(this.ruleForm2.username !== '' && this.ruleForm2.password !== ''){
                this.toLogin();
            }
        },
        toLogin:function() {
            let that = this;
            this.fullscreenLoading = true;
            this.$axios({
				method:'post',
				url:that.domainName+'/admin/login',
				data:{
					username:this.ruleForm2.username,
					password:this.ruleForm2.password
				},
				headers: {
					'Content-Type': 'application/json'
				}  
			}).then(res=>{
                this.fullscreenLoading = false;
				if(res.data.code === 20000){ 
                    var token=res.data.data.token
                    var userData=res.data.data.admin.username
                    that.$store.dispatch('login',{token,userData});
                    this.$router.push('/Home');
				}else{
                    that.$message.error(res.data.message)
                }
			}).catch(error=>{   
                console.log(error)
                this.$message.error('网络错误');
                this.fullscreenLoading = false;
                this.$router.push('/Home');
			})
        },
        changePass(name){
            if(name === 'show'){
                this.passwordType = 'text'
            }
            if(name === 'hide'){
                this.passwordType = 'password'
            }
        }		
    }
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 180px auto;
    width: 450px;
    padding: 45px 30px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #eee;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>