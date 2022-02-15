<template>
  <div id="app">
    <div class="connect-wallet-box">
      <a class="btn-connect-wallet" href="javascript:void(0)" v-if="isLogin">
        {{ loginAddress }}
      </a>
      <a
        v-else
        class="btn-connect-wallet"
        href="javascript:void(0)"
        @click="connectWallet()"
        >ConnectWallet</a
      >
    </div>
    <div class="web-title">TheRelationDAO</div>
    <div class="desc">
      <p>Web3 Social Relationships.</p>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import config from '@/js/config';

export default {
  computed: {
    ...mapState(["isLogin", "address"]),
    loginAddress() {
      if (!this.isLogin) {
        return "";
      }
      return this.address.substr(0, 6) + "..." + this.address.substr(-4, 4);
    },
  },
  methods: {
    ...mapMutations(["login", "logout"]),
    async connectWallet() {
      const infuraId = process.env.VUE_APP_INFURA_ID;
      let providerOptions = {
        walletconnect: {
          package: WalletConnect,
          options: {
            infuraId,
          },
        },
      };
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: false,
        providerOptions,
      });
      try {
        let provider = await web3Modal.connect();

        provider.on("accountsChanged", (accounts) => {
          console.log(accounts);
        });
        provider.on("disconnect", (err) => {
          this.logout();
          this.$message.error(err.message);
        });

        const web3 = new Web3(provider);
        window.AppWeb3 = web3;
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const networkId = parseInt(await web3.eth.net.getId());

        if (networkId !== config.networkId) {
          this.$message.error("please switch mainnet");
          return;
        }

        this.login(address, web3, networkId);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
  },
};
</script>

<style lang="less">
* {
  box-sizing: border-box;
  font-family: Poppins, sans-serif;
}

body {
  background-color: #000;
}

.connect-wallet-box {
  width: 100%;
  height: auto;
  text-align: right;
  padding-top: 15px;
  padding-right: 30px;

  .btn-connect-wallet {
    display: inline-block;
    padding: 15px;
    border-radius: 15px;
    border: 4px solid white;
    color: white;
    font-size: 20px;
    font-weight: 800;
    text-decoration: none;

    &:hover {
      color: rgba(white, 0.8);
    }
  }
}

.web-title {
  width: 100%;
  height: auto;
  font-size: 56px;
  font-weight: 600;
  color: white;
  text-align: center;
  line-height: 200px;
}

.desc {
  width: 100%;
  height: auto;
  font-size: 20px;
  color: rgba(white, 0.9);
  text-align: center;
  line-height: 1.5;

  p {
    margin: 0;
  }
}

// @media screen and (max-width: 400px) {
//   #app {
//     width: 100%;
//     height: auto;
//     float: left;
//     margin: 0;
//   }
// }
</style>
