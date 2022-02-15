import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ipfs from './js/ipfs';

import Message from "vue-m-message";
import "vue-m-message/dist/index.css";
Vue.prototype.$message = Message;

import VueElementLoading from "vue-element-loading";
Vue.component("VueElementLoading", VueElementLoading);

Vue.config.productionTip = false

Vue.prototype.$ipfs = ipfs;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
