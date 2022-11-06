<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="small">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let mycharts = echarts.init(this.$refs.charts);
    mycharts.setOption({
      title:{
        text:'视频',
        subtext:'1048',
        left:'center',
        top:'center'
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },

          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "搜索引擎" },
            { value: 735, name: "视频广告" },
            { value: 580, name: "汇联广告" },
            { value: 484, name: "邮件直营" },
            { value: 300, name: "直接访问" },
          ],
        },
      ],
    });
    //绑定事件
    mycharts.on('mouseover',(params)=>{
      //获取鼠标移动到的数据
      const{name,value}=params.data;
      //重新设置标题
      mycharts.setOption({
        title:{
          text:name,
          subtext:value
        }
      })
    })
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .el-card__header {
  padding: 12px 20px;
}
.charts {
  height: 300px;
  width: 100%;
}
</style>
