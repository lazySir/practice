<template>
  <div id="ro">
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [10, 48, 29, 55, 28, 33, 44, 22, 77, 53,34,65],
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip:{}
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
#ro {
  width: 100%;
  height: 100%;
}
</style>
