<template>
  <div>
    <el-input disabled :value="$route.query.name"></el-input>
    <el-tree
      style="margin: 20px 0"
      ref="tree"
      :data="allPermissions"
      node-key="aclKey"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace('/acl/role')">取消</el-button>
  </div>
</template>
<script>
export default {
  name: "roleAuth",

  data() {
    return {
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
      allPermissions: [], // 所有
      defaultProps: {
        children: "children",
        label: "aclKey",
      },
    };
  },

  created() {
    this.init();
  },

  methods: {
    /*
      初始化
      */
    init() {
      const roleId = this.$route.params.id;
      this.getPermissions(roleId);
    },

    /*
      获取指定角色的权限列表
      */
    async getPermissions(roleId) {
      let resulst = await this.$API.role.reqGetAuth(roleId);
      if (resulst.code == 200) {
        const allPermissions = resulst.data;
        this.reChecked(allPermissions);
        this.allPermissions = allPermissions;
        const checkedIds = this.getCheckedIds(allPermissions);

        this.$refs.tree.setCheckedKeys(checkedIds);
      }
    },
    reChecked(allPermissions) {
      allPermissions.forEach((item) => {
        if (
          item.children &&
          item.children.length > 0 &&
          item.isChecked === true
        ) {
          //判断子元素的isChecked是否都为true ，如果是则不做处理返回ture 如果不是则修改父元素的isChecked
          let flag = item.children.every((item) => item.isChecked === true);
          if (!flag) {
            item.isChecked = false;
            console.log("enter");
          }
          if (
            item.children &&
            item.children.length > 0 &&
            item.isChecked === true
          )
            this.reChecked(item.children);
        }
      });
    },
    /*
      得到所有选中的aclKey列表
      */
    getCheckedIds(auths, initArr = []) {
      return auths.reduce((pre, item) => {
        if (item.isChecked) {
          pre.push(item.aclKey);
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr);
        }
        return pre;
      }, initArr);
    },

    /*
      保存权限列表
      */
    async save() {
      var aclKeys = this.$refs.tree.getCheckedNodes(false, true);
      //过滤aclKeys获取aclKey
      aclKeys = aclKeys.map((item) => item.aclKey);
      /*
        vue elementUI tree树形控件获取父节点ID的实例
        修改源码:
        情况1: element-ui没有实现按需引入打包
          node_modules\element-ui\lib\element-ui.common.js    25382行修改源码  去掉 'includeHalfChecked &&'
          // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        情况2: element-ui实现了按需引入打包
          node_modules\element-ui\lib\tree.js    1051行修改源码  去掉 'includeHalfChecked &&'
          // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        */
      // this.loading = true;
      let results = await this.$API.role.reqUpdateAuth(
        this.$route.params.id,
        aclKeys
      );
      if (results.code == 200) {
        this.$message.success("保存成功");
        this.$router.replace("/acl/role");
      }

      // this.$API.permission
      //   .doAssign(this.$route.params.id, ids)
      //   .then((result) => {
      //     this.loading = false;
      //     this.$message.success(result.$message || "分配权限成功");
      //     // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
      //     const roleName = this.$route.query.roleName;
      //     const roles = this.$store.getters.roles;
      //     this.$router.replace("/acl/role/list", () => {
      //       console.log("replace onComplete");
      //       // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
      //       if (roles.includes(roleName)) {
      //         window.location.reload();
      //       }
      //     });
      //   });
    },
  },
};
</script>
