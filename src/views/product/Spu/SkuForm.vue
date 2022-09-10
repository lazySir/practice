<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="SPU名称"> {{ spu.spu_name }} </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuInfo.sku_name" placeholder="sku名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        type="number"
        v-model="skuInfo.sku_price"
        placeholder="价格(元)"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input
        v-model="skuInfo.sku_weight"
        placeholder="重量(千克)"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        v-model="skuInfo.sku_descript"
        type="textarea"
        placeholder="规格描述"
        rows="4"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form ref="form" label-width="80px">
        <el-form-item
          v-for="(attr, index) in attrInfoList"
          :key="attr.id"
          :label="attr.attr_name"
        >
          <el-select placeholder="请选择" v-model="attr.attrAndValue">
            <el-option
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.attr_name}:${attrValue.valueName}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form ref="form" label-width="80px">
        <el-form-item
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="saleAttr.id"
          :label="saleAttr.spu_sale_name"
        >
          <el-select placeholder="请选择" v-model="saleAttr.saleAndValue">
            <el-option
              v-for="(saleAttrValue, index) in saleAttr.saleValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.spu_sale_value"
              :value="`${saleAttr.spu_sale_name}:${saleAttrValue.spu_sale_value}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        @selection-change="handleSelectionChange"
        :data="spuImageList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="prop"
          type="selection"
          label="label"
          width="width"
        >
        </el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
          <template slot-scope="{ row, $index }">
            <img
              :src="row.spu_img_url"
              style="height: 100px; width: 100px"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="spu_img_name" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              v-if="row.isDefault == 0"
              @click="changeDefault(row)"
              type="primary"
              >设为默认</el-button
            >
            <el-button v-else type="success">默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="save" type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //存储销售属性
      spuSaleAttrList: [],
      //平台属性
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        spu_id: 0,
        spu_tradeMark: "",
        //第二类，需要通过数据双向绑定v-model收集
        sku_price: 0,
        sku_name: "",
        sku_weight: "",
        sku_descript: "",
        //第三类，需要自己书写代码的
        //平台属性
        sku_attr: [],
        //默认图片
        skuDefaultImg: "",
        //收集图片的数据
        sku_img: [],
        //sku的销售属性列表
        sku_sale: [],
      },
      //存储spu
      spu: {},
      //临时收集图片table选中的数据  未处理 缺少isDefault
      imageList: [],
    };
  },
  methods: {
    //获取skuForm数据
    async getData(spu) {
      //收集父组件给予的数据
      this.skuInfo.spu_id = spu.id;
      this.skuInfo.spu_tradeMark = spu.spu_tradeMark;
      this.spu = spu;
      //获取spu图片的数据
      let result = await this.$API.spu.reqGetSpuImageListBySpuId(
        spu.spu_img_id
      );
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      let result1 = await this.$API.spu.reqGetSpuSaleListBySpuId(
        spu.spu_sale_id
      );
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqGetAttrListBycategoryId(
        spu.category1Id,
        spu.category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //图片table表格复选框按钮的事件
    handleSelectionChange(params) {
      //获取到用户选中的图片信息，但是需要注意的是 当前收集的数据当中缺少isDefault字段（服务器需要）
      this.imageList = params;
    },
    //图片table设为默认  排他操作
    changeDefault(row) {
      //图片列表的数据isDefault 变为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      //点击的那个图片数据变为1
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消按钮的回调
    cancel() {
      //自定义事件 让父组件切换为0
      this.$emit("changeScenes", 0);
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //保存按钮的回调
    async save() {
      //整理参数
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      //整理平台属性 attrInfoList
      skuInfo.sku_attr = attrInfoList.reduce((prev, item) => {
        //给prev赋予初始值【】
        if (item.attrAndValue) {
          const [attr_name, valueName] = item.attrAndValue.split(":");
          prev.push({ attr_name, valueName });
        }
        return prev;
      }, []);
      //整理销售属性
      skuInfo.sku_sale = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAndValue) {
          const [spu_sale_name, spu_sale_value] = item.saleAndValue.split(":");
          prev.push({ spu_sale_name, spu_sale_value });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.sku_img = imageList.map((item) => {
        return {
          sku_img_name: item.spu_img_name,
          sku_img_url: item.spu_img_url,
          isDefault: item.isDefault,
          sku_img_id: item.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加sku成功!" });
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style></style>
