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
        //最小值和最大值
        min: 0,
        max: 100,
      },
      yAxis: {
        //隐藏y轴
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          //柱状图宽度设置
          barWidth: 20,
          //背景颜色前要先设置
          showBackground: true,
          //设置背景的颜色
          backgroundStyle: {
            color: "rgba(220, 220, 220, 0.8)",
          },
          //文本标签
          label: {
            show: true,
            //显示的内容
            formatter: "|",
            //显示内容的位置
            position: "right",
          },
        },
      ],
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
