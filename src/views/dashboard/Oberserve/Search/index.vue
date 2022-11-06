<template>
  <el-card>
    <div slot="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12"><lineCharts number2='17.1' flag='true' number='12321' title="搜索用户数"></lineCharts></el-col>
        <el-col :span="12"
          ><lineCharts number='2.7' number2='26.2' title="人均搜索次数"> </lineCharts
        ></el-col>
      </el-row>
      <!-- table表格 -->
      <el-table style="width: 100%" border>
        <el-table-column type="index" width="80px" label="排名">
        </el-table-column>
        <el-table-column label="搜索关键字" width="180px"></el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination class='pagination' layout="prev, pager, next" :total="1000"> </el-pagination>
    </div>
  </el-card>
</template>

<script>
import lineCharts from "@/views/dashboard/Oberserve/Search/lineCharts";
export default {
  name: "",
  data() {
    return {
      tableData: {},
    };
  },
  components: {
    lineCharts,
  },
};
</script>

<style>
::v-deep .el-card__header {
  border-bottom: none;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
.pagination{
  text-align: center;
}
</style>
