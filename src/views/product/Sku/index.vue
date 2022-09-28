<template>
  <div>
    <el-table style="width: 100%" :data="records" border>
      <el-table-column
        type="index"
        align="center"
        width="80"
        prop="prop"
        label="序号"
      >
      </el-table-column>
      <el-table-column width="width" prop="sku_name" label="名称">
      </el-table-column>
      <el-table-column width="width" prop="sku_descript" label="描述">
      </el-table-column>
      <el-table-column width="110" prop="prop" label="默认图片">
        <template slot-scope="{ row, $index }">
          <img style="width: 80px; height: 80px" :src="row.Default" alt="" />
        </template>
      </el-table-column>
      <el-table-column width="80" prop="sku_weight" label="重量(kg)">
      </el-table-column>
      <el-table-column width="80" prop="sku_price" label="价格(元)">
      </el-table-column>
      <el-table-column width="width" prop="prop" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            @click="sale(row)"
            type="success"
            title="上架"
            icon="el-icon-top"
            size="mini"
            v-if="row.isSale == 0"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            @click="cancel(row)"
            v-else
          ></el-button>

          <el-button
            type="primary"
            @click="edit(row)"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            @click="getSkuInfo(row)"
            size="mini"
          ></el-button>
          <!-- 气泡弹出框 -->
          <el-popconfirm
            :title="`确定删除${row.sku_name}吗？`"
            @onConfirm="deleteSpu(row)"
          >
            <el-button
            style='margin-left:8px'
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              ></el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer size="50%" :show-close="false" :visible.sync="drawer">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.sku_name }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.sku_descript }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.sku_price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            v-for="(attr, index) in skuInfo.attr"
            :key="attr.id"
            type="success"
            >{{ attr.sku_attr_name }}-{{ attr.sku_attr_value }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            v-for="(sale, index) in skuInfo.sale"
            :key="sale.id"
            type="success"
            >{{ sale.sku_sale_name }}-{{ sale.sku_sale_value }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16"
          ><el-carousel height="500px">
            <el-carousel-item v-for="item in skuInfo.img" :key="item.id">
              <img style="width: 100%" :src="item.sku_img_url" alt="" />
            </el-carousel-item> </el-carousel
        ></el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //代表当前第几页
      limit: 10, //代表展示多少条数据
      records: [], //存放sku列表数据
      total: 0, //存储分页器一共有多少条
      skuInfo: {}, //存储sku详情数据
      drawer: false, //控制抽屉的显示与隐藏
    };
  },
  methods: {
    //获取sku列表的方法
    async getSkuList() {
      //解构出参数
      const { page, limit } = this;
      let result = await this.$API.sku.reqGetSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //切换页数
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    //切换显示条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //上架
    async sale(row) {
      let result = await this.$API.sku.reqShelves(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功！" });
      }
    },
    //下架
    async cancel(row) {
      let result = await this.$API.sku.reqTheShelves(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功！" });
      }
    },
    //edit
    edit(row) {
      this.$message({ type: "info", message: "正在开发中！" });
    },
    //获取SKU详情的方法
    async getSkuInfo(sku) {
      let result = await this.$API.sku.reqGetSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data[0];
        //将抽屉打开
        this.drawer = true;
      }
    },
    //删除
    async deleteSpu(row){
      let result = await this.$API.sku.reqDeleteSkuById(row.id)
      if(result.code==200){
        this.$message({type:'success',message:'删除成功！'})
        this.getSkuList()
      }
    }
  },
  //组件挂载完毕
  mounted() {
    //获取sku列表
    this.getSkuList();
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/* 深度选择器 */

/* ::v-deep .el-carousel__button{
  width:10px;
  height:10px;
  background:red;
  border-radius:50%;
} */
</style>
