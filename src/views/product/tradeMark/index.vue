<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect ref="category" @getCategoryId="getCategoryId">
      </CategorySelect>
    </el-card>

    <el-card>
      <!-- 添加按钮 -->
      <el-button
        type="primary"
        @click="showDialog"
        icon="el-icon-plus"
        :disabled="category3Id === ''"
        style="margin: 10px 10px"
        >添加</el-button
      >
      <el-button
        type="primary"
        @click="searchAll"
        icon="el-icon-view"
        style="margin: 10px 10px"
        >查询所有</el-button
      >
      <div style="float: right">
        <el-input
          style="width: 200px"
          v-model="searchBrand"
          placeholder="请输入内容"
        ></el-input>
        <el-button icon="el-icon-search" @click="search" type="primary"
          >搜索</el-button
        >
      </div>

      <!-- 表单 -->
      <el-table
        :data="list"
        style="width: 100%; margin-top: 20px; margin-left: 10px"
        border
      >
        <el-table-column
          prop="prop"
          type="index"
          label="序号"
          width="80px"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="LOGO" label="LOGO" width="width">
          <!-- 图片得用到作用域插槽 -->
          <template slot-scope="{ row, $index }">
            <img :src="row.LOGO" alt="" style="height: 100px; width: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateTmInfo(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteTmInfo(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :total="total"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="prev, pager, next, jumper,->,sizes,total "
      >
      </el-pagination>

      <!-- 对话框     -->
      <!-- ：visible.sync:控制对话框显示与隐藏用的
    Form 组件提供了表单验证的功能，
    只需要通过 rules 属性传入约定的验证规则，
    并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
      <el-dialog
        :title="tmForm.id ? '修改数据' : '添加数据'"
        :visible.sync="dialogFormVisible"
      >
        <!-- form表单  model属性：这个属性的作用是把表单的数据收集起来-->
        <el-form
          :rules="rules"
          ref="ruleForm"
          style="width: 80%"
          :model="tmForm"
        >
          <el-form-item prop="name" label="名称" label-width="100px">
            <el-input v-model="tmForm.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item prop="LOGO" label="LOGO" label-width="100px">
            <!-- 上传头像 -->
            <!-- 这里收集数据，不能使用v-model，因为不是表单元素 
        action：设置图片上传的地址 
        :on-success:可以监测到图片上传成功，当图片上传成功，会执行一次
        ：before-upload：当图片上传之前，会执行一次
        -->
            <el-upload
              name="img"
              class="avatar-uploader"
              action="/dev-api/api/product/tradeMark/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="tmForm.LOGO" :src="tmForm.LOGO" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTradeMarkInfo">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //要展示的数据
      list: [],
      //当前页
      page: 1,
      //当前页的展示条数
      limit: 3,
      //总共数据的条数
      total: 0,
      //一级分类id
      category1Id: "",
      //二级分类id
      category2Id: "",
      //三级分类id
      category3Id: "",
      //收集要添加的数据
      tmForm: {
        name: "",
        LOGO: "",
      },
      //搜索栏中的内容
      searchBrand: "",
      //对话框显示与隐藏
      dialogFormVisible: false,
      //表单验证的规则
      rules: {
        name: [
          //required 是否为必须  跟前面的小星星有关
          { required: true, message: "请输入名称", trigger: "blur" }, //blur 当一个元素失去焦点的时候 blur 事件被触发
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "change",
          }, //trigger:用户行为
        ],
        LOGO: [{ required: true, message: "请选择图片LOGO" }],
      },
    };
  },
  methods: {
    //自定义事件的回调获取分类id
    getCategoryId(value) {
      const { level, categoryId } = value;
      //获取三级id
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //发请求获取attr商品管理
        this.getTrademarkById();
      }
    },
    //获取所有品牌列表
    async getTrademarkList() {
      //解构出参数
      const { page, limit } = this;
      //初始化了两个参数 page limit  因为这个接口需要当前页数和显示条数
      let res = await this.$API.tradeMark.reqGetTradeMarkList(page, limit);
      if (res.code == 200) {
        //总条数与展示的数据
        (this.total = res.data.total), (this.list = res.data.list);
      }
    },
    //获取指定品牌列表
    async getTrademarkById() {
      //解构出参数
      const { page, limit } = this;
      let Id = {};
      Id.category1Id = this.category1Id;
      Id.category2Id = this.category2Id;
      Id.category3Id = this.category3Id;
      //初始化了两个参数 page limit  因为这个接口需要当前页数和显示条数
      let res = await this.$API.tradeMark.reqGetTradeMarkListById(
        page,
        limit,
        Id
      );
      if (res.code == 200) {
        //总条数与展示的数据
        (this.total = res.data.total), (this.list = res.data.list);
      }
    },
    //点击显示添加数据对话框
    showDialog() {
      //清除数组
      this.tmForm = { name: "", LOGO: "" };
      //显示对话框
      this.dialogFormVisible = true;
    },
    //图片上传成功执行一次
    handleAvatarSuccess(res, file) {
      //res 是服务器返回的信息
      //file：上传成功之后服务器返回给前端的数据
      this.tmForm.LOGO = file.response.imgUrl;
    },
    //图片上传之前执行一次
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //切换页数的回调
    handleCurrentChange(pager) {
      //修改参数page
      this.page = pager;
      //重新获取品牌列表
      if (this.category3Id !== "") {
        this.getTrademarkById();
      } else {
        this.getTrademarkList();
      }
    },
    //当分页器每一页需要展示的条数的个数发生变化时会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTrademarkList();
    },
    //添加品牌数据的回调
    async addTradeMarkInfo() {
      //当全部验证的规则通过之后在去执行操作
      this.$refs.ruleForm.validate(async (valid) => {
        //如果全部字段符合条件
        if (valid) {
          //将数据整合
          this.tmForm.category3Id = this.category3Id;
          this.tmForm.category1Id = this.category1Id;
          this.tmForm.category2Id = this.category2Id;
          //隐藏对话框
          this.dialogFormVisible = false;
          //发请求（添加品牌|修改品牌）
          let res = await this.$API.tradeMark.reqAddOrUpdateTradeMarkList(
            this.tmForm
          );
          if (res.code == 200) {
            //弹出信息：添加品成功、修改品牌成功
            this.$message({
              message: this.tmForm.id ? "修改数据成功" : "添加数据成功",
              type: "success",
            });
            //添加或者修改品牌成功以后  重新获取品牌列表
            //如果是添加品牌：停留在最后一页，  如果刚好满了则页数会+1 否则停留在此页面
            //如果是更新品牌，留在当前页

            if (this.category3Id !== "") {
              this.getTrademarkById();
            } else {
              this.getTrademarkList();
            }
            this.handleCurrentChange(
              this.tmForm.id
                ? this.page
                : this.list.length == this.limit
                ? Math.ceil(this.total / this.limit) + 1
                : Math.ceil(this.total / this.limit)
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //查询所有的品牌
    searchAll() {
      //清除所有category
      (this.category1Id = ""),
        (this.category2Id = ""),
        (this.category3Id = ""),
        //清除category的value
        this.$refs.category.clear();
      //发请求
      this.getTrademarkList();
      this.$message({ type: "success", message: "获取所有品牌列表成功！" });
    },
    //修改某一条数据
    updateTmInfo(row) {
      //对话框显示
      this.dialogFormVisible = true;
      //row：当前用户选择的信息
      this.tmForm = { ...row }; //这里为什么要这么弄是因为浅拷贝 不让tradeForm直接对数据库进行修改
    },
    //删除数据的回调
    deleteTmInfo(row) {
      //弹窗
      console.log(row);
      this.$confirm(`您确定删除${row.name}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击确定按钮的时候会触发
          //向服务器发请求
          let res = await this.$API.tradeMark.reqDeleteTmList(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌列表
            //如果list为0 则返回的是page-1，
            this.handleCurrentChange(
              this.list.length > 1 ? this.page : this.page - 1
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //搜索品牌的回调
    async search() {
      //判断是否有内容
      if (this.searchBrand.trim() !== "") {
        //先清空所有数据
        //清除所有category
        (this.category1Id = ""),
          (this.category2Id = ""),
          (this.category3Id = ""),
          //清除category的value
          this.$refs.category.clear(); //解构
        const { page, limit, searchBrand } = this;
        //发请求
        let res = await this.$API.tradeMark.reqGetTradeMarkListByName(
          page,
          limit,
          searchBrand
        );
        if (res.code == 200) {
          this.list = res.data.list;
          this.total = res.data.total;
          this.$message({ type: "success", message: `${res.message}` });
          //将搜索栏清空
          this.searchBrand = "";
        }
      } else {
        this.$message({ type: "warning", message: "查询内容不可为空！" });
      }
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
