import Vue from 'vue'
import Router from 'vue-router'
import bannerManage from '@/components/bannerManage'
import tagManage from '@/components/tagManage'
import workManage from '@/components/workManage'
import workDetail from '@/components/workDetail'
import userManage from '@/components/userManage'
import userDetail from '@/components/userDetail'
import userData from '@/components/userData'
import workData from '@/components/workData'
import login from '@/login'
import home from '@/home'

Vue.use(Router)

export default new Router({
	mode:'history',
	  routes: [
	    {
	    	path:'/',
	    	name:'login',
	    	component:login
	    },
	    {
	    	path:'/home',
	    	name:'home',
	    	component:home,
	    	children:[
	    		{
			      path: 'bannerManage',
			      name: 'bannerManage',
			      component: bannerManage
			    },
			    {
			      path: 'tagManage',
			      name: 'tagManage',
			      component: tagManage
			    },
			    {
			      path: 'workManage',
			      name: 'workManage',
			      component: workManage
			    },
			    {
			      path: 'workDetail',
			      name: 'workDetail',
			      component: workDetail
			    },
			    {
			      path: 'userManage',
			      name: 'userManage',
			      component: userManage
			    },
			    {
			      path: 'userDetail',
			      name: 'userDetail',
			      component: userDetail
			    },
			    {
			      path: 'userData',
			      name: 'userData',
			      component: userData
			    },
			    {
			      path: 'workData',
			      name: 'workData',
			      component: workData
			    },
			    {
		          path:'/home',
		          redirect:'/home/bannerManage' ,
		        }
	    	]
	    },
	    {
	    	path:'/',
	    	redirect:'/home/bannerManage'
	    },
	  ]
})
