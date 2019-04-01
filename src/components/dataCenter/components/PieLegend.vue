<template>
  <div class="legend">
    <div class="legend-row" v-for="(item,index) of data.data" :key="index">
      <div class="left">
        <div class="mark" ref="marks"></div>
        <div class="legend-name">{{item.name}}</div>
        <div class="percentage">{{item.percentage}}</div>
      </div>
      <div class="number">{{item.value}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PieLegend",
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      colors: ["#3aa0ff", "#36cbcb", "#4dcb73", "#fad337", "#f2637b", "#975fe4"]
    };
  },
  mounted() {
    for (const key in this.$refs.marks) {
      this.$refs.marks[key].style.backgroundColor = this.colors[key];
    }
  },
  updated () {
    for (const key in this.$refs.marks) {
      this.$refs.marks[key].style.backgroundColor = this.colors[key];
    }
  }
};
</script>

<style lang="scss" scoped>
.legend {
  position: absolute;
  top: 30%;
  right: 10%;
  width: 170px;

  .legend-row {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;

    .left {
      display: flex;

      .mark {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        margin: 4px 10px 0 0;
      }
      .legend-name {
        font-weight: 300;
        font-size: 12px;
        color: #666;

        &::after {
          content: "|";
          margin: 8px;
          color: #000;
        }
      }
    }

    .percentage {
      color: #888;
    }
  }
}
</style>



