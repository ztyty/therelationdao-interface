<template>
  <div id="app">
    <div class="connect-wallet-box">
      <a
        class="btn-connect-wallet"
        href="javascript:void(0)"
        @click="switchShowAccounts(!showAccounts)"
        v-if="isLogin"
      >
        My Relations
      </a>
      <a
        v-else
        class="btn-connect-wallet"
        href="javascript:void(0)"
        @click="connectWallet()"
        >ConnectWallet</a
      >
    </div>
    <div class="web-title">
      <img
        @click="goIndex()"
        src="@/assets/images/logo.png"
        width="400"
        height="100"
      />
    </div>
    <div class="desc">
      <p>On-chain Social Relationships.</p>
    </div>
    <router-view />

    <div class="faq-box">
      <div class="faq">
        <div class="faq-item">
          <div class="title">What is TheRelationDAO?</div>
          <div class="content">
            TheRelationDAO is committed to building an on-chain transparent
            social network relationship.
          </div>
        </div>
        <div class="faq-item">
          <div class="title">
            Background
          </div>
          <div class="content">
            Inspired by TheOpenDAO, I began to realize the value of user data on
            the chain. As one of the essential activities of our daily life,
            social networking, its social network relationships are also very
            valuable! TheRelationDAO is committed to building an on-chain
            transparent social network relationship. Everyone can make further
            development on the basis of the social network relationship provided
            by TheRelationDAO to give full play to the value of the social
            network relationship on the chain, allowing Web3 users to enjoy
            social networking and gain additional economic benefits!
          </div>
        </div>
        <div class="faq-item">
          <div class="title">Implementation</div>
          <div class="content">
            Every user can mint his own NFT in TheRelationDAO. The NFT includes
            basic information such as name, avatar, introduction, and Twitter.
            This basic information is stored on the IPFS network. After
            obtaining their own NFTs, users can use their own NFTs to follow
            other people's NFTs, and others can use their own NFTs to follow
            your NFTs, thus forming a huge on-chain social network.
          </div>
        </div>
      </div>
    </div>

    <div class="contact">
      <a href="https://twitter.com/TheRelationDAO">Twitter</a> |
      <a
        href="https://etherscan.io/address/0x72097604950e50b35825f69e2b94f0a5639db0d0"
        >Contract</a
      >
    </div>

    <accounts v-if="showAccounts"></accounts>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import config from "@/js/config";
import Accounts from "@/components/accounts";

export default {
  components: {
    Accounts,
  },
  computed: {
    ...mapState(["isLogin", "address", "showAccounts"]),
    loginAddress() {
      if (!this.isLogin) {
        return "";
      }
      return this.address.substr(0, 6) + "..." + this.address.substr(-4, 4);
    },
  },
  methods: {
    ...mapMutations([
      "login",
      "logout",
      "switchShowAccounts",
      "switchAddress",
      "submitLoginId",
    ]),
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
          if (accounts.length === 0) {
            this.logout();
          } else {
            let curAccount = accounts[0];
            if (curAccount !== this.address) {
              this.switchAddress(curAccount);
            }
          }
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
    goIndex() {
      if (this.$route.name !== "Index") {
        this.$router.push({ name: "Index" });
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
  width: 100%;
  height: auto;
  float: left;
  background-color: #000;
}

#app {
  width: 100%;
  height: auto;
  float: left;
}

.connect-wallet-box {
  width: 100%;
  height: auto;
  text-align: right;
  padding-top: 15px;
  padding-right: 30px;

  .btn-connect-wallet {
    display: inline-block;
    padding: 10px 15px;
    border-radius: 10px;
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
  padding-top: 50px;

  img {
    cursor: pointer;
  }
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

.faq-box {
  width: 100%;
  height: auto;
  float: left;
  text-align: center;
  padding-top: 100px;

  .faq {
    display: inline-block;
    width: 500px;
    height: auto;

    .faq-item {
      width: 100%;
      height: auto;
      float: left;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }

      .title {
        width: 100%;
        height: auto;
        float: left;
        text-align: left;
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin-bottom: 15px;
      }

      .content {
        width: 100%;
        height: auto;
        float: left;
        text-align: left;
        font-size: 14px;
        color: rgba(white, 0.8);
      }
    }
  }
}

.contact {
  width: 100%;
  height: auto;
  float: left;
  padding-top: 50px;
  padding-bottom: 50px;
  text-align: center;
  color: rgba(white, 0.1);

  a {
    color: rgba(white, 0.5);
    text-decoration: underline;
    font-size: 15px;
    font-weight: 800;

    &:hover {
      color: white;
    }
  }
}

@media screen and (max-width: 500px) {
  .connect-wallet-box {
    padding-right: 15px;
  }

  .faq-box {
    width: 100%;
  }
}
</style>
