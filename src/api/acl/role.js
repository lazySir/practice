import request from "@/utils/request";

//根据分页获取角色列表
export const reqGetRoleList = (page,limit)=>request({
  url:`/admin/acl/role/get/${page}/${limit}`,
  method:"get"
})

//更新角色名称
export const reqUpdateRoleName = (data)=>request({
  url:`/admin/acl/role/updateName`,
  method:"put",
  data
})
