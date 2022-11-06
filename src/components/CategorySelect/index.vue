<template>
  <div>
    <!-- inline 代表行内表单  一行可以放多个表单元素 
    model:收集的表单所有数据存放位置
    -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          @change="handler1"
          v-model="cForm.category1Id"
          :disabled="show"
        >
          <el-option
            v-for="(c1, index) in list1"
            :key="c1.id"
            :label="c1.category1_name"
            :value="c1.type_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          @change="handler2"
          v-model="cForm.category2Id"
          :disabled="show"
        >
          <el-option
            v-for="(c2, index) in list2"
            :key="c2.id"
            :label="c2.category2_name"
            :value="c2.type_id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          :disabled="show"
          @change="hangler3"
          v-model="cForm.category3Id"
        >
          <el-option
            v-for="(c3, index) in list3"
            :key="c3.id"
            :label="c3.category3_name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  //组件挂载完毕，向服务器发请求，获取响应的一级分类的数据
  data() {
    return {
      //一级分类的数据
      list1: [],
      //二级分类的数据
      list2: [],
      //三级分类的数据
      list3: [],
      //收集一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //获取一级分类数据的方法
    this.getCateory1List();
  },
  methods: {
    //获取一级分类数据
    async getCateory1List() {
      let result = await this.$API.category.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //将所有数据滞空
    clear() {
      this.cForm.category1Id = "";
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
    },
    //当一级分类的select的事件回调(当一级分类发生变化时获取相应的二级分类数据)
    async handler1() {
      //解构出一级分类的id
      const { category1Id } = this.cForm;
      //将二级分类和三级分类的value清除
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.list2 = [];
      this.list3 = [];
      //通过一级分类的id获取二级分类的数据
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.category.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    //当二级分类的select的事件回调（当二级分类发生变化时获取相应的三级分类数据）
    async handler2() {
      const { category2Id } = this.cForm;
      //将三级分类的value情况
      this.cForm.category3Id = "";
      this.list3 = [];
      //通过二级分类的id获取三级分类的数据
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.category.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的select的事件回调
    hangler3() {
      //解构出三个id
      const { category3Id } = this.cForm;
      //获取三级分类的id
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
  props: ["show"],
};
</script>

<style></style>
