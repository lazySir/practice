import request from '@/utils/request'

// 获取所有菜单菜单列表
export const reqGetAllAclMenusList=()=>request({
  url:`/admin/acl/menus/getAll/`,
  method:'get'
})
export const reqAddOrUpdateAclMenus=(data)=>request({
  url:`/admin/acl/menus/add`,  
  method:'post',
  data
})