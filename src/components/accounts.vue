<template>
  <div class="mask">
    <div class="right-block">
      <div @click="close()" class="btn-shutdown">
        <shutdown width="30" height="30"></shutdown>
      </div>

      <div class="title">
        <span>My Relations</span>
      </div>
      <div class="alert-info">
        There is a 1~3 minute delay in data updates.
      </div>
      <div class="relations-list">
        <template v-if="relations.length === 0">
          <div class="empty-data">Empty data.</div>
        </template>
        <template v-else>
          <div
            class="relation-item"
            :class="{ active: loginId === relationItem.id }"
            v-for="relationItem in relations"
            :key="relationItem.id"
            @click="switchLoginId(relationItem.id)"
          >
            <div class="relation-id">RELATION#{{ relationItem.id }}</div>
            <div class="relation-info">
              <span class="follow-count">
                <span class="value">{{ relationItem.followCount }}</span
                >Following
              </span>
              <span class="followed-count">
                <span class="value">{{ relationItem.followedCount }}</span
                >Followers
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { mapState, mapMutations } from "vuex";
import Shutdown from "@/components/shutdown";

export default {
  components: {
    Shutdown,
  },
  data() {
    return {
      relations: [],
    };
  },
  computed: {
    ...mapState(["address", "isLogin", "loginId"]),
  },
  methods: {
    ...mapMutations(["submitLoginId", "switchShowAccounts"]),
    close() {
      this.switchShowAccounts(false);
    },
    switchLoginId(id) {
      this.submitLoginId(id);
      this.close();
      if (this.$route.name !== "AccountDetail") {
        this.$router.push({ name: "AccountDetail", params: { id: id } });
      } else {
        this.$message.success("Active #" + id);
      }
    },
  },
  apollo: {
    myRelations: {
      query: gql`
        query($owner: String!) {
          myRelations: peoples(
            first: 100
            orderBy: id
            orderDirection: asc
            where: { owner: $owner }
          ) {
            id
            owner
            followCount
            followedCount
            profile
          }
        }
      `,
      pollInterval: 3000,
      manual: true,
      variables() {
        let owner = this.isLogin ? this.address : "0x0";
        return {
          owner: owner,
        };
      },
      result({ data }) {
        if (data) {
          this.relations = data.myRelations;
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10;
}

.right-block {
  position: fixed;
  z-index: 11;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  width: 400px;
  background-color: white;
  padding: 10px 15px 30px 15px;

  .btn-shutdown {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    width: 30px;
    height: 30px;
  }

  .title {
    width: 100%;
    height: auto;
    float: left;
    color: #000;
    font-size: 24px;
    font-weight: 800;
  }

  .alert-info {
    width: 100%;
    height: auto;
    float: left;
    font-size: 12px;
    color: orange;
    margin-bottom: 15px;
  }

  .relations-list {
    width: 100%;
    height: auto;
    float: left;

    .empty-data {
      width: 100%;
      height: auto;
      float: left;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      font-weight: 800;
      color: #000;
    }

    .relation-item {
      width: 100%;
      height: auto;
      float: left;
      margin-bottom: 15px;
      border: 4px solid rgba(#000, 0.2);
      padding: 15px;
      cursor: pointer;

      &:hover {
        background-color: rgba(#000, 0.02);
      }

      .relation-id {
        width: 100%;
        height: auto;
        float: left;
        margin-bottom: 15px;
        font-size: 24px;
        font-weight: 800;
        color: #000;
      }

      .relation-info {
        width: 100%;
        height: auto;
        float: left;
        font-size: 14px;
        color: rgba(#000, 0.5);

        .follow-count {
          margin-right: 10px;
        }

        .value {
          color: #000;
          margin-right: 5px;
          font-weight: 600;
        }
      }

      &.active {
        background-color: #000;
        .relation-id {
          color: white;
        }
        .relation-info {
          color: rgba(white, 0.5);

          .value {
            color: white;
          }
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media screen and (max-width: 400px) {
  .right-block {
    width: 100%;
  }
}
</style>
