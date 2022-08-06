import request from "@/utils/request";

//获取密码列表
export const reqGetPswList =(page,limit)=>request({
  url:`/admin/getPswManagerList/${page}/${limit}`,
  method:'get'
})

//添加或更新数据
export const reqAddOrUpdatePswList=(pswForm)=>{
  if(pswForm.id){
    //如果带给服务器数据携带ID 代表---》修改
    return request({
      url:"/admin/updatePswManager",
      data:pswForm,
      method:"put",
    })
  }else{
    //新增数据
    return request({
      url:'/admin/addPswManager',
      data:pswForm,
      method:'post'
    })
  }
}
//删除数据
export const reqDeletePswList = (id)=>request({
  url:`/admin/deletePswManager/${id}`,
  method:'delete'
})