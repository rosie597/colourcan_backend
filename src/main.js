// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import axios from 'axios'
import store from './store/store'
import {setCookie , getCookie, delCookie} from './cookie/cookie'
import $ from 'jquery'
import '../static/css/reset.css'

Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.domainName='/api'
// Vue.prototype.domainName='http://119.29.176.47:9001'
Vue.prototype.setCookie = setCookie;
Vue.prototype.getCookie = getCookie;
Vue.prototype.delCookie = delCookie;

Vue.use(Element)
Vue.use(Vuex)

//添加请求拦截器
axios.interceptors.request.use(config=>{
  if(getCookie('token2')){
    config.headers.Authorization = `Bearer ${getCookie('token2')}`;
    if(config.url != this.domainName+ '/admin/login'){
        let arr = getCookie('token2').split('.')[1];
      if (JSON.parse(atob(arr)).exp - (Date.parse(new Date()) / 1000) < 0) {
          alert('请重新登录');
          store.dispatch('exit'); 
          router.replace('/')
      } 
    }
  };    
  if(store.state.token){
      // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `Bearer ${store.state.token}`;
  }
  return config;
},err=>{
  //请求错误时做些事
  console.log('请求失败');
  return Promise.reject(err);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
