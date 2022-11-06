<template>
  <div>
    <!-- 最上面的搜索区域 -->
    <el-form inline>
      <!-- 表单元素 -->
      <el-form-item>
        <el-input v-model="username" placeholder="用户名" />
      </el-form-item>
      <!-- 查询与情况的按钮 -->
      <el-button type="primary" icon="el-icon-search">查询</el-button>
      <el-button type="default">清空</el-button>
    </el-form>
    <!-- 两个按钮 -->
    <div style="margin-bottom: 20px">
      <!-- 添加与批量添加按钮 -->
      <el-button type="primary">添 加</el-button>
      <el-button type="danger">批量删除</el-button>
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

      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleName" label="权限列表" />

      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column prop="gmtModified" label="更新时间" width="180" />

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{ row }">
          <HintButton
            type="info"
            size="mini"
            icon="el-icon-user-solid"
            title="分配角色"
            @click="showAssignRole(row)"
          />
          <HintButton
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
            @click="showUpdateUser(row)"
          />
          <el-popconfirm
            :title="`确定删除 ${row.username} 吗?`"
            @onConfirm="removeUser(row.id)"
          >
            <HintButton
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索框的用户名
      username: "",
      //是否显示列表加载的提示
      listLoading:false,
    };
  },
};
</script>

<style></style>
