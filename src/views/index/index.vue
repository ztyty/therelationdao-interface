<template>
  <div class="index-page">
    <vue-element-loading :active="loading" is-full-screen />

    <div class="mint-form">
      <div class="form-item">
        <div class="label">Name*</div>
        <div class="input">
          <input type="text" v-model="form.name" placeholder="Name" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">Avatar*</div>
        <div class="input">
          <a
            href="javascript:void(0)"
            class="btn-upload-image"
            @click="uploadImage()"
          >
            Upload Image
          </a>
          <div style="display: none">
            <input
              ref="avatar"
              type="file"
              accept="image/png,image/jpg,image/gif,image/jpeg"
              @change="uploadAvatar"
            />
          </div>
        </div>
        <div class="avatar" v-if="avatarUrl">
          <img :src="avatarUrl" width="100" height="100" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">Introduction*</div>
        <div class="input">
          <textarea
            v-model="form.introduction"
            rows="5"
            placeholder="Introduction"
          ></textarea>
        </div>
      </div>
      <div class="form-item">
        <div class="label">Twitter</div>
        <div class="input">
          <input type="text" v-model="form.twitter" placeholder="Twitter" />
        </div>
      </div>
      <div class="form-item">
        <a href="javascript:void(0)" class="btn-mint" @click="mint()">
          Mint a RELATION NFT
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import config from "@/js/config";
import TheRelationDao from "@/assets/contracts/TheRelationDao.json";

export default {
  data() {
    return {
      form: {
        name: null,
        introduction: null,
        avatar: null,
        twitter: null,
        version: "v1",
      },
      web3Instance: null,
      loading: false,
    };
  },
  computed: {
    ...mapState(["isLogin", "address"]),
    avatarUrl() {
      if (!this.form.avatar) {
        return null;
      }
      return config.ipfs.url + "/api/v0/cat?arg=" + this.form.avatar;
    },
  },
  methods: {
    ...mapMutations(["switchShowAccounts"]),
    getWeb3Instance() {
      if (!this.web3Instance) {
        this.web3Instance = new window.AppWeb3.eth.Contract(
          TheRelationDao,
          config.contract
        );
      }
      return this.web3Instance;
    },
    async mint() {
      if (!this.form.name) {
        this.$message.error("please input name");
        return;
      }
      if (!this.form.avatar) {
        this.$message.error("please upload avatar");
        return;
      }
      if (!this.form.introduction) {
        this.$message.error("please input introduction");
        return;
      }
      if (!this.isLogin) {
        this.$message.error("please connect wallet");
        return;
      }

      this.loading = true;

      // upload to ipfs
      let data = JSON.stringify({
        name: this.form.name,
        avatar: "ipfs://" + this.form.avatar,
        introduction: this.form.introduction,
        twitter: this.form.twitter,
        version: this.form.version,
      });
      let uploadRes = null;
      try {
        uploadRes = await this.$ipfs.add(data);
        let profileHash = "ipfs://" + uploadRes.path;
        console.log(profileHash);

        // save ethereum
        await this.getWeb3Instance()
          .methods.mint(profileHash)
          .send({
            from: this.address,
          });

        this.loading = false;

        this.form.name = null;
        this.form.avatar = null;
        this.form.introduction = null;
        this.form.twitter = null;

        this.$message.success("success");

        this.switchShowAccounts(true);
      } catch (e) {
        this.loading = false;
        console.log("error", e);
        this.$message.error("Failed");
        return;
      }
    },
    uploadImage() {
      this.$refs["avatar"].click();
    },
    uploadAvatar(e) {
      let files = e.target.files;
      if (!files[0].type.match(/.jpg|.png|.jpeg/i)) {
        this.$message.error("Wrong image format");
        return;
      }
      this.loading = true;
      this.$ipfs
        .add(files[0])
        .then((res) => {
          this.form.avatar = res.path;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("upload failed");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.index-page {
  width: 100%;
  height: auto;
  float: left;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 100px;
}

.mint-form {
  display: inline-block;
  width: 500px;
  height: auto;

  .form-item {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      width: 100%;
      height: auto;
      float: left;
      font-size: 18px;
      color: rgba(white, 0.5);
      font-weight: 800;
      margin-bottom: 15px;
      text-align: left;
    }

    .input {
      width: 100%;
      height: auto;
      float: left;

      input,
      textarea,
      .btn-upload-image {
        width: 100%;
        height: 60px;
        float: left;
        border: 4px solid rgba(white, 0.2);
        padding: 10px 15px;
        outline: none;
        background-color: rgba(#000, 0.5);
        color: white;
        font-size: 20px;
        font-weight: 800;
      }

      textarea {
        height: auto;
        resize: none;
      }

      .btn-upload-image {
        width: auto;
        text-decoration: none;
        color: rgba(white, 0.5);

        &:hover {
          color: white;
        }
      }
    }

    .avatar {
      width: 100%;
      height: auto;
      float: left;
      padding-top: 15px;
      text-align: left;

      img {
        border-radius: 50%;
      }
    }

    .btn-mint {
      width: 100%;
      height: 60px;
      float: left;
      border: 4px solid rgba(white, 0.2);
      padding: 10px 15px;
      outline: none;
      background-color: rgba(#000, 0.5);
      color: white;
      font-size: 20px;
      font-weight: 800;
      text-decoration: none;

      &:hover {
        color: rgba(white, 0.8);
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .mint-form {
    width: 100%;
  }
}
</style>
