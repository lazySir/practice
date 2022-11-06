<template>
  <el-card>
    <el-button
      @click="toAddPermission"
      type="primary"
      style="margin-bottom: 5px"
      icon="el-icon-plus"
      >添加</el-button
    >
    <el-table
      border
      style="margin-bottom: 20px"
      :data="menuPermissionList"
      row-key="key"
    >
      <el-table-column prop="aclKey" label="权限名称" />
      <el-table-column prop="aclValue" label="权限值" />

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.level === 3"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="toAddPermission(row)"
            :title="getAddTitle(row.level)"
          />

          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            :disabled="row.level === 1"
            @click="toUpdatePermission(row)"
            :title="row.level === 4 ? '修改功能' : '修改菜单'"
          />

          <el-button
            :disabled="row.level === 1"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removePermission(row)"
            title="删除"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :title="dialogTitle"
      @close="resetData"
    >
      <el-form
        ref="permission"
        :model="permission"
        :rules="permissionRules"
        label-width="120px"
      >
        <el-form-item
          label="父级名称"
          v-if="permission.level > 1 && !permission.id"
        >
          <el-input :value="permission.paclKey" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="aclKey">
          <el-input v-model="permission.aclKey" />
        </el-form-item>

        <el-form-item label="功能权限值" prop="ackValue">
          <el-input v-model="permission.aclValue" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 菜单权限校验的规则
const menuRules = {
  aclKey: [{ required: true, message: "名称必须输入" }],
  aclValue: [{ required: true, message: "权限值必须输入" }],
};

// 按钮功能权限校验的规则
const btnRules = {
  aclKey: [{ required: true, message: "名称必须输入" }],
  aclValue: [{ required: true, trigger: "blur", message: "功能权限值必须输入" }],
};

export default {
  name: "permission",

  data() {
    return {
      dialogVisible: false, //添加一级权限对话框
      menuPermissionList: [], // 菜单列表
      dialogPermissionVisible: false, // 是否显示菜单权限的Dialog
      permission: {
        // 要操作的菜单权限对象
        level: 1,
        aclValue: "",
        aclKey: "",
      },
    };
  },

  computed: {
    /* 
    动态计算得到Dialog的标题
    */
    dialogTitle() {
      const { id, level } = this.permission;
      if (id) {
        return level === 3 ? "修改功能" : "修改菜单";
      } else {
        return level === 3
          ? "添加功能"
          : `添加${level === 1 ? "一级" : "二级"}菜单`;
      }
    },

    /* 
    根据权限的等级来计算确定校验规则
    */
    permissionRules() {
      return this.permission.level === 3 ? btnRules : menuRules;
    },
  },

  mounted() {
    this.fetchPermissionList();
  },

  methods: {
    /* 
    根据级别得到要显示的添加dialog的标题
    */
    getAddTitle(level) {
      if (level === 1) {
        return "添加菜单";
      } else {
        return "添加功能";
      }
    },

    /* 
    请求获取权限菜单数据列表
    */
    async fetchPermissionList() {
      const result = await this.$API.menus.reqGetAllAclMenusList();
      if (result.code == 200) {
        this.$message.success("获取权限菜单数据成功");
        this.menuPermissionList = result.data;
        // this.expandKeys = [this.menuPermissionList.id];
      }
    },

    /* 
    显示添加权限的界面(菜单或功能)
    */
    toAddPermission(row) {
      this.dialogPermissionVisible = true;

      if (row.level) {
        console.log(row)
        this.permission.type_id = row.type_id;
        this.permission.level = row.level + 1;
        this.permission.paclKey = row.aclKey; // 用于显示父名称, 但提交请求时是不需要的
      }

      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.permission.clearValidate());
    },

    /* 
    显示菜单添加或更新的dialog
    */
    toUpdatePermission(row) {
      this.dialogPermissionVisible = true;
      this.permission = { ...row }; // 使用浅拷贝

      // 清除校验(必须在界面更新之后)
      this.$nextTick(() => this.$refs.permission.clearValidate());
    },

    /* 
    删除某个权限节点
    */
    removePermission(permission) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.permission.removePermission(
            permission.id
          );
          this.$message.success(result.message || "删除成功!");
          this.fetchPermissionList();
        })
        .catch((error) => {
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },

    /* 
    添加或更新功能权限
    */
    addOrUpdatePermission() {
      this.$refs.permission.validate(async (valid) => {
        if (valid) {
          const { paclKey, ...perm } = this.permission; // p不需要携带
          const result = await this.$API.menus.reqAddOrUpdateAclMenus(perm)
          this.$message.success(
            result.message || `${perm.id ? "修改" : "添加"}成功!`
          );
          this.resetData();
          this.fetchPermissionList();
        }
      });
    },

    /* 
    重置数据
    */
    resetData() {
      this.dialogPermissionVisible = false;
      this.permission = {
        level: 1,
        aclKey: "",
        aclValue: "",
      };
    },
  },
};
</script>
