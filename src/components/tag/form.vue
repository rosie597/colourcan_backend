<template>
	<div class="form">
		<div class="btnCtn">
            <el-button type="primary" class='btn' @click='integrate'>整合标签</el-button>
            <el-button type="primary" class='btn' @click='addTag'>新增标签</el-button>
        </div>
		<el-table :data="tableData.rows" border style="width: 100%" @selection-change="select">
	          <el-table-column type="selection" width="80"></el-table-column>
	          <el-table-column fixed type='index' label='序号' width="150"></el-table-column>
	          <el-table-column fixed prop='name' label='标签名' width="300"></el-table-column>
	          <el-table-column fixed prop='count' label='数量' width="150"></el-table-column>
	          <el-table-column fixed prop='updateTime' label='修改时间' width="350"></el-table-column>
	          <el-table-column  label="操作">
	            <template slot-scope="scope">
	              <el-button @click="editTag(scope.row)" type="text" size="small">编辑</el-button>
	              <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, tableData.rows)">删除</el-button>
	            </template>
	          </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="tableData.total" @current-change='pageChange' :page-size="pagesize" @size-change="handleSizeChange" :current-page="currentPage" style='margin-top: 20px;'></el-pagination>
	</div>
</template>
<script>
	export default{
		name:'tagForm',
		props:{
			tableData:{
				type:Object,
				required:true
			}
		},
		data(){
			return{
				currentPage:1,
				pagesize:10,
				selected:[],
			}
		},
		methods:{
			pageChange(page){
				this.currentPage=page
				console.log(page)
				this.$emit('listenChange',page)
			},
			handleSizeChange: function (size) {
                this.pagesize = size;//当前页面数据条目
        	},
        	 //删除
	    deleteRow(index, rows) {
	    	console.log(rows)
	    	var that=this
	    	this.$confirm('确定要删除banner吗？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	//确定删除
	        	that.$axios({
	        		method:'delete',
	        		url:that.domainName+'/tag/'+rows[index].id
	        	}).then((res)=>{
	        		console.log(res)
	        		if(res.data.code==20000){
	        			rows.splice(index, 1);
				          this.$message({
				            type: 'success',
				            message: '删除成功!'
				         });
	        		}else{
	        			this.$message.error('删除失败！')
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
	        //选择条目
	        select(val){
	        	this.selected=val;
	        },
	        //整合标签
	        integrate(){
	        	var selected=this.selected,names=''
	        	if(selected.length<2){
	        		this.$message({
			            type: 'warning',
			            message: '选择标签不少于两个'
			        });  
	        	}else{
	        		for(let i in selected){
		        		names=names+selected[i].name+','
		        	}
		        	var _names=names.substr(0,names.length-1)
		        	console.log(_names)
		        	this.$emit('listenShow','整合标签',_names,selected)
		        	console.log('forms',selected)
	        	}
	        },
	        //增加标签
	       addTag(){
	       		this.$emit('listenShow','新增标签')
	       },
	       //编辑标签
	       editTag(item){
	       		this.$emit('listenShow','编辑标签',item)
	       },
		}
	}
</script>
<style scoped>
	.form{
		margin-top: 60px;
	}
	.btnCtn{
	    position: absolute;
	    top: 0px;
	    right: 0px;
	    z-index: 99;
    }
</style>