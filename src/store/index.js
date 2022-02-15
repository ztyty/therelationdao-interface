import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    address: null,
    web3: null,
    networkId: null,
    loginId: null,
    showAccounts: false,
  },
  mutations: {
    login(state, address, web3, networkId) {
      state.address = address;
      state.isLogin = true;
      state.web3 = web3;
      state.networkId = networkId;
    },
    switchShowAccounts(state, isShow) {
      state.showAccounts = isShow;
    },
    submitLoginId(state, id) {
      state.loginId = id;
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
