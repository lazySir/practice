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
//添加角色
export const reqAddRole = (data)=>request({
  url:`/admin/acl/role/add`,
  method:"post",
  data
})

//查找角色
export const reqSearchRole=(data)=>request({
  url:`/admin/acl/role/search`,
  method:"post",
  data
})
//根据id获取权限
export const reqGetAuth=(id)=>request({
  url:`/admin/acl/role/getAuth/${id}`,
  method:"get"
}) 
//根据id修改权限值
export const reqUpdateAuth=(id,data)=>request({
  url:`/admin/acl/role/updateAuth/${id}`,
  method:"put",
  data
})