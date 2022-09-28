import request from '@/utils/request'

export const reqCategory1List=()=>request({
  url:'/admin/product/getCategory1',
  method:'get'
})

export const reqCategory2List=(category1Id)=>request({
  url:`/admin/product/getCategory2/${category1Id}`,
  method:'get'
})
export const reqCategory3List=(category2Id)=>request({
  url:`/admin/product/getCategory3/${category2Id}`,
  method:'get'  
})

export const reqGetAllCategory = ()=>request({
  url:`/admin/product/getAllCategory`,
  method:'get'
})

export const reqAddOrUpdateCategory = (categoryInfo)=>{
  //修改
  if(categoryInfo.id){
    return request({
      url:'/admin/product/category/update',
      method:'put',
      data:categoryInfo
    })
  }
  //新增
  else{
    return request({
      url:`/admin/product/category/add`,
      method:'post',
      data:categoryInfo
    })
  }
}

export const reqDeleteCategory = (categoryInfo)=>request({
  url:`/admin/product/category/delete`,
  method:'delete',
  data:categoryInfo
})