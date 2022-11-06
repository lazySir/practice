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
      series: {
        type: "line",
        smooth:true,//平滑
        data: [10, 48,29,55,28, 33, 44, 22, 77,53],
        //拐点的样式的设置
        itemStyle: {
          opacity: 0,
        },
        //线条的样式
        lineStyle: {
          color: "purple",
        },
        //区域填充颜色
        areaStyle: {
          //渐变
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "purple" },//百分之零处的
              { offset: 1, color: "#fff" },//百分百处的
            ],
            global: false,//缺省为false
          },
        },
      },
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
#ro {
  width: 100%;
  height: 100%;
}
</style>
