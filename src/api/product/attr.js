import request from '@/utils/request'

//根据三级分类id获取attr列表
export const reqGetAttrListById=(category1Id,category2Id,category3Id)=>request({
    url:`/admin/product/attr/getListById/${category1Id}/${category2Id}/${category3Id}`,
    method:'get'
})
//添加或者修改
export const reqAddOrUpdateAttr = (attrInfo) =>
{
  if(attrInfo.id){
    //如果存在id属性那么就是修改操作
    return request({
      url:'/admin/product/attr/update',
      method:'put',
      data:attrInfo
    })
  }else{
    //新增操作
    return request({
      url:'/admin/product/attr/add',
      method:'post',
      data:attrInfo
    })
  }
}
//删除
export const reqDelteAttr = (Id) => request({
  url:`/admin/product/attr/delete/${Id}`,
  method:'delete'
})

//根据名字搜索
export const reqGetAttrListByName=(searchName)=>request({
  url:`/admin/product/attr/getListByName/${searchName}`,
  method:'get'
})