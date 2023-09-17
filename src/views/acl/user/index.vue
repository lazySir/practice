<template>
  <el-card class="app-container">
    <!-- 最上层 -->
    <el-form inline>
      <!-- 表单元素 -->
      <el-form-item>
        <el-input v-model="name" placeholder="用户昵称" />
      </el-form-item>
      <!-- 查询与情况的按钮 -->
      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>
    <!-- 最上层的两个按钮 -->
    <div style="margin-bottom: 20px">
      <!-- 添加与批量添加按钮 -->
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button
        type="danger"
        @click="revomveUsers"
        :disabled="selectedIds.length === 0"
        >批量删除</el-button
      >
    </div>

    <!-- table表格：展示用户信息的地方 -->
    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="users"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="username" label="账号" width="150" />
      <el-table-column prop="name" label="用户昵称" width="150" />
      <el-table-column prop="role_name" label="角色">
        <template slot-scope="{ row, $index }">
          <el-tag
            style="margin: 0px 10px"
            v-for="item in row.role_name"
            type="success"
            >{{ item }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column width="100px" label="状态码">
        <template slot-scope="{ row, $index }">
          <el-switch
            :value="row.state"
            active-color="#13ce66"
            inactive-color="#909399"
            @change="changeStatus(row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-user-solid"
            title="分配角色"
            @click="showAssignRole(row)"
          />
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
            @click="showUpdateUser(row)"
          />
          <el-popconfirm
            :title="`确定删除 ${row.username} 吗?`"
            @onConfirm="removeUser(row.admin_id)"
          >
            <el-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除用户"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />
    <!-- 修改和添加对话框的结构 -->
    <el-dialog
      :title="user.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogUserVisible"
    >
      <el-form
        ref="userForm"
        :model="user"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item v-if="!user.id" label="密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="设置角色"
      :visible.sync="dialogRoleVisible"
      :before-close="resetRoleData"
    >
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="CheckedRoles"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="role in allRoles"
              :label="role.name"
              :key="role.role_id"
              >{{ role.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole"
          >保存</el-button
        >
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "AclUserList",

  data() {
    return {
      state: true,
      listLoading: false, // 是否显示列表加载的提示
      // 收集搜索条件输入的对象
      name: "",
      selectedIds: [], // 所有选择的user的id的数组
      users: [], // 当前页的用户列表
      page: 1, // 当前页码
      limit: 3, // 每页数量
      total: 0, // 总数量
      user: {}, // 当前要操作的user
      dialogUserVisible: false, // 是否显示用户添加/修改的dialog
      userRules: {
        // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: "用户名必须输入" },
          { min: 4, message: "用户名不能小于4位" },
        ],
        password: [{ required: true, validator: this.validatePassword }],
        name: [{ required: true }, { min: 2, message: "姓名不能小于2位" }],
      },
      loading: false, // 是否正在提交请求中
      dialogRoleVisible: false, // 是否显示角色Dialog
      allRoles: [], // 所有角色列表
      CheckedRoles: [], // 当前用户拥有的角色列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
    };
  },

  //发请求一般情况下，我们都是在mounted去发，但是也可以在created内部去发
  created() {
    this.getUsers();
  },

  methods: {
    /* 
    显示指定角色的界面
    */
    async showAssignRole(user) {
      this.user = user;
      let results = await this.$API.user.reqGetUserRole(user.admin_id);
      if (results.code == 200) {
        this.dialogRoleVisible = true;
        this.allRoles = results.data;
        //将allRoles中isChecked为true的role的name放到CheckedRoles中
        this.CheckedRoles = this.allRoles
          .filter((role) => role.isChecked)
          .map((role) => role.name);
        //如果allRoles里的isChecked都为true，那么checkAll为true
        this.checkAll = this.allRoles.every((item) => item.isChecked);
      }
    },

    /* 
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange(value) {
      //value true or false
      this.CheckedRoles = value ? this.allRoles.map((item) => item.name) : [];
      this.isIndeterminate = false;
    },

    /* 
    角色列表选中项发生改变的监听
    */
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allRoles.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allRoles.length;
    },

    /* 
    请求给用户进行角色授权
    */
    async assignRole() {
      const { user, CheckedRoles } = this;
      let results = await this.$API.user.reqUpdateUserRole({
        user,
        CheckedRoles,
      });
      if (results.code == 200) {
        this.$message.success(results.message || "授权成功");
        this.dialogRoleVisible = false;
        this.getUsers(user.id ? this.page : 1);
      }
    },

    /* 
    重置用户角色的数据
    */
    resetRoleData() {
      this.dialogRoleVisible = false;
      this.allRoles = [];
      this.userRoleIds = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    },

    /* 
    自定义密码校验
    */
    validatePassword(rule, value, callback) {
      if (!value) {
        callback("密码必须输入");
      } else if (!value || value.length < 5) {
        callback("密码不能小于5位");
      } else {
        callback();
      }
    },
    /* 
    根据输入进行搜索
    */
    async search() {
      const { page, limit, name } = this;
      console.log(page, limit, name);
      if (name.trim() === "") {
        this.$message.error("请输入搜索内容");
        return;
      }
      //发送请求
      let results = await this.$API.user.reqSearchUser(page, limit, name);
      if (results.code == 200) {
        let adminList = results.data.adminList;
        let total = results.data.total;
        //将管理员移出
        this.users = adminList.filter((item) => item.username !== "admin");
        //将adminList里的state状态码1改为true 0改为false
        this.users.forEach((item) => {
          item.state = item.state == 1 ? true : false;
        });
        this.users.forEach((item) => {
          item.role_name = item.role_name.join("、");
        });
        this.total = total - 1;
        this.$message.success(results.message || "搜索成功！");
      }
    },
    //改变用户账号使用状态
    async changeStatus(row) {
      //改变页面是state
      row.state = !row.state;
      let resuslts = await this.$API.user.reqUpdateState(row.id, row.state);
      if (resuslts.code == 200) {
        this.$message.success(resuslts.message || "修改状态成功");
      }
    },
    /* 
    重置输入后搜索
    */
    resetSearch() {
      this.name = "";
      this.getUsers();
    },

    /* 
    显示添加用户的界面
    */
    showAddUser() {
      this.user = {};
      this.dialogUserVisible = true;

      this.$nextTick(() => this.$refs.userForm.clearValidate());
    },

    /* 
    删除所有选中的用户
    */
    revomveUsers() {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let results = await this.$API.user.reqDeleteUsers(this.selectedIds);
          if (results.code == 200) {
            this.$message.success(results.message || "删除成功");
            this.getUsers();
          }
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },

    /* 
    列表选中状态发生改变的监听回调
    */
    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.admin_id);
    },

    /* 
    显示更新用户的界面
    */
    showUpdateUser(user) {
      this.user = cloneDeep(user);
      this.dialogUserVisible = true;
    },

    /* 
    删除某个用户
    */
    async removeUser(admin_id) {
      let results = await this.$API.user.reqDeleteUser(admin_id);
      if (results.code == 200) {
        this.$message.success("删除成功");
        this.getUsers(this.users.length === 1 ? this.page - 1 : this.page);
      }
    },

    /* 
    获取分页列表
    */
    async getUsers(page = 1) {
      this.page = page;
      const { limit } = this;
      this.listLoading = true;
      let results = await this.$API.user.reqGetUser(page, limit);
      if (results.code == 200) {
        this.listLoading = false;
        let adminList = results.data.adminList;
        let total = results.data.total;
        //将管理员移出
        this.users = adminList.filter((item) => item.username !== "admin");
        //将adminList里的state状态码1改为true 0改为false
        this.users.forEach((item) => {
          item.state = item.state == 1 ? true : false;
        });
        // this.users.forEach((item) => {
        //   item.role_name = item.role_name.join("、");
        // });
        this.total = total - 1;
      }

      // this.total = total - 1;
      // this.selectedIds = [];
    },

    /* 
    处理pageSize发生改变的监听回调
    */
    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getUsers();
    },

    /* 
    取消用户的保存或更新
    */
    cancel() {
      this.dialogUserVisible = false;
      this.user = {};
    },

    /* 
    保存或者更新用户
    */
    addOrUpdate() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          const { user } = this;
          let results = await this.$API.user.reqRegisterOrUpdate(user);
          this.loading = true;
          if (results.code == 200) {
            this.loading = false;
            this.$message.success("保存成功!");
            this.getUsers(user.id ? this.page : 1);
            this.user = {};
            this.dialogUserVisible = false;
          }
        }
      });
    },
  },
  computed: {
    getRoleNameArr() {},
  },
};
</script>
