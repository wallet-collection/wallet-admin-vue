import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from "./filters/index"; // 全局过滤器
import i18n from './locale/index.js'
import "./role"; // 权限

import IconSvg from "./components/common/IconSvg.vue"; // svg组件

// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);

Vue.config.productionTip = false
/**
 * element
 * */
import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
