import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ipfs from "./js/ipfs";

import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";

import Message from "vue-m-message";
import "vue-m-message/dist/index.css";

import VueElementLoading from "vue-element-loading";

import config from "@/js/config";

Vue.prototype.$message = Message;

Vue.component("VueElementLoading", VueElementLoading);

Vue.config.productionTip = false;

Vue.prototype.$ipfs = ipfs;

// Apollo
Vue.use(VueApollo);
const apolloClient = new ApolloClient({
  uri: config.graph.url,
});
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
