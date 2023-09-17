import request from "@/utils/request";

export const reqRegisterOrUpdate = (data) => {
  if (data.id) {
    return request({
      url: "/admin/acl/user/updateUser",
      method: "put",
      data,
    });
  } else {
    return request({
      url: `/admin/acl/user/register`,
      method: "post",
      data,
    });
  }
};

export const reqGetUser = (page, limit) =>
  request({
    url: `/admin/acl/user/get/${page}/${limit}`,
    method: "get",
  });
export const reqUpdateState = (id, state) =>
  request({
    url: `/admin/acl/user/updateState/${id}/${state}`,
    method: "put",
  });
export const reqSearchUser = (page, limit, name) =>
  request({
    url: `/admin/acl/user/searchUser/${page}/${limit}/${name}`,
    method: "get",
  });
export const reqDeleteUser = (admin_id) =>
  request({
    url: `/admin/acl/user/deleteUser/${admin_id}`,
    method: "delete",
  });
export const reqGetUserRole=(admin_id)=>{
  return request({
    url:`/admin/acl/user/getUserRole/${admin_id}`,
    method:'get'
  })
}
export const reqUpdateUserRole=(data)=>{
  return request({
    url:`/admin/acl/user/updateUserRole`,
    method:'put',
    data
  })
}
export const reqDeleteUsers=(data)=>{
  return request({
    url:`/admin/acl/user/deleteUsers`,
    method:'delete',
    data
  })
}
//在注册界面注册
export const reqRegister = (data)=>{
  return request({
    url:`/api/user/register`,
    method:'post',
    data
  })
}
//注册界面发送邮箱验证码
export const  reqGetEmailCode=(email)=>{
  return request({
    url:`/api/sendCode`,
    method:'post',
    data:{email}
  })
}
//注册界面获取验证码
export const reqGetCode=()=>{
  return request({
    url:`/api/getSvgCaptcha`,
    method:'get'
  })
}