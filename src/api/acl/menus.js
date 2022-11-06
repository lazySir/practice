import request from "@/utils/request";

// 获取所有菜单菜单列表
export const reqGetAllAclMenusList = () =>
  request({
    url: `/admin/acl/menus/getAll/`,
    method: "get",
  });
  //更新与添加菜单
export const reqAddOrUpdateAclMenus = (data) => {
  if (data.id) {
    return request({
      url:`/admin/acl/menus/update`,
      method:"put",
      data
    })
  } else {
    return request({
      url: `/admin/acl/menus/add`,
      method: "post",
      data,
    });
  }
};