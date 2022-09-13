<template>
  <el-form ref="form" label-width="80px" :model="spu">
    <el-form-item label="SPU名称">
      <el-input v-model="spu.spu_name" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spu.spu_tradeMark" placeholder="请选择品牌">
        <el-option
          v-for="(tm, index) in tradeMarkList"
          :key="tm.id"
          :label="tm.name"
          :value="tm.name"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="spu.spu_descript"
        rows="4"
        type="textarea"
        placeholder="SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- 上传图片 
      action是图片上传的地址 
      list-type：文件列表的类型 
      on-preview：图片预览的时候会触发， 图片的预览功能
      on-remove：当删除图片的时候会触发
      file-list 照片墙需要展示的数据【数组：需要有name和url】
      -->
      <el-upload
        action="/dev-api/api/product/spu/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handlerSuccess"
        name="img"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-input v-model="spu.spu_sale_name" style="width: 200px"></el-input>
      <el-button
        type="primary"
        style="margin-left: 5px"
        icon="el-icon-plus"
        :disabled="!spu.spu_sale_name"
        @click="addSaleAttr"
        >添加销售属性</el-button
      >
      <!-- 展示的是当前spu属于自己的销售属性 -->
      <el-table :data="spu.spuSaleList" style="width: 100%" border>
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="spu_sale_name"
          label="属性名"
          width="width"
        ></el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              :key="tag.id"
              v-for="(tag, index) in row.spu_sale_Value_list"
              closable
              :disable-transitions="false"
              @close="handleClose(row, index)"
            >
              {{ tag.spu_sale_value }}
            </el-tag>
            <!-- 底下的结构可以当作span和input切换 -->
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="addSaleAttrValue(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spu.spuSaleList.splice($index, 1)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cencel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      //照片墙
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        category1Id: 0,
        category2Id: 0,
        //描述
        spu_descript: "",
        //spu的名称
        spu_name: "",
        //品牌的名称
        spu_tradeMark: "",
        //收集spu图片的信息
        spuImageList: [],
        //平台销售属性与属性值的收集
        spuSaleList: [],
      }, //存储SPU信息属性 ,初始化的时候是个空对象 在修改的时候会返回spu信息（对象），在修改的时候可以利用服务器返回的这个对象提交给服务器
      //但是在添加spu的时候，并没有像服务器发送请求，那么数据收集到哪【spu】，收集的时候
      tradeMarkList: [], //存储的是品牌的信息  由数据库返回
      spuImageList: [], //存储spuImage的数据  //存储添加进图片的Img
    };
  },
  methods: {
    //照片墙删除的回调
    handleRemove(file, fileList) {
      //file参数代表的是删除的那个照片
      //fileList删除完成后照片墙剩余的其他图片 需要收集起来
      //收集照片墙图片的数据
      //对于已有的图片【照片墙中显示的图片】 有name和url字段
      //而对于服务器而言 是不需要name和url字段的，将来对于已有的图片数据在提交给服务器的时候需要处理
      this.spuImageList = fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //照片墙添加照片成功的回调
    handlerSuccess(response, file, fileList) {
      //file :上传的那张图片
      //fileList：照片墙的照片
      //response：服务器返回的信息
      this.spuImageList = fileList;
    },
    //初始化SpuForm数据----修改
    async initSpudata(row) {
      //获取spu信息的数据
      let spuResult = await this.$API.spu.reqGetSpuInfoById(row.id);
      if (spuResult.code == 200) {
        this.spu.id = spuResult.data.id;
        this.spu.category1Id = spuResult.data.category1Id;
        this.spu.category2Id = spuResult.data.category2Id;
        this.spu.category3Id = spuResult.data.category3Id;
        this.spu.spu_descript = spuResult.data.spu_descript;
        this.spu.spu_name = spuResult.data.spu_name;
        this.spu.spu_tradeMark = spuResult.data.spu_tradeMark;
      }
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqGetBrandListByCategoryId(
        row.category1Id,
        row.category2Id,
        row.category3Id
      );
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqGetSpuImageListBySpuId(
        row.spu_img_id
      );
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素须有name和url字段
        listArr.forEach((item) => {
          item.name = item.spu_img_name;
          item.url = item.spu_img_url;
        });
        //把整理好的数据复制给
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqGetSpuSaleListBySpuId2(
        row.spu_sale_id
      );
      if (saleResult.code == 200) {
        this.spu.spuSaleList = saleResult.data;
      }
    },
    //初始化SpuForm数据---新增
    async addSpuData(category1Id, category2Id, category3Id) {
      //添加SPU的时候收集category3Id
      this.spu.category3Id = category3Id;
      this.spu.category1Id = category1Id;
      this.spu.category2Id = category2Id;
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqGetBrandListByCategoryId(
        category1Id,
        category2Id,
        category3Id
      );
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      const { spu_sale_name } = this.spu;
      //向SPU对象的spuSaleList属性里面添加新的销售属性
      let newSaleList = {
        spu_sale_name,
        spu_sale_Value_list: [],
      };
      let flag = this.spu.spuSaleList.every((item) => {
        if (item.spu_sale_name == spu_sale_name) {
          return false;
        } else {
          return true;
        }
      });
      if (flag) {
        //如果是true 说明没有重复的
        this.spu.spuSaleList.push(newSaleList);
        this.$message.success("添加成功");
      } else {
        this.$message({ type: "info", message: "销售属性重复" });
      }
      //清空销售属性
      this.spu.spu_sale_name = "";
    },
    //添加销售属性值的回调
    addSaleAttrValue(row) {
      //点击销售属性值当中添加销售属性的时候，需要有button变为input，通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible控制着button和input的切换
      this.$set(row, "inputVisible", true);
      //响应式数据inputValue收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    //当el-tag里的input失去焦点事件触发
    handleInputConfirm(row) {
      //修改inputVisible为false 就是显示input了
      row.inputVisible = false;
      //将新增的销售属性值扔进spu_sale_Value_list     需要有baseSaleAttrId（销售属性的id） saleAttrName(inputValue)
      //1.解构出想要的数据
      const { inputValue } = row;
      //1.1新增的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message({ type: "warning", message: "新增的销售属性值不能为空" });
        return;
      }
      //1.2新增的属性值不能重复
      let result = row.spu_sale_Value_list.every(
        (item) => item.spu_sale_value != inputValue
      );
      //重复了返回false 没重复返回true
      if (!result) {
        this.$message({ type: "warning", message: "新增的属性值不能重复" });
        return;
      }
      //2.将其转化为需要的格式
      let newSaleAttrValue = {
        spu_sale_value: inputValue,
      };
      //3.新增
      row.spu_sale_Value_list.push(newSaleAttrValue);
    },
    //当tag标签里的button点击叉号的时候的回调
    handleClose(row, index) {
      row.spu_sale_Value_list.splice(index, 1);
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数
      //1.整理照片墙的数据 需要携带imgName和imgUrl两个字段

      this.spu.spuImageList = this.spuImageList.map((item) => {
        if (item.response) {
          return {
            spu_img_name: item.name,
            spu_img_url: item.response.imgUrl,
          };
        } else {
          return {
            spu_img_name: item.spu_img_name,
            spu_img_url: item.spu_img_url,
          };
        }
      });
      //删除spu_sale_name
      delete this.spu.spu_sale_name;
      //2.发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        //3.切换到展示列表数据
        this.$emit("changeScene", 0);
      }
      //4.清除数据
      //object.assign：es6中新增的方法可以合并对象
      //组件实例this._data 可以操作data当中的响应式的数据
      //this.$options可以获取配置对象，配置对象的data函数执行那么返回的响应式就是空对象
      (this.dialogImageUrl = ""), (this.dialogVisible = false);
      (this.spu.category1Id = 0),
        (this.spu.category2Id = 0),
        (this.category3Id = 0),
        (this.spu.spu_descript = ""),
        (this.spu.spu_name = "");
      (this.spu.spu_tradeMark = ""),
        (this.spu.spuImageList = []),
        (this.spu.spuSaleList = []),
        (this.spu.spu_sale_name = "");
      this.tradeMarkList = [];
      //5.告诉父组件刷新列表数据
      this.$emit("refreshListSpu");
    },
    //取消按钮的回调
    cencel() {
      this.$emit("changeScene", 0);
      //清理数据  ---一行代码搞定  否则笨方法就是复制data张贴
      //object.assign：es6中新增的方法可以合并对象
      //组件实例this._data 可以操作data当中的响应式的数据
      //this.$options可以获取配置对象，配置对象的data函数执行那么返回的响应式就是空对象
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
