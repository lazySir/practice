<template>
  <div>
    <div class="header">
      <span class="search-header">{{ title }}</span>
      <svg
        t="1661930934237"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2387"
        width="20"
        height="20"
      >
        <path
          d="M512.50142 958.397886c-119.320573 0-231.499491-46.465265-315.871087-130.837884C112.258737 743.188406 65.792449 631.010511 65.792449 511.688915c0-119.319549 46.466288-231.499491 130.837884-315.871087C281.002952 111.445208 393.180847 64.979944 512.50142 64.979944s231.499491 46.465265 315.871087 130.837884c84.372619 84.372619 130.837884 196.551538 130.837884 315.871087 0 119.321596-46.465265 231.499491-130.837884 315.871087C744.000911 911.932622 631.821993 958.397886 512.50142 958.397886zM512.50142 105.962334c-223.718271 0-405.726581 182.00831-405.726581 405.726581s182.00831 405.726581 405.726581 405.726581c223.718271 0 405.727605-182.00831 405.727605-405.726581S736.220714 105.962334 512.50142 105.962334z"
          p-id="2388"
          fill="#bfbfbf"
        ></path>
        <path
          d="M510.150886 775.953647c-18.107403 0-32.745798-14.678304-32.745798-32.785707L477.405087 452.191846c0-18.108426 14.638395-32.785707 32.745798-32.785707 18.107403 0 32.745798 14.678304 32.745798 32.785707l0 290.976094C542.896684 761.275343 528.258289 775.953647 510.150886 775.953647z"
          p-id="2389"
          fill="#bfbfbf"
        ></path>
        <path
          d="M511.357364 296.458969m-45.080731 0a44.054 44.054 0 1 0 90.161463 0 44.054 44.054 0 1 0-90.161463 0Z"
          p-id="2390"
          fill="#bfbfbf"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class='main-title'>{{number}}</span>
      <span class='main-content'>{{number2}}</span>
      <svg v-if="flag" t="1661931226763" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2337" width="16" height="16"><path d="M325.456471 862.280661" p-id="2338" fill="#d81e06"></path><path d="M882.057788 862.280661" p-id="2339" fill="#d81e06"></path><path d="M236.028491 877.160382" p-id="2340" fill="#d81e06"></path><path d="M960.132455 877.160382" p-id="2341" fill="#d81e06"></path><path d="M63.683483 788.736998" p-id="2342" fill="#d81e06"></path><path d="M958.469023 788.736998" p-id="2343" fill="#d81e06"></path><path d="M64.77753 858.792098" p-id="2344" fill="#d81e06"></path><path d="M861.417121 738.727375c41.604731 0 65.233383-54.963795 34.928639-85.258218L547.071415 304.191372c-20.029996-20.031716-49.822121-20.031716-69.853837 0L127.955275 653.469157c-31.085714 31.073673-5.136514 85.258218 35.441258 85.258218L861.417121 738.727375 861.417121 738.727375z" p-id="2345" fill="#d81e06"></path><path d="M959.523505 858.792098" p-id="2346" fill="#d81e06"></path></svg>
   <svg v-else t="1661931276428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3404" width="16" height="16"><path d="M325.456471 862.280661" p-id="3405" fill="#1afa29"></path><path d="M882.057788 862.280661" p-id="3406" fill="#1afa29"></path><path d="M236.028491 877.160382" p-id="3407" fill="#1afa29"></path><path d="M960.132455 877.160382" p-id="3408" fill="#1afa29"></path><path d="M63.683483 788.736998" p-id="3409" fill="#1afa29"></path><path d="M958.469023 788.736998" p-id="3410" fill="#1afa29"></path><path d="M64.77753 858.792098" p-id="3411" fill="#1afa29"></path><path d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z" p-id="3412" fill="#1afa29"></path><path d="M959.523505 858.792098" p-id="3413" fill="#1afa29"></path></svg>
    </div>
    <div class="footer">
      <div class='charts' ref='charts'></div>
      
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  props: ["title",'number','number2','flag'],
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
        data: [16, 35,24,23,35, 37, 31, 55, 41,55],
        //拐点的样式的设置
        itemStyle: {
          opacity: 0,
        },
        //线条的样式
        lineStyle: {
          color: "#66CCFF",
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
              { offset: 0, color: "#66CCFF" },//百分之零处的
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
.header {
  display: flex;
  align-items: center;
}
.search-header {
  margin-right: 20px;
}
.main{
  margin:10px 0px;
}
.main-title{
  margin-right: 30px;
}
.main-content{
  margin-right: 7px;
}
.charts{
  height:100px;
  width:100%;
}
</style>
