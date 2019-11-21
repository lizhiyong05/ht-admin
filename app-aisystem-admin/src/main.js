sessionStorage.clear(); // 进入页面清空session
setInterval( ()=> {
    sessionStorage.clear(); // 5分钟定时清空session
},1000*60*5);
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/assets/css/common.css'
import '@/assets/css/config.css'
import '@/assets/icon/iconfont.css'
// 富文本编辑器
import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);

import htmlToPdf from '@/assets/js/htmlTopdf'
Vue.use(htmlToPdf);

import Print from '@/assets/js/print' // 引入附件的js文件
Vue.use(Print) // 注册


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
