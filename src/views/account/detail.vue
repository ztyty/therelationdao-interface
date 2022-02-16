<template>
  <div class="account">
    <vue-element-loading :active="loading" is-full-screen />

    <div class="profile-block" v-if="relation.name">
      <div class="info">
        <div class="avatar">
          <div class="avatar-block">
            <img :src="avatarUrl" width="100" height="100" />
          </div>
          <div class="options">
            <template v-if="!isSelf">
              <a
                href="javascript:void(0)"
                class="btn-follow"
                @click="submitFollow()"
                v-if="isFollow === false"
                >Follow</a
              >
              <a
                v-else
                href="javascript:void(0)"
                @click="cancelFollow()"
                class="btn-follow"
                >UnFollow</a
              >
            </template>
          </div>
        </div>
        <div class="name">{{ relation.name }}</div>
        <div class="relation-id">RELATION#{{ $route.params.id }}</div>
        <div class="introduction">{{ relation.introduction }}</div>
        <div class="follow">
          <span class="follow-count">
            <span class="value">{{ relation.followCount }}</span
            >Following
          </span>
          <span class="followed-count">
            <span class="value">{{ relation.followedCount }}</span
            >Followers
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Web3 from "web3";
import config from "@/js/config";
import TheRelationDao from "@/assets/contracts/TheRelationDao.json";

export default {
  data() {
    return {
      relation: {
        name: null,
        avatar: null,
        introduction: null,
        followCount: 0,
        followedCount: 0,
      },
      loading: false,
      isFollow: false,
      web3Instance: null,
      localWeb3Instance: null,
    };
  },
  computed: {
    ...mapState(["address", "loginId", "isLogin"]),
    avatarUrl() {
      if (!this.relation.avatar) {
        return null;
      }
      return config.ipfs.url + "/api/v0/cat?arg=" + this.relation.avatar;
    },
    isSelf() {
      return this.loginId === this.$route.params.id;
    },
  },
  watch: {
    isLogin(newVal) {
      if (newVal === false) {
        this.isFollow = false;
      } else {
        this.queryFollow();
      }
    },
    loginId(newVal) {
      if (newVal === null) {
        this.isFollow = false;
        return;
      } else {
        this.queryFollow();
      }
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    getWeb3Instance() {
      if (!this.web3Instance) {
        this.web3Instance = new window.AppWeb3.eth.Contract(
          TheRelationDao,
          config.contract
        );
      }
      return this.web3Instance;
    },
    getLocalWeb3Interface() {
      if (!this.localWeb3Instance) {
        let web3 = new Web3(config.provider);
        this.localWeb3Instance = new web3.eth.Contract(
          TheRelationDao,
          config.contract
        );
      }

      return this.localWeb3Instance;
    },
    async query() {
      let id = this.$route.params.id;
      this.loading = true;
      // query profile hash
      let profileHash = await this.getLocalWeb3Interface()
        .methods.tokenURI(id)
        .call();

      if (profileHash.substr(0, 7) !== "ipfs://") {
        this.loading = false;
        this.$message.error("Profile could not be parsed.");
        return;
      }

      let jsonContent = await this.$ipfs.cat(profileHash.substr(7));
      if (jsonContent.status !== 200) {
        this.loading = false;
        this.$message.error("network error");
        return;
      }

      let profileData = jsonContent.data;

      this.relation.name = profileData.name;
      this.relation.avatar = profileData.avatar.substr(7);
      this.relation.introduction = profileData.introduction;

      this.queryFollow();
      this.queryFollowCount();

      this.loading = false;
    },
    queryFollowCount() {
      this.getLocalWeb3Interface()
        .methods.query_follow_sum(this.$route.params.id)
        .call()
        .then((c) => {
          this.relation.followCount = c;
        });

      this.getLocalWeb3Interface()
        .methods.query_followed_sum(this.$route.params.id)
        .call()
        .then((c) => {
          this.relation.followedCount = c;
        });
    },
    queryFollow() {
      if (this.loginId === null) {
        return;
      }
      this.getLocalWeb3Interface()
        .methods.is_follow(this.loginId, this.$route.params.id)
        .call()
        .then((res) => {
          this.isFollow = res;
        });
    },
    submitFollow() {
      if (!this.isLogin) {
        this.$message.error("Please connect wallet");
        return;
      }
      if (this.loginId === null) {
        this.$message.error("Please choose one Active RELATION");
        return;
      }

      this.loading = true;
      this.getWeb3Instance()
        .methods.follow(this.loginId, this.$route.params.id)
        .send({
          from: this.address,
        })
        .then(() => {
          this.loading = false;
          this.queryFollow();
          this.queryFollowCount();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    cancelFollow() {
      if (!this.isLogin) {
        this.$message.error("Please connect wallet");
        return;
      }
      if (this.loginId === null) {
        this.$message.error("Please choose one Active RELATION");
        return;
      }
      this.loading = true;
      this.getWeb3Instance()
        .methods.unfollow(this.loginId, this.$route.params.id)
        .send({
          from: this.address,
        })
        .then(() => {
          this.loading = false;
          this.queryFollow();
          this.queryFollowCount();
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.account {
  width: 100%;
  height: auto;
  float: left;
  text-align: center;

  .profile-block {
    display: inline-block;
    width: 400px;
    height: auto;
    padding-top: 30px;
    padding-bottom: 100px;

    .info {
      width: 100%;
      height: auto;
      float: left;
      box-sizing: border-box;
      padding: 30px;
      border: 1px solid rgba(white, 0.1);
      border-radius: 2px;

      .avatar {
        width: 100%;
        height: auto;
        float: left;
        text-align: left;
        margin-bottom: 15px;
        display: flex;

        .avatar-block {
          width: 100px;
          img {
            border-radius: 50%;
          }
        }

        .options {
          flex: 1;
          text-align: right;

          .btn-follow {
            display: inline-block;
            width: 100px;
            height: 40px;
            border-radius: 20px;
            text-align: center;
            line-height: 40px;
            color: white;
            background-color: #000;
            border: 1px solid white;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            margin-top: 30px;

            &:hover {
              background-color: white;
              color: #000;
            }
          }
        }
      }

      .name {
        width: 100%;
        height: auto;
        float: left;
        font-size: 24px;
        font-weight: 800;
        color: white;
        text-align: left;
      }

      .relation-id {
        width: 100%;
        height: auto;
        float: left;
        font-size: 14px;
        color: rgba(white, 0.5);
        text-align: left;
        margin-bottom: 15px;
      }

      .introduction {
        width: 100%;
        height: auto;
        float: left;
        font-size: 14px;
        color: white;
        line-height: 20px;
        text-align: left;
        margin-bottom: 15px;
      }

      .follow {
        width: 100%;
        height: auto;
        float: left;
        font-size: 14px;
        color: rgba(white, 0.5);
        text-align: left;

        .follow-count {
          margin-right: 10px;
        }

        .value {
          color: white;
          margin-right: 5px;
          font-weight: 600;
        }
      }
    }
  }
}

@media screen and (max-width: 400px) {
  .profile-block {
    width: 100%;
  }
}
</style>
