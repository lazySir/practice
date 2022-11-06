<template>
  <div>
    <!-- 网格布局 -->
    <el-row :gutter="10">
      <!-- 第一个card -->
      <el-col :span="6">
        <el-card>
          <detail count="￥ 12656" title="总销售额">
            <template slot="charts">
              <span
                >周同比&nbsp;&nbsp;56.67%<svg
                  t="1661775684013"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5166"
                  width="16"
                  height="16"
                >
                  <path
                    d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0"
                    fill="#d81e06"
                    p-id="5167"
                  ></path></svg
              ></span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp;19.96%&nbsp;<svg
                  t="1661775619808"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3790"
                  width="16"
                  height="16"
                >
                  <path
                    d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0"
                    fill="#a2f50a"
                    p-id="3791"
                  ></path></svg
              ></span>
            </template>
            <template slot="footer"><span>日销售额￥ 12423</span></template>
          </detail>
        </el-card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6">
        <el-card>
          <detail count="88460" title="访问量">
            <template slot='charts'>
              <lineCharts />
            </template>
            <template slot="footer"><span>日访问量 1234</span></template>
          </detail>
        </el-card></el-col
      >
      <!-- 第三个card -->
      <el-col :span="6">
        <el-card> <detail count="88460" title="支付笔数">
          <template slot='charts'>
            <barCharts />
          </template>
          <template slot='footer'>
            <span>转化率 64%</span></span>
          </template>
          </detail> </el-card
      ></el-col>
      <!-- 第四个card -->
      <el-col :span="6">
        <el-card>
          <detail count="78%" title="运营活动效果">
            <template slot='charts'>
              <progressCharts />
            </template>
            <template slot="footer">
              <span
                >周同比&nbsp;&nbsp;12%<svg
                  t="1661775684013"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5166"
                  width="16"
                  height="16"
                >
                  <path
                    d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0"
                    fill="#d81e06"
                    p-id="5167"
                  ></path></svg
              ></span>
              &nbsp;&nbsp;
              <span
                >日同比&nbsp;&nbsp;11%&nbsp;<svg
                  t="1661775619808"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3790"
                  width="16"
                  height="16"
                >
                  <path
                    d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0"
                    fill="#a2f50a"
                    p-id="3791"
                  ></path></svg
              ></span>
            </template>
          </detail> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./detail";
import lineCharts from '../lineChart'
import barCharts from '../barCharts'
import progressCharts from '../progressCharts'
export default {
  name: "card",
  components: {
    Detail,
    lineCharts,
    barCharts,
    progressCharts
  },
};
</script>

<style></style>
