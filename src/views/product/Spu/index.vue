<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经是全局组件 -->
      <CategorySelect :show="scene != 0" @getCategoryId="getCategoryId">
      </CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里是由三部分切换的 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          @click="addSpu"
          :disabled="category3Id === ''"
          type="primary"
          icon="el-icon-plus"
          >添加SPU</el-button
        >

        <el-table :data="records" style="width: 100%; margin-top: 10px" border>
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spu_name" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="spu_descript" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="spu_tradeMark" label="SPU品牌" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来用hintButton替换 -->
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加spu"
                @click="addSku(row)"
                >添加</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
                >修改</el-button
              >
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
                style="margin-right: 10px"
                >详情</el-button
              >
              <!-- 气泡弹出框 -->
              <el-popconfirm
                :title="`确定删除${row.spu_name}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- //分页器 -->
        <el-pagination
          v-if="records.length != 0"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <spu-form
        @refreshListSpu="refreshListSpu"
        @changeScene="changeScene"
        v-show="scene == 1"
        ref="spu"
        >添加SPU|修改SPU</spu-form
      >
      <sku-form @changeScenes="changeScenes" ref="sku" v-show="scene == 2"
        >添加SKU</sku-form
      >
    </el-card>
    <el-dialog
      :title="`${spu.spu_name}的sku列表`"
      :visible.sync="dialogTableVisible"
      :befor-close="close"
    >
      <el-table style="width: 100%" v-loading="loading" border :data="skuList">
        <el-table-column width="width" prop="sku_name" label="名称">
        </el-table-column>
        <el-table-column width="width" prop="sku_price" label="价格">
        </el-table-column>
        <el-table-column width="width" prop="sku_weight" label="重量">
        </el-table-column>
        <el-table-column width="width" label="默认图片">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.sku_DefaultImg"
              style="width: 100px; height: 100px"
              alt=""
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";

export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spu: {}, //存储被点击的spu详情
      skuList: [], //存储被点击的spu的所有sku
      loading: true, //详情页加载效果控制
      page: 1,
      limit: 3,
      records: [], //存储spu列表的数据
      total: 0,
      scene: 0, //0代表展示spu列表数据 1 添加SPU|修改SPU 2 添加SKU       //控制三级联动可操作性
      dialogTableVisible: false, //控制对话框的显示与隐藏
    };
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的id传递给父组件
    getCategoryId(value) {
      //categoryid:获取几级ID ，level判断是几级id
      const { categoryId, level } = value;
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取spu类的列表数据进行展示
        this.getSpuList();
      }
    },
    //获取spu列表数据的方法
    async getSpuList() {
      const { limit, page, category1Id, category2Id, category3Id } = this;
      //携带三个参数 page limit category3Id
      let results = await this.$API.spu.reqGetSpuListById(
        page,
        limit,
        category1Id,
        category2Id,
        category3Id
      );
      if (results.code == 200) {
        this.records = results.data.list;
        this.total = results.data.total;
      }
    },
    //点击分页器的页数：当页数发生改变时
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //当分页器的pageSize发生改变时的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件SpuForm发请求---两个
      this.$refs.spu.addSpuData(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
    },
    //修改某一个spu按钮的回调
    updateSpu(row) {
      this.scene = 1;
      //获取子组件spuForm  父访问子  去访问子的方法
      this.$refs.spu.initSpudata(row);
    },
    //切换场景：自定义事件的回调：SpuForm
    changeScene(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    //删除某一个spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      console.log(row);
      if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "删除spu成功！" });
        //重新获取列表
        this.getSpuList();
        //跳转页数
        this.handleCurrentChange(
          this.records.length > 1 ? this.page : this.page - 1
        );
      }
    },
    //添加一个sku
    addSku(row) {
      //切换场景
      this.scene = 2;
      //父组件调用子组件的方法---三个请求
      this.$refs.sku.getData(row);
    },
    //sku通知父组件切换场景  skuForm
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看sku按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqGetSkuListById(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    //对话框关闭前的回调
    close() {
      //将loading属性变为true
      this.loading = true;
      //清除sku数据
      this.skuList = [];
    },
    //spu保存完毕需要刷新页面
    refreshListSpu() {
      this.handleCurrentChange(this.page);
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style></style>
