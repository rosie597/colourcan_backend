<template>
  <div class="banner">
  	<h1 style="text-align: left;margin-bottom: 80px;">banner管理</h1>
  	<el-button type="primary" class='btn' @click="showBox('新增banner')">新增banner</el-button>
    <el-table :data="tableData" border row-key="id" align="left">
    	<el-table-column fixed type='index' label="序号" width="100" :sortable='true'></el-table-column>
	     <el-table-column v-for="(item, index) in col":key="`col_${index}`" :prop="dropCol[index].prop" :label="item.label" width="300"> 
	     	<template slot-scope="scope">
		        <img v-if="dropCol[index].prop=='photo'" :src="scope.row.url" alt="" style="width: 200px;">
		        <span v-if="dropCol[index].prop!='photo'">{{scope.row[dropCol[index].prop]}}</span>
			</template>
	     </el-table-column>
	     <el-table-column fixed='right' label="操作" >
		      <template slot-scope="scope">
		        <el-button @click="showBox('编辑banner',scope.row)" type="text" size="small">编辑</el-button>
		        <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">删除</el-button>
		      </template>
		  </el-table-column>
    </el-table>

    <!-- 新增 -->
    <div class="greyCtn" v-if='isBoxShow' id='greyCtn'>
    	<div class="box">
    		<div class="top">
    			<span style="float: left">{{operateName}}</span>
    			<i class="el-icon-close" @click='closeBox'></i>
    		</div>
    		<div class="middle">
    			<form>
    				<div class="item">
    					<span>标题</span>
	    				<el-input v-model="formData.title" placeholder="请输入标题" style='width:80%;'></el-input>
    				</div>
    				<div class="item">
    					<span>上传图片</span>
    					<el-upload style="border: 1px dashed #d9d9d9;border-radius: 6px;margin-right:35%;" class="avatar-uploader" action="http://www.colourcan.net/api/qiniu/upload" :show-file-list="false":on-success="handleImgSuccess":before-upload="beforeImgUpload">
	    					<img v-if="imageUrl" :src="imageUrl" class="avatar">
	    					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
    				</div>
    				<div class="item">
    					<span>跳转地址</span>
    					<el-input type="textarea":rows="2"placeholder="请输入跳转地址,如：http://www.baidu.com"v-model="formData.url" style='width:80%;'></el-input>
    				</div>
    			</form>
    		</div>
    		<div class="foot">
    			<el-button @click='closeBox'>取消</el-button>
    			<el-button type="primary" @click='confrim'>确定</el-button>
    		</div>
    	</div>
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import $ from 'jquery'
export default {
	name:'bannerManage',
  data() {
    return {
    	isBoxShow:false,
    	operateName:'新增banner',
    	imageUrl: '',
    	formData:{
    		title:'',
    		url:''
    	},
    	_type:'',
    	editId:'',
      col: [
        {
        	label:'标题',
        	prop:'title'
        },
        {
          label: '图片',
          prop: 'photo'
        },
        {
          label: '地址',
          prop: 'url'
        }
      ],
      dropCol: [
        {
        	label:'标题',
        	prop:'title'
        },
        {
          label: '图片',
          prop: 'photo'
        },
        {
          label: '地址',
          prop: 'redirectUrl'
        },
      ],
      tableData:[]
    }
  },
  mounted() {
    this.rowDrop()
    this.getBanner()
  },
  methods: {
  		getBanner(){
  			var that=this
  			this.$axios({
  				method:'get',
  				url:that.domainName+'/banner'
  			}).then((res)=>{
  				if(res.data.code==20000){
  					that.tableData=res.data.data
  				}else{
  					that.$message.error('列表请求失败')
  				}
  			}).catch((err)=>{
  				console.log(err)
  				that.$message.error('网络错误，列表请求失败')
  			})
  		},
	    //行拖拽
	    rowDrop() {
		      const tbody = document.querySelector('.el-table__body-wrapper tbody')
		      const that = this
		      Sortable.create(tbody, {
		        onEnd({ newIndex, oldIndex }) {
		        	const tableData2=that.tableData.slice(0)
		        	const currRow = tableData2.splice(oldIndex, 1)[0]
		        	tableData2.splice(newIndex, 0, currRow)
		        	for(let i in tableData2){
		        		tableData2[i].weight=tableData2.length-i
		        	}
		        	that.$axios({
		        		method:'put',
		        		url:that.domainName+'/banner/weight',
		        		header:{
		        			'Content-Type':'application/json'
		        		},
		        		data:{
		        			bannerList:tableData2
		        		}
		        	}).then((res)=>{
		        		if(res.data.code==20000){
		        			that.$message({
		        				type:'success',
		        				message:'排序成功'
		        			})
		        			that.tableData=tableData2
		        		}else{
		        			that.$message.error('排序失败')
		        		}
		        	}).catch((err)=>{
		        		console.log(err)
		        		that.$message.error('排序失败')
		        	})
		        }
		      })
	    },
	    //显示编辑窗口
	    showBox(type,res){
	    	this._type=type
	    	this.isBoxShow=true
	    	console.log(window.innerHeight,window.innerWidth)
	    	document.body.scrollTop = document.documentElement.scrollTop = 0;
			var t1=setTimeout(()=>{
				let el=document.getElementById('greyCtn');
				el.style.height=window.innerHeight+"px";
				el.style.width=window.innerWidth+"px";
			},10)
			this.operateName=type
			$('body').css('overflow','hidden');
			if(res){
				this.formData.title=res.title
				this.imageUrl=res.url
				this.editId=res.id
			}
	    },
	    confrim(){
	    	var title=this.formData.title
	    	var url=this.formData.url
	    	var id=this.editId
	    	var that=this
	    	switch(this._type){
	    		case '新增banner':{
	    			if(!title){
	    				that.$message.error('请补充标题')
	    			}else{
	    				this.$axios({
	    				method:'post',
	    				url:that.domainName+'/banner',
	    				data:{
	    					title:title,
	    					url:this.imageUrl,
	    					redirectUrl:url
	    				},
	    				header:{
	    					'Content-Type':	'application/json'
	    				}
	    			}).then((res)=>{
	    				console.log('新增',res)
	    				if(res.data.code==20000){
	    					that.$message({
	    						type:'success',
	    						message:'新增成功'
	    					})
	    					that.closeBox()
	    					that.getBanner()
	    				}else{
	    					that.$message.error(res.data.message+'新增失败')
	    				}
	    			}).catch((err)=>{
	    				console.log('新增',err)
	    				that.$message.error('新增失败')
	    			})
	    			}
	    		}break;
	    		case '编辑banner':{
	    			if(!title||!url||!id){
	    				that.$message.error('请补充完整信息')
	    			}else{
		    			this.$axios({
		    				method:'put',
		    				url:that.domainName+'/banner',
		    				data:{
		    					title:title,
		    					url:url,
		    					id:id
		    				}
		    			}).then((res)=>{
		    				if(res.data.code==20000){
		    					that.$message({
		    						type:'success',
		    						message:'编辑成功'
		    					})
		    					that.closeBox()
		    					that.getBanner()
		    				}else{
		    					that.$message.error(res.data.message+'编辑失败')
		    				}
		    				console.log('编辑',res)
		    			}).catch((err)=>{
		    				console.log('编辑',err)
		    				that.$message.error('编辑失败')
		    			})
			    	}
	    		}break;
	    	}
	    },
	    closeBox(){
	    	this.isBoxShow=false;
	    	this.formData={title:'',url:''};
	    	this.imageUrl=''
	    	this.editId=''
	    	$('body').css('overflow','auto');
	    },
	    deleteRow(index, rows) {
	    	console.log(rows[index].id)
	    	var that=this
	    	this.$confirm('确定要删除banner吗？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	//确定删除
	        	that.$axios({
	        		method:'delete',
	        		url:that.domainName+'/banner/'+rows[index].id
	        	}).then((res)=>{
	        		console.log(res)
	        		if(res.data.code==20000){
	        			rows.splice(index, 1);
				          this.$message({
				            type: 'success',
				            message: '删除成功!'
				         });
	        		}else{
	        			this.$message.error(res.data.message+'删除失败！')
	        		}
	        	}).catch((err)=>{
	        		console.log(err)
	        		this.$message.error('网络错误,删除失败！')
	        	})
	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '已取消'
	          });          
	        });
        },
	     handleImgSuccess(res, file) {
	        this.imageUrl = res.data;
	      },
	      beforeImgUpload(file) {
	        const isJPG = file.type === 'image/jpeg';
	        const isLt2M = file.size / 1024 / 1024 < 50;

	        if (!isJPG) {
	          this.$message.error('上传头像图片只能是 JPG 格式!');
	        }
	        if (!isLt2M) {
	          this.$message.error('上传头像图片大小不能超过 50MB!');
	        }
	        return isJPG && isLt2M;
	      },
    }
}
</script>
<style scoped>
	.banner{
		padding-bottom: 450px;
	}
	.item{
		display: flex;
		flex-direction: row;
		width: 80%;
		justify-content: space-between;
		margin: 0 auto;
		align-items: center;
		padding: 10px;
	}
	.btn{
		position: absolute;
		top: 150px;
		right: 50px;
	}
	.greyCtn{
		background-color: rgba(127, 127, 127, 0.3);
		z-index: 999;
		position: absolute;
		top: 0;
		left: 0;
		width:100%;
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
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
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