import Vue from 'vue'
import Vuex from 'vuex'
import {setCookie , getCookie, delCookie} from '../cookie/cookie'
// import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		userData:'',
		token:'',
		workmanage:{}
	},
	mutations:{//第一个参数是state
		clearData(state){
			state.token=null
			state.userData=null
		},
		login(state,{token,userData}){
			state.token=token
			state.userData=userData
		},
		setworkManage(state,data){
			state.workmanage = data;
		}
	},
	actions:{//第一个参数是{commit}传递参数
		exit({commit}){
			commit("clearData")
			delCookie('token2')
			delCookie('userData2');
		},
		login({commit},{token,userData}){
			setCookie('userData2',userData)
			setCookie('token2',token)
			commit('login',{token,userData})
		},
	},
	getters:{
		getToken:(state)=>{
			return state.token
		},
		getWorkmanage:(state)=>{
			return state.workmanage
		}
	}
})