import request from '@/utils/request'

//获取所有品牌列表
export const reqGetTradeMarkList = (page,limit) => {
  return request({
    method: 'GET',
    url: `/admin/product/tradeMark/get/${page}/${limit}`
  })
}
//添加或者修改品牌 
export const reqAddOrUpdateTradeMarkList=(tmForm)=>{
  if(tmForm.id){
    //如果带给服务器数据携带ID 代表---》修改
    return request({
      url:"/admin/product/tradeMark/update",
      data:tmForm,
      method:"put",
    })
  }else{
    //新增数据
    return request({
      url:'/admin/product/tradeMark/add',
      data:tmForm,
      method:'post'
    })
  }
}
//根据ID获取品牌信息
export const reqGetTradeMarkListById = (page,limit,Id) => {
  return request({
    method: 'POST',
    url: `/admin/product/tradeMark/getById/${page}/${limit}`,
    data:Id
  })
}
//根据id删除品牌信息
export const reqDeleteTmList=(Id)=>request({
  method:'delete',
  url:`/admin/product/tradeMark/delete/${Id}`
})
//根据名字查询
export const reqGetTradeMarkListByName = (page,limit,searchBrand) => {
  return request({
    method: 'get',
    url: `/admin/product/tradeMark/getByName/${page}/${limit}/${searchBrand}`,
  })
}