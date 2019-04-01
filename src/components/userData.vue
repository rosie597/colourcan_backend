<template>
  <div class="user-data">
    <section class="data-num">
      <div class="header">
        <h4>用户数据</h4>
      </div>
      <div class="data-num-main" v-loading="userLoading">
        <template v-if="cards.length">
          <data-card v-for="(card, index) of cards" :workData="card" :key="index"></data-card>
        </template>
      </div>
    </section>
    <line-chart :data="userChartLineData" class="user-line-chart"></line-chart>
    <section class="pie-chart">
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="grid-content" id="genderChartPie"></div>
          <pie-legend v-if="isGetGenderPieChartData" :data="genderPieChartData"></pie-legend>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" id="browserChartPie"></div>
          <pie-legend v-if="isGetBrowsePieChartData" :data="browserPieChartData"></pie-legend>
        </el-col>
      </el-row>
    </section>
    <line-chart :data="browserChartLineData" class="browser-line-chart"></line-chart>
  </div>
</template>

<script>
import echarts from "echarts";
import DataCard from "./dataCenter/components/DataCard";
import PieLegend from "./dataCenter/components/PieLegend";
import LineChart from "./dataCenter/components/LineChart";
import axios from 'axios'

export default {
  name: "userData",
  components: {
    DataCard,
    PieLegend,
    LineChart
  },
  data() {
    return {
      // 1用户数据
      cards: [],
      userLoading: false,
      genderChartPie: null,
      browserChartPie: null,
      genderPieChartData: {},
      browserPieChartData: {},
      isGetBrowsePieChartData: false,
      isGetGenderPieChartData: false,
      // 2折线图数据
      browserChartLineData: {
        tabs: ['浏览量', '总浏览量'],
        key: 8,
        url: '/api/data/browseCountTrend'
      },
      userChartLineData: {
        tabs: ['新增用户数','总用户数','新增注册数','总注册数'],
        key: 2,
        url: '/api/data/userTrend'
      }
    };
  },
  methods: {

    drawPieChart(params) {
      let chartPie = echarts.init(document.getElementById(params.id));
      chartPie.setOption({
        title: {
          text: params.title,
          left: "10%",
          top: "5%",
          textStyle: {
            fontWeight: 300
          }
        },
        backgroundColor: "#fff",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          formatter: function(name) {
            return "{title|" + params.name + "}\n{total|" + params.data.sum + "}";
          },
          left: "22%",
          top: "center",
          icon: "none",
          align: "center",
          textStyle: {
            color: "#000",
            fontSize: 16,
            rich: {
              title: {
                fontSize: 16,
                color: "#666",
                lineHeight: 30
              },
              total: {
                fontSize: 30,
                color: "#000"
              }
            }
          },
          data: [params.data.data[0].name],
          selectedMode: false
        },
        series: [
          {
            name: params.title,
            type: "pie",
            radius: "55%",
            data: params.data.data,
            center: ["30%", "50%"],
            radius: ["40%", "50%"],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                show: false
              }
            }
          }
        ],
        itemStyle: {
          borderWidth: 5,
          borderColor: "#fff"
        },
        color: ["#3aa0ff", "#36cbcb", "#4dcb73", "#fad337", "#f2637b", "#975fe4", "#3a11ff", "#36cdaa", "#000", "#cfd337", "#f26adb", "#97ffe4", "#c2637b", "#9a4fe4"]
      });
      if (params.id === "genderChartPie") {
        this.genderChartPie = chartPie;
      } else {
        this.browserChartPie = chartPie;
      }
    },

    handleGetUserData(res) {
      if(res.status===200 && res.data.data) {
        let data = res.data.data;
        this.cards.push(data.new);
        this.cards[0].title = "新用户数";
        this.cards.push(data.all);
        this.cards[1].title = "总用户数";
        this.cards.push(data.newRegist);
        this.cards[2].title = "新增注册数";
        let obj = data.allRegist;
        obj.title = "总注册数"
        this.cards.push(obj);
        this.userLoading = false;
      }
    },

    getUserSexData() {
    	axios.get('/api/data/sex').then((res)=>{
    		if(res.status===200 && res.data.data) {
    			const data = res.data.data;
    			let list = [];
    			data.data.forEach((item,index)=>{
    				let obj = {};
    				obj.name = item.sex;
    				obj.value = item.count;
    				obj.percentage = item.percentage;
    				list.push(obj);
    			})
    			this.genderPieChartData.data = list;
    			this.genderPieChartData.sum = data.sum;
			    this.drawPieChart({
			      id: "genderChartPie",
			      title: "性别占比",
			      name: "总注册数",
			      data: this.genderPieChartData
			    });
			    this.isGetGenderPieChartData = true
    		}
    	})
    },

    getBrowseTendency() {
    	axios.get('/api/data/browseTendency').then((res)=>{
    		if(res.status===200 && res.data.data) {
    			const data = res.data.data;
    			let list = [];
    			data.data.forEach((item,index)=>{
    				let obj = {};
    				obj.name = item.tag;
    				obj.value = item.count;
    				obj.percentage = item.percentage;
    				list.push(obj);
    			})
    			this.browserPieChartData.data = list;
    			this.browserPieChartData.sum = data.sum;
			    this.drawPieChart({
			      id: "browserChartPie",
			      title: "浏览倾向",
			      name: "浏览量",
			      data: this.browserPieChartData
			    });
			    this.isGetBrowsePieChartData = true
    		}
    	})
    }
  },
  mounted() {
    // pie图
    this.getUserSexData();
    this.getBrowseTendency(); 

    const _this = this;
    // 获取用户数据
    this.userLoading = true;
    axios.get('/api/data/user').then(this.handleGetUserData)
  }
};
</script>

<style lang="scss" scoped>
.number{
  font-size: 20px;
}
.user-data {
  background: #f6f8f9;

  > section {
    min-width: 959px;
    margin-bottom: 20px;
    background-color: #fff;
  }

  .data-num {
    min-width: 959px;
    padding: 20px 0 40px 50px;

    .header {
      h4 {
        margin: 0;
        margin-bottom: 15px;
        color: #333;
        text-align: left;
      }
    }

    .data-num-main {
      display: flex;
      justify-content: space-around;
    }
  }

  .line-chart {
    position: relative;
    padding: 20px 60px;
    box-sizing: border-box;

    .select-box {
      position: absolute;
      top: 20px;
      right: 80px;

      .el-dropdown {
        margin-right: 20px;
        color: #888;
      }
    }
  }

  .pie-chart {
    background-color: #f6f8f9;
    overflow: hidden;

    .grid-content {
      background-color: #fff;
      height: 450px;
    }

    .el-col {
      position: relative;
    }
  }
}
</style>
