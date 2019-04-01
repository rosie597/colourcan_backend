<template>
  <div class="data-card">
    <div class="num-wrapper">
      <div class="num">{{num}}</div>
      <div class="title">{{data.title}}</div>
    </div>
    <div class="percentage">
      <div class="day">
        日
        <i :class="up.dayPercentage ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>{{data.dayPercentage}}
      </div>
      <div class="week">
        周
        <i :class="up.weekPercentage ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>{{data.weekPercentage}}
      </div>
      <div class="month">
        月
        <i :class="up.monthPercentage ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>{{data.monthPercentage}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataCard",
  props: {
    workData: {
      type: Object
    }
  },
  data () {
    return {
      data: this.workData
    }
  },
  computed: {
    up () {
      let ups = {};
      for (const key in this.data) {
        if(typeof this.data[key] != 'number') {
          if(this.data[key].charAt(0) === '-') {
            ups[key] = true;
            this.data[key] = this.data[key].slice(1);
          } else {
            ups[key] = false;
            this.data[key] = this.data[key];
          }
        }
      }
      return ups;
    },
    num () {
      return (this.workData.workNum || this.workData.workNum===0) ? this.workData.workNum : this.workData.num
    }
  },
  mounted () {

  }
};
</script>

<style lang="scss" scoped>
.data-card {
  text-align: center;

  .num-wrapper {
    float: left;

    .num {
      font-size: 40px;
    }
    .title {
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
  }

  .percentage {
    float: left;
    margin-left: 10px;

    > div {
      margin-bottom: 2px;
      font-size: 10px;
      color: #888;
      text-align: left;

      .el-icon-caret-top {
        color: #8fd96b;
        margin: 0 2px 0 1px;
      }
      .el-icon-caret-bottom {
        color: #f64751;
        margin: 0 2px 0 1px;
      }
    }
  }
}
</style>

