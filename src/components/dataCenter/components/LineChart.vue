<template>
  <div class="line-chart">
    <el-tabs v-model="activeName" @tab-click="handleLineChartTab">
      <el-tab-pane
        v-for="(item, index) of data.tabs"
        :key="index"
        :name="activeNames[index]"
        :label="item"
      >
        <div :id="activeNames[index]+data.key" style="width:100%; height:400px;"></div>
      </el-tab-pane>
    </el-tabs>
    <div class="select-box">
      <el-dropdown trigger="click" @command="handleDropdownCommand">
        <span class="el-dropdown-link">
          {{userLineChartType}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="7">最近7天</el-dropdown-item>
          <el-dropdown-item command="15">最近15天</el-dropdown-item>
          <el-dropdown-item command="30">最近30天</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-date-picker
        v-model="userpickerDate"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
      ></el-date-picker>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
export default {
  name: "LineChart",
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      chartLine: null,
      activeName: "first",
      activeNames: ["first", "second", "third", "forth"],
      userLineChartType: "最近7天",
      userpickerDate: "",
      previousDate: "",
      afterDate: "",
      list: [],
      currentType: 1,
    };
  },

  methods: {
    handleLineChartTab(targetName) {
      let index = +targetName.index + this.data.key;
      console.log(index)
      if (this.data.key === 2) {
        if (index === 2) {
          index--;
        }
      }
      this.currentType = index;
      this.getLineChartSeriesData();
      this.activeName = targetName.name;
      this.drawLineChart({
        title: targetName.label,
        id: this.activeName
      });
    },

    handleDropdownCommand(command) {
      switch (command) {
        case "7":
          this.userLineChartType = "最近7天";
          this.afterDate = this.fmtDate(+new Date());
          this.previousDate = this.fmtDate(
            +new Date() - 7 * 24 * 60 * 60 * 1000
          );
          break;
        case "15":
          this.userLineChartType = "最近15天";
          this.afterDate = this.fmtDate(+new Date());
          this.previousDate = this.fmtDate(
            +new Date() - 15 * 24 * 60 * 60 * 1000
          );
          break;
        case "30":
          this.userLineChartType = "最近30天";
          this.afterDate = this.fmtDate(+new Date());
          this.previousDate = this.fmtDate(
            +new Date() - 30 * 24 * 60 * 60 * 1000
          );
          break;
        default:
          break;
      }
      this.getLineChartSeriesData();
    },
    // 获取数据
    getLineChartSeriesData() {
      let data = [];
      axios
        .get(this.data.url, {
          params: {
            type: this.currentType,
            startDate: this.previousDate,
            endDate: this.afterDate
          }
        })
        .then(res => {
          if (res.status === 200 && res.data.data) {
            res.data.data.forEach(item => {
              let times = +new Date(item.time);
              data.unshift([times, item.count]);
            });
            data.sort((a, b) => {
              return a[0] - b[0];
            });
            // 画图
            this.list = data;
            this.drawLineChart({
              title: this.data.tabs[0],
              id: this.activeName
            });
          }
        });
    },

    drawLineChart(params) {
      let data = this.list;

      const id = params.id + this.data.key;
      let chart = document.getElementById(id);
      chart.style.width = "959px";
      this.chartLine = echarts.init(chart);
      this.chartLine.setOption({
        title: {
          text: params.title + "趋势",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          width: "780px",
          height: "300px",
          left: "2%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "time",
          boundaryGap: ["20%", "20%"],
          // splitNumber: 7,
          axisLabel: {
            formatter: function(value) {
              return echarts.format.formatTime("yyyy-MM-dd", new Date(value));
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            onZero: false
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            inside: true,
            verticalAlign: "top",
            padding: [10, 0, 0, 0]
          }
        },
        series: [
          {
            name: params.title,
            type: "line",
            symbol: "circle",
            data,
            itemStyle: {
              normal: {
                color: "#2195fe", //折线点的颜色
                lineStyle: {
                  color: "#2195fe" //折线的颜色
                }
              }
            }
          }
        ]
      });
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
    }
  },

  mounted() {
    this.currentType = this.data.key === 2 ? 1 : this.data.key;
    this.afterDate = this.fmtDate(+new Date());
    this.previousDate = this.fmtDate(+new Date() - 7 * 24 * 60 * 60 * 1000);
    this.getLineChartSeriesData();
  },

  watch: {
    userpickerDate(newVal, oldVal) {
      this.previousDate = this.fmtDate(newVal[0].getTime());
      this.afterDate = this.fmtDate(newVal[1].getTime());
      // 重新获取数据
      this.getLineChartSeriesData();
    }
  }
};
</script>

<style lang="scss" scoped>
.line-chart {
  position: relative;
  min-width: 959px;
  padding: 20px 60px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #fff;

  .select-box {
    position: absolute;
    top: 20px;
    right: 70px;

    .el-dropdown {
      margin-right: 10px;
      color: #888;
      border: 1px solid #e0e0e0;
      padding: 5px 2px 5px 4px;
      border-radius: 3px;

      .el-icon--right {
        margin-left: 0;
      }
    }
  }
}
</style>
