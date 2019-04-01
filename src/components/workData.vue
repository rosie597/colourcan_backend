<template>
  <div class="mk-data">
    <section class="data-num">
      <div class="header">
        <h4>创作数据</h4>
      </div>
      <div class="data-num-main" v-loading="workLoading">
        <template v-if="cards.length">
          <data-card v-for="(card, index) of cards" :workData="card" :key="index"></data-card>
        </template>
      </div>
    </section>
    <line-chart :data="chartLineData" class="user-line-chart"></line-chart>
    <section class="creator-data">
      <div class="header">
        <h4>创作者数据</h4>
      </div>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-select v-model="sortBy" clearable placeholder="选择排序">
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleGetKeyword">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table
        :data="users"
        highlight-current-row
        v-loading="listLoading"
        style="width: 100%;"
        :default-sort="tableAttribute.sortMethod"
        ref="singleTable"
      >
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="60" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" class="avatar">
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="100" align="center"></el-table-column>
        <el-table-column prop="popularity" label="人气" width="85" align="center"></el-table-column>
        <el-table-column prop="visits" label="浏览" width="85" align="center"></el-table-column>
        <el-table-column prop="likeCount" label="点赞" width="85" align="center"></el-table-column>
        <el-table-column prop="favouriteCount" label="收藏" width="85" align="center"></el-table-column>
        <el-table-column prop="fansCount" label="粉丝" width="85" align="center"></el-table-column>
        <el-table-column prop="workCount" label="总投稿数" width="85" align="center"></el-table-column>
        <el-table-column prop="createTime" label="上次投稿时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <a class="to-detail" href="#" @click="handleToDetail(scope.row)">查看详情</a>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="prev, pager, next, total"
          :total="total"
          :current-page="page"
        ></el-pagination>
      </el-col>
    </section>
  </div>
</template>

<script>
import DataCard from "./dataCenter/components/DataCard";
import LineChart from "./dataCenter/components/LineChart";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import axios from "axios";

export default {
  name: "workData",
  components: {
    DataCard,
    LineChart
  },
  data() {
    return {
      cards: [],
      workLoading: false,
      chartLineData: {
        tabs: ["新闻投稿数", "总投稿数"],
        key: 6,
        url: "/api/data/workTrend"
      },
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      pageSize: 10,
      listLoading: false,
      listLoading: false,
      sortBy: "",
      sortOptions: [
        {
          value: "popularity",
          label: "人气数"
        },
        {
          value: "visits",
          label: "浏览数"
        },
        {
          value: "likeNum",
          label: "点赞数"
        },
        {
          value: "favouriteNum",
          label: "收藏数"
        },
        {
          value: "fans",
          label: "粉丝数"
        }
      ],
      tableAttribute: {
        sortMethod: {}
      },
      originData: [],
      filteredData: []
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers()
    },
    //获取用户列表
    getUsers() {
      this.listLoading = true;
      axios
        .get("/api/user/search", {
          params: {
            pageNum: this.page,
            pageSize: this.pageSize
          }
        })
        .then(this.handleGetUsers);
    },

    handleGetKeyword() {
      if(!this.filters.name) {
        this.handleChangeSortBy();
        return;
      }
      this.listLoading = true;
      axios
        .get("/api/user/search", {
          params: {
            pageNum: this.page,
            pageSize: this.pageSize,
            keyword: this.filters.name
          }
        })
        .then(this.handleGetUsers);
    },

    handleChangeSortBy() {
      this.listLoading = true;
      axios
        .get("/api/user/search", {
          params: {
            pageNum: this.page,
            pageSize: this.pageSize,
            type: this.sortBy
          }
        })
        .then(this.handleGetUsers);
    },

    handleGetUsers(res) {
      if(res.status===200 && res.data.data) {
        const data = res.data.data;
        this.users = [];
        this.total = data.total;
        this.users = data.rows.map(item => {
          item.createTime = this.fmtDate(item.createTime);
          return item;
        });
        this.listLoading = false;
      }
    },

    fmtDate(obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return (
        y +
        "-" +
        m.substring(m.length - 2, m.length) +
        "-" +
        d.substring(d.length - 2, d.length)
      );
    },

    handleToDetail(row) {
      this.$router.push({
      	path: "/userDetail",
        name: "userDetail",
        query: {
          user: row    
        }
      });
    },

    handleGetWorkData(res) {
      if (res.status === 200 && res.data.data) {
        let data = res.data.data;
        this.cards.push(data.newData);
        this.cards[0].title = "新增投稿数";
        let obj = data.allData;
        obj.title = "总投稿数";
        this.cards.push(obj);
        this.workLoading = false;
      }
    }
  },
  mounted() {
    this.getUsers();
    // 获取投稿数据
    this.workLoading = true;
    axios.get("/api/data/work").then(this.handleGetWorkData);
  },
  watch: {
    sortBy(newVal, oldVal) {
      if (newVal) {
        this.handleChangeSortBy()
      } else {
        this.getUsers()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mk-data {
  background: #f6f8f9;

  > section {
    min-width: 959px;
    margin-bottom: 20px;
    background-color: #fff;
  }

  .data-num {
    min-width: 959px;
    padding: 20px 0 40px 50px;

    .data-num-main {
      display: flex;
      justify-content: space-around;
    }
  }

  .creator-data {
    padding: 20px 0 40px 50px;
    box-sizing: border-box;
    overflow: hidden;

    .toolbar {
      display: flex;
      margin: 10px 0;

      .el-select {
        width: 105px;
      }

      .el-form {
        margin-left: 20px;

        .el-form-item {
          margin: 0;

          & + .el-form-item {
            margin-left: -6px;
          }
        }
      }
    }

    .to-detail {
      color: #409eff;
      text-decoration: none;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .el-pagination {
      margin: 20px auto;
    }
  }

  .header {
    h4 {
      margin: 0;
      margin-bottom: 15px;
      color: #333;
      text-align: left;
    }
  }
}
</style>
