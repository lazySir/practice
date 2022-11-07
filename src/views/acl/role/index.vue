<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-input v-model="searchName" placeholder="角色名称" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="addRole">添加</el-button>
      <el-button
        type="danger"
        @click="removeRoles()"
        :disabled="selectedRoles.length === 0"
        >批量删除</el-button
      >
    </div>

    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="roles"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="{ row, $index }">
          <!-- 这里的结构需要span和input来回切换 -->
          <el-input
            v-if="row.flag"
            @blur="tolook(row)"
            @keyup.native.enter="tolook(row)"
            v-model="row.name"
            size="mini"
            :ref="$index"
          />

          <span style="display: block" @click="toEdit(row, $index)" v-else>{{
            row.name
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="{ row, $index }">
          <el-button
            size="mini"
            type="info"
            icon="el-icon-info"
            title="分配权限"
            @click="assignPermission(row)"
          />

          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            title="确定"
            @click="tolook(row)"
            v-if="row.flag"
          />
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            title="修改角色"
            @click="toEdit(row, $index)"
            v-if="!row.flag"
          />

          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            title="删除角色"
            @click="removeRole(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getRoles"
      @size-change="handleSizeChange"
    />
  </el-card>
</template>

<script>
export default {
  name: "RoleList",

  data() {
    return {
      listLoading: true, // 数据是否正在加载
      roles: [], // 角色列表
      total: 0, // 总记录数
      page: 1, // 当前页码
      limit: 5, // 每页记录数
      // 收集搜索条件数据
      searchName: "",
      selectedRoles: [], // 所有选中的角色列表
    };
  },

  mounted() {
    this.getRoles();
  },

  methods: {
    /*
    更新角色
    */
    async updateRole(role) {
      const data = {
        id: role.id,
        name: role.name,
      };
      let results = await this.$API.role.reqUpdateRoleName(data);
      if (results.code === 200) {
        this.$message.success(results.message || "更新角色成功!");
      }
      this.getRoles(this.page);
    },
    assignPermission(row) {
      this.$router.push(`/acl/role/auth/${row.id}?name=${row.name}`);
    },
    /*
    每页数量发生改变的监听
    */
    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getRoles();
    },

    /*
    添加角色
    */
    addRole() {
      // 显示添加界面
      this.$prompt("请输入新名称", "添加角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.$API.role.reqAddRole({ name: value }).then((result) => {
            this.$message.success(result.message || "添加角色成功");
            this.getRoles();
          });
        })
        .catch(() => {
          this.$message.warning("取消添加");
        });
    },

    /*
    异步获取角色分页列表
    */
    async getRoles(page = 1) {
      this.page = page;
      this.listLoading = true;
      const { limit } = this;
      let resutls = await this.$API.role.reqGetRoleList(page, limit);
      if (resutls.code == 200) {
        const { list, total } = resutls.data;
        this.roles = list.map((item) => {
          item.flag = false; //用于标识是否现实编辑输入框的属性
          item.originRoleName = item.name; //缓存角色名称，用于取消
          return item;
        });
        this.total = total;
        this.listLoading = false;
      }
    },

    /*
    根据搜索条件进行搜索
    */
    async search() {
      const { searchName } = this;
      let results = await this.$API.role.reqSearchRole({ name: searchName });
      if (results.code == 200) {
        const { list, total } = results.data;
        this.roles = list.map((item) => {
          item.flag = false; //用于标识是否现实编辑输入框的属性
          item.originRoleName = item.name; //缓存角色名称，用于取消
          return item;
        });
        this.total = total;
        this.listLoading = false;
      }
      // this.getRoles();
    },

    /*
    重置查询表单搜索列表
    */
    resetSearch() {
      this.searchName = "";
      this.getRoles();
    },

    /*
    删除指定的角色
    */
    removeRole({ id, roleName }) {
      this.$confirm(`确定删除 '${roleName}' 吗?`, "提示", {
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.role.removeById(id);
          this.getRoles(this.roles.length === 1 ? this.page - 1 : this.page);
          this.$message.success(result.message || "删除成功!");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    /*
    当表格复选框选项发生变化的时候触发
    */
    handleSelectionChange(selection) {
      this.selectedRoles = selection;
    },

    /*
    批量删除
    */
    removeRoles() {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const ids = this.selectedRoles.map((role) => role.id);
          const result = await this.$API.role.removeRoles(ids);
          this.getRoles();
          this.$message({
            type: "success",
            message: "批量删除成功!",
          });
        })
        .then((result) => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //修改角色名称 失去焦点的事件---切换为查看模式 ---展示span
    tolook(row) {
      row.flag = false;
      this.updateRole(row);
      // }
    },
    //点击span的回调 变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点 实现自动聚焦
      //点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重回与重排耗时间的
      //点击span的时候 需要耗时间的，所以不可能一点击span立马获取input
      //这时候九需要nextTick，当节点渲染完，会执行一次
      this.$nextTick(() => {
        //实现聚焦
        this.$refs[index].focus();
      });
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
