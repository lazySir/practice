<template>
  <el-card>
    <el-button
      @click="addCategory"
      style="margin-bottom: 5px"
      icon="el-icon-plus"
      type="primary"
      :title="dialogTitle"
      >添加</el-button
    >
    <el-table
      border
      style="margin-bottom: 20px"
      :data="allCategroy"
      row-key="key"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.level === 3"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :title="getAddTitle(row.level)"
            @click="addCategory(row)"
            >添加</el-button
          >

          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateCategory(row)"
            :title="getUpdateTitle(row.level)"
            >修改</el-button
          >

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            @onConfirm="ensureDelete(row)"
            :title="`确定删除${categoryInfo.name}吗？`"
          >
            <el-button
              style="margin-left: 9px"
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              title="删除"
              @click="deleteCategory(row)"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
    >
      <el-form
        ref="categoryInfo"
        :rules="categoryRules"
        label-width="120px"
        :model="categoryInfo"
      >
        <el-form-item
          label="父级名称"
          v-if="categoryInfo.level > 1 && !categoryInfo.id"
        >
          <el-input :value="categoryInfo.pname" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="categoryInfo.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="ensureDialog">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Categroy",
  data() {
    return {
      allCategroy: [], // 菜单列表
      expandKeys: [], // 需要自动展开的项
      dialogVisible: false, //dialog的显示与关闭开关
      //收集分类的信息
      categoryInfo: {
        // 要操作的菜单权限对象
        id: "",
        level: 1,
        name: "",
        type_id: "",
        parent_id: "",
      },
      //新增分类的验证规则
      categoryRules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, message: "至少大于一个字", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getAllCategroy();
  },
  methods: {
    //请求获取分类数据列表
    async getAllCategroy() {
      const result = await this.$API.category.reqGetAllCategory();
      this.allCategroy = result.data;
      // this.expandKeys = [this.allCategroy[0].id];
    },
    // 根据级别得到要显示的添加dialog的标题
    getAddTitle(level) {
      if (level === 1) {
        return "添加二级分类";
      } else if (level === 2) {
        return "添加三级分类";
      } else {
        return "添加一级分类";
      }
    },
    //根据级别得到要显示的更新dialog的标题
    getUpdateTitle(level) {
      if (level === 1) {
        return "更新一级分类";
      } else if (level === 2) {
        return "更新二级分类";
      } else {
        return "更新三级分类";
      }
    },
    //添加分类
    addCategory(row) {
      this.dialogVisible = true;
      if (row) {
        this.categoryInfo.parent_id = row.type_id;
        this.categoryInfo.pname = row.name; // 用于显示父名称, 但提交请求时是不需要的
        this.categoryInfo.level = row.level + 1;
      }
    },
    //更新分类信息
    updateCategory(row) {
      console.log(row);
      this.dialogVisible = true;
      this.categoryInfo.id = row.id;
      this.categoryInfo.level = row.level;
      this.categoryInfo.name = row.name; // 用于显示父名称, 但提交请求时是不需要的
    },
    //dialog取消前的回调
    closeDialog() {
      //关闭对话框
      this.dialogVisible = false;
      // 清除数据
      this.categoryInfo = {
        // 要操作的菜单权限对象
        id: "",
        level: 0,
        name: "",
        type_id: "",
        parent_id: "",
      };
    },
    //dialog确认的回调
    async ensureDialog() {
      //解构需要的数据
      const { categoryInfo } = this;
      //发送请求
      //添加
      const result = await this.$API.category.reqAddOrUpdateCategory(
        categoryInfo
      );
      if (!categoryInfo.id && result.code == 200) {
        //提示
        this.$message({ type: "success", message: "添加成功" });
        //重新获取数据
        this.getAllCategroy();
        //关闭对话框
        this.dialogVisible = false;
        //清除数据
        this.categoryInfo = {
          id: "",
          level: 0,
          name: "",
          type_id: "",
          parent_id: "",
        };
      } else {
        if (result.code == 200) {
          //提示
          this.$message({ type: "success", message: "修改成功" });
          //重新获取数据
          this.getAllCategroy();
          //关闭对话框
          this.dialogVisible = false;
          //清除数据
          this.categoryInfo = {
            id: "",
            level: 0,
            name: "",
            type_id: "",
            parent_id: "",
          };
        }
      }
    },
    //删除的回调
    deleteCategory(row) {
      const { categoryInfo } = this;
      categoryInfo.id = row.id;
      categoryInfo.type_id = row.type_id;
      categoryInfo.name = row.name;
      categoryInfo.level = row.level;
    },
    //确认删除
    async ensureDelete() {
      const { categoryInfo } = this;
      const result = await this.$API.category.reqDeleteCategory(categoryInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getAllCategroy();
      }
    },
  },
  computed: {
    dialogTitle() {
      let { id, level } = this.categoryInfo;
      if (id) {
        return `修改${level}级分类名称`;
      } else if (level) {
        return `添加${this.categoryInfo.level}级分类`;
      } else {
        return `添加1级分类`;
      }
    },
  },
};
</script>
