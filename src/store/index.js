import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    address: null,
    web3: null,
    networkId: null,
  },
  mutations: {
    login(state, address, web3, networkId) {
      state.address = address;
      state.isLogin = true;
      state.web3 = web3;
      state.networkId = networkId;
    },
    switchAddress(state, address) {
      state.address = address;
    },
    logout(state) {
      state.isLogin = false;
      state.web3 = null;
      state.networkId = null;
    },
  },
  actions: {},
  modules: {},
});
